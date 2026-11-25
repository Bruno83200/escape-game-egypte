// js/minigames/scarab-slots.js — Épreuves de placement tactile (Épreuve 2 Scarabées & Épreuve 13 Sceau d'Or)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

/**
 * Atelier générique de placement dans 3 encoches sacrées (clic ou glisser-déposer).
 */
function launchThreeSlotsPuzzle({
  kicker,
  title,
  instruction,
  hint,
  referenceImage = null,
  referenceLabel = "",
  slotTitles,
  tokens,         // [{ id, label, sub, color?, image?, svg? }]
  expectedOrder,  // [id0, id1, id2]
  placeSfx = "clic_pierre",
  successSfx = "succes",
  successText = "Le mécanisme s'enclenche !",
  failText = "L'ordre ne correspond pas. Retirez un artefact ou réinitialisez.",
  onSolved
}) {
  openWorkbench({
    kicker,
    title,
    instruction,
    hint,
    render(api) {
      const placed = [null, null, null];
      let selectedId = null;
      let locked = false;

      const wrap = document.createElement("div");
      wrap.className = "slots-stage";

      if (referenceImage) {
        const refRow = document.createElement("div");
        refRow.className = "dial-ref-strip";
        refRow.innerHTML = `
          <img src="${referenceImage}" alt="${referenceLabel}" />
          <span>${referenceLabel} — cliquez sur l'image pour ouvrir la loupe.</span>
        `;
        refRow.querySelector("img").addEventListener("click", () => openLightbox(referenceImage, referenceLabel));
        wrap.appendChild(refRow);
      }

      const slotsRow = document.createElement("div");
      slotsRow.className = "slots-row";
      wrap.appendChild(slotsRow);

      const tray = document.createElement("div");
      tray.className = "relic-tray";
      wrap.appendChild(tray);

      api.stage.appendChild(wrap);

      const btnReset = document.createElement("button");
      btnReset.type = "button";
      btnReset.className = "btn-papyrus";
      btnReset.textContent = "Tout retirer";

      const btnValidate = document.createElement("button");
      btnValidate.type = "button";
      btnValidate.className = "btn-lapis";
      btnValidate.textContent = "Activer le mécanisme";

      api.footer.append(btnReset, btnValidate);

      function renderTokenGraphic(tok) {
        if (tok.image) {
          return `<img src="${tok.image}" alt="${tok.label}" draggable="false" />`;
        }
        return tok.svg || "";
      }

      function renderAll() {
        slotsRow.innerHTML = "";
        placed.forEach((tokId, idx) => {
          const tok = tokens.find((t) => t.id === tokId);
          const slot = document.createElement("button");
          slot.type = "button";
          slot.className = `socket-slot ${tok ? "is-filled" : ""} ${selectedId && !tok ? "is-drop-ready" : ""}`;
          slot.dataset.idx = String(idx);
          slot.innerHTML = `
            <span class="socket-index">${slotTitles[idx]}</span>
            ${tok
              ? `<div class="socket-content">${renderTokenGraphic(tok)}<span class="socket-label">${tok.label}</span></div>`
              : `<span class="socket-placeholder">${selectedId ? "Cliquer pour insérer" : "Encoche vide"}</span>`
            }
          `;

          slot.addEventListener("click", () => {
            if (locked) return;
            api.clearStatus();
            if (selectedId) {
              // Retirer cet artefact s'il était ailleurs
              const prevIdx = placed.indexOf(selectedId);
              if (prevIdx !== -1) placed[prevIdx] = null;
              placed[idx] = selectedId;
              selectedId = null;
              sound.playSFX(placeSfx, 0.65);
              renderAll();
            } else if (placed[idx]) {
              // Retirer de l'encoche
              placed[idx] = null;
              sound.playSFX("clic_pierre", 0.4);
              renderAll();
            }
          });

          // Support glisser-déposer HTML5
          slot.addEventListener("dragover", (e) => {
            if (locked) return;
            e.preventDefault();
            slot.classList.add("is-drop-ready");
          });
          slot.addEventListener("dragleave", () => {
            slot.classList.remove("is-drop-ready");
          });
          slot.addEventListener("drop", (e) => {
            if (locked) return;
            e.preventDefault();
            const droppedId = e.dataTransfer.getData("text/plain");
            if (!droppedId) return;
            const prevIdx = placed.indexOf(droppedId);
            if (prevIdx !== -1) placed[prevIdx] = null;
            placed[idx] = droppedId;
            selectedId = null;
            sound.playSFX(placeSfx, 0.65);
            renderAll();
          });

          slotsRow.appendChild(slot);
        });

        tray.innerHTML = "";
        tokens.forEach((tok) => {
          const isUsed = placed.includes(tok.id);
          const card = document.createElement("button");
          card.type = "button";
          card.className = `relic-token ${selectedId === tok.id ? "is-selected" : ""} ${isUsed ? "is-placed" : ""}`;
          card.draggable = !isUsed && !locked;
          card.disabled = isUsed;
          card.innerHTML = `
            ${renderTokenGraphic(tok)}
            <span>${tok.label}</span>
          `;

          card.addEventListener("click", () => {
            if (locked || isUsed) return;
            api.clearStatus();
            selectedId = selectedId === tok.id ? null : tok.id;
            sound.playSFX("clic_pierre", 0.35);
            renderAll();
          });

          card.addEventListener("dragstart", (e) => {
            if (locked || isUsed) return;
            e.dataTransfer.setData("text/plain", tok.id);
            selectedId = tok.id;
          });

          tray.appendChild(card);
        });

        btnValidate.disabled = placed.some((p) => !p) || locked;
      }

      btnReset.addEventListener("click", () => {
        if (locked) return;
        placed.fill(null);
        selectedId = null;
        api.clearStatus();
        renderAll();
      });

      btnValidate.addEventListener("click", () => {
        if (locked || placed.some((p) => !p)) return;
        const ok = expectedOrder.every((id, i) => placed[i] === id);
        if (ok) {
          locked = true;
          sound.playSFX(successSfx, 0.72);
          api.setStatus(successText, "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 950);
        } else {
          sound.playSFX("echec", 0.65);
          api.setStatus(failText, "error");
        }
      });

      renderAll();
    }
  });
}

function makeScarabSvg(fillMain, fillHighlight, strokeColor) {
  return `
    <svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
      <defs>
        <radialGradient id="sg-${fillMain.replace("#", "")}" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${fillHighlight}" />
          <stop offset="100%" stop-color="${fillMain}" />
        </radialGradient>
      </defs>
      <path d="M18 22 10 14M46 22 54 14M16 34 8 34M48 34 56 34M19 46 11 54M45 46 53 54" stroke="${strokeColor}" stroke-width="2.4" stroke-linecap="round"/>
      <ellipse cx="32" cy="36" rx="15" ry="19" fill="url(#sg-${fillMain.replace("#", "")})" stroke="${strokeColor}" stroke-width="2.2"/>
      <ellipse cx="32" cy="18" rx="9" ry="6" fill="${fillMain}" stroke="${strokeColor}" stroke-width="2"/>
      <path d="M32 23v31M20 27c7 3 17 3 24 0" stroke="rgba(255,255,255,0.45)" stroke-width="1.6" fill="none"/>
      <circle cx="27" cy="33" r="3" fill="rgba(255,255,255,0.38)"/>
    </svg>
  `;
}

export function launchScarabPuzzle({ onSolved }) {
  launchThreeSlotsPuzzle({
    kicker: "Chapitre I · Fresque des Scarabées",
    title: "Aligner les Scarabées Solaires",
    instruction: "« Le Nil à l'aube (Bleu), le soleil au zénith (Rouge), mais la forêt (Vert) toujours au milieu. » Sélectionnez chaque scarabée puis touchez son encoche.",
    hint: "Ordre de gauche à droite : 1. Scarabée Bleu (Nil) · 2. Scarabée Vert (Forêt au milieu) · 3. Scarabée Rouge (Soleil).",
    slotTitles: ["1 · Aube", "2 · Centre", "3 · Zénith"],
    tokens: [
      { id: "vert", label: "Scarabée Vert", svg: makeScarabSvg("#226f54", "#66c79a", "#144232") },
      { id: "rouge", label: "Scarabée Rouge", svg: makeScarabSvg("#a83226", "#f07c67", "#631b14") },
      { id: "bleu", label: "Scarabée Bleu", svg: makeScarabSvg("#1b4c80", "#5da3e8", "#0f2e50") }
    ],
    expectedOrder: ["bleu", "vert", "rouge"],
    placeSfx: "clic_pierre",
    successSfx: "pierre_glisse",
    successText: "Les trois scarabées s'emboîtent ! Un grondement fait pivoter le mur.",
    failText: "Les scarabées refusent de s'enclencher. Relisez la devise du Nil, de la forêt et du soleil.",
    onSolved
  });
}

export function launchGoldenSealPuzzle({ onSolved }) {
  launchThreeSlotsPuzzle({
    kicker: "Chapitre IV · L'Autel du Sceau d'Or",
    title: "L'Ordre de la Création",
    instruction: "Déposez les trois clés sacrées du royaume dans les encoches de l'autel selon l'ordre de la Genèse.",
    hint: "La Vie en premier (Ankh), puis le Regard (Oudjat), et enfin la Stabilité éternelle (Pilier Djed).",
    referenceImage: "assets/images/items/ordre_indice.webp",
    referenceLabel: "Relevé : L'Ordre de la Création",
    slotTitles: ["1 · Commencement", "2 · Vision", "3 · Éternité"],
    tokens: [
      { id: "djed", label: "Pilier Djed", image: "assets/images/items/djed_item.webp" },
      { id: "ankh", label: "Ankh de Bronze", image: "assets/images/items/ankh_item.webp" },
      { id: "oudjat", label: "Amulette Oudjat", image: "assets/images/items/oudjat_item.webp" }
    ],
    expectedOrder: ["ankh", "oudjat", "djed"],
    placeSfx: "declic_magique",
    successSfx: "mecanisme_final",
    successText: "L'autel s'embrase d'or ! Un pont de pierre se déploie au-dessus de l'abîme.",
    failText: "Les artefacts ne résonnent pas dans cet ordre. Observez le relevé de la Création.",
    onSolved
  });
}
