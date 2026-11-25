// js/engine/scenes-engine.js — Moteur principal de « L'Héritage d'Anubis »
import { auth, db } from "../config.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { ZONES, scenes, SCENE_ORDER } from "../data/scenes.js";
import { sound } from "./audio.js";
import {
  state,
  hydrateLocalExtras,
  markSceneVisited,
  syncProgressToFirebase
} from "./state.js";
import {
  getChoiceIcon,
  showModal,
  showZoneAnnouncement,
  renderInventoryBar,
  renderZoneStepper,
  updateJournalBadge,
  initJournalModal
} from "./ui.js";

import { createZone1Actions } from "../enigmes/zone1.js";
import { createZone2Actions } from "../enigmes/zone2.js";
import { createZone3Actions } from "../enigmes/zone3.js";
import { createZone4Actions } from "../enigmes/zone4.js";

// --- Double couche de décor avec fondu enchaîné fluide ---
let activeLayer = "a";
const preloadedImages = new Set();

function preloadImage(src) {
  if (!src || preloadedImages.has(src)) return;
  preloadedImages.add(src);
  const img = new Image();
  img.src = src;
}

function transitionBackground(imageUrl) {
  const layerA = document.getElementById("scene-layer-a");
  const layerB = document.getElementById("scene-layer-b");
  if (!layerA || !layerB || !imageUrl) return;

  const incoming = activeLayer === "a" ? layerB : layerA;
  const outgoing = activeLayer === "a" ? layerA : layerB;

  const applySwap = () => {
    incoming.style.backgroundImage = `url('${imageUrl}')`;
    requestAnimationFrame(() => {
      incoming.classList.add("is-visible");
      outgoing.classList.remove("is-visible");
      activeLayer = activeLayer === "a" ? "b" : "a";
    });
  };

  if (preloadedImages.has(imageUrl)) {
    applySwap();
  } else {
    const img = new Image();
    img.onload = () => {
      preloadedImages.add(imageUrl);
      applySwap();
    };
    img.onerror = applySwap;
    img.src = imageUrl;
  }
}

function preloadUpcomingScenes(currentId) {
  const idx = SCENE_ORDER.indexOf(currentId);
  if (idx === -1) return;
  for (let offset = 1; offset <= 2; offset++) {
    const nextId = SCENE_ORDER[idx + offset];
    if (nextId && scenes[nextId]?.image) {
      preloadImage(scenes[nextId].image);
    }
  }
}

// --- Moteur exposé aux modules d'énigmes ---
const engine = {
  async goTo(sceneId) {
    await renderScene(sceneId, true);
  },
  async save() {
    renderInventoryBar();
    await syncProgressToFirebase(state.currentScene);
  }
};

// Table unifiée de toutes les actions d'énigmes
const actions = {
  ...createZone1Actions(engine),
  ...createZone2Actions(engine),
  ...createZone3Actions(engine),
  ...createZone4Actions(engine)
};

async function renderScene(sceneId, persist = true) {
  const scene = scenes[sceneId] || scenes["antichambre_sable"];
  const safeId = scenes[sceneId] ? sceneId : "antichambre_sable";

  state.currentScene = safeId;
  markSceneVisited(safeId);

  // Décor + préchargement des 2 salles suivantes
  transitionBackground(scene.image);
  preloadUpcomingScenes(safeId);

  // Ambiance sonore
  if (scene.ambience) {
    sound.playAmbience(scene.ambience);
  } else {
    sound.stopAmbience();
  }

  // En-tête de chapitre & stepper
  const zoneObj = ZONES.find((z) => z.id === scene.zone) || ZONES[0];
  document.getElementById("zone-label").textContent = `Chapitre ${zoneObj.roman} · ${zoneObj.name}`;
  document.getElementById("scene-title").textContent = scene.title;
  document.getElementById("folio-step-pill").textContent = `Relevé ${String(scene.step).padStart(2, "0")} / 28`;
  document.getElementById("folio-subtitle").textContent = scene.title;
  renderZoneStepper(zoneObj.id);

  // Bannière d'annonce lors d'un changement de chapitre
  if (state.lastZone !== null && state.lastZone !== zoneObj.id) {
    showZoneAnnouncement(zoneObj);
  }
  state.lastZone = zoneObj.id;

  // Texte narratif avec animation douce
  const descEl = document.getElementById("description-text");
  descEl.style.opacity = "0";
  setTimeout(() => {
    descEl.textContent = scene.text;
    descEl.style.transition = "opacity 0.35s ease";
    descEl.style.opacity = "1";
  }, 60);

  // Bouton d'indice contextuel (Carnet de Howard Carter)
  const hintBtn = document.getElementById("btn-scene-hint");
  if (scene.hint) {
    hintBtn.style.display = "inline-flex";
    hintBtn.onclick = () => {
      sound.playSFX("papyrus", 0.5);
      showModal({
        title: "Note de Howard Carter",
        kicker: `Chapitre ${zoneObj.roman} · Indice de Fouille`,
        text: scene.hint,
        buttonText: "Merci, Professeur"
      });
    };
  } else {
    hintBtn.style.display = "none";
  }

  // Boutons de choix
  const grid = document.getElementById("choices-grid");
  grid.innerHTML = "";
  scene.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = choice.primary ? "btn-lapis" : "btn-papyrus";
    btn.innerHTML = `
      ${getChoiceIcon(choice.icon || "arrow")}
      <span>${choice.text}</span>
    `;
    btn.addEventListener("click", () => {
      if (choice.action && typeof actions[choice.action] === "function") {
        actions[choice.action]();
      } else if (choice.next) {
        sound.playSFX("pas_pierre", 0.45);
        renderScene(choice.next, true);
      }
    });
    grid.appendChild(btn);
  });

  // Toujours ré-ouvrir le folio quand on change de salle pour lire la nouvelle scène
  const dock = document.getElementById("folio-dock");
  if (dock.classList.contains("is-collapsed")) {
    dock.classList.remove("is-collapsed");
    document.getElementById("collapse-label").textContent = "Vue décor";
  }

  renderInventoryBar();
  updateJournalBadge();

  if (persist) {
    await syncProgressToFirebase(safeId);
  }
}

// --- Contrôles permanents (Audio, Vue décor, Carnet, Déconnexion) ---
function initChromeControls() {
  initJournalModal();

  // Bouton Audio
  const btnAudio = document.getElementById("btn-audio");
  const iconOn = document.getElementById("icon-audio-on");
  const iconOff = document.getElementById("icon-audio-off");
  const syncAudioUi = () => {
    const muted = sound.isMuted();
    btnAudio.classList.toggle("is-muted", muted);
    iconOn.style.display = muted ? "none" : "block";
    iconOff.style.display = muted ? "block" : "none";
  };
  syncAudioUi();
  btnAudio.addEventListener("click", () => {
    sound.toggleMute();
    syncAudioUi();
  });

  // Repli / dépli du folio pour admirer les décors
  const dock = document.getElementById("folio-dock");
  const btnCollapse = document.getElementById("btn-collapse-folio");
  const collapseLabel = document.getElementById("collapse-label");
  btnCollapse.addEventListener("click", () => {
    const collapsed = dock.classList.toggle("is-collapsed");
    collapseLabel.textContent = collapsed ? "Afficher le carnet" : "Vue décor";
  });

  // Déconnexion Firebase
  document.getElementById("btn-logout").addEventListener("click", async () => {
    sound.stopAmbience();
    await signOut(auth);
    window.location.href = "index.html";
  });
}

// --- Point d'entrée avec authentification obligatoire Firebase ---
initChromeControls();

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  state.uid = user.uid;
  hydrateLocalExtras(user.uid);

  try {
    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (userSnap.exists()) {
      const data = userSnap.data();
      state.pseudo = data.pseudo || "Explorateur";
      state.inventory = Array.isArray(data.inventory) ? [...data.inventory] : [];
      state.currentScene = data.currentScene || "antichambre_sable";
    } else {
      state.pseudo = user.email?.split("@")[0] || "Explorateur";
      state.inventory = [];
      state.currentScene = "antichambre_sable";
    }
  } catch (err) {
    console.error("Erreur lecture profil Firestore :", err);
  }

  document.getElementById("player-name").textContent = state.pseudo;
  await renderScene(state.currentScene, false);
});
