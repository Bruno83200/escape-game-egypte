// js/engine/state.js — État de l'expédition & synchronisation Firestore (schéma heritage-anubis)
import { db } from "../config.js";
import {
  doc,
  updateDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const state = {
  uid: null,
  pseudo: "Explorateur",
  currentScene: "antichambre_sable",
  inventory: [],
  discoveredClues: [],
  visitedScenes: [],
  lastZone: null
};

const localKey = (uid, suffix) => `anubis_v2_${uid || "anon"}_${suffix}`;

export function hydrateLocalExtras(uid) {
  try {
    const clues = JSON.parse(localStorage.getItem(localKey(uid, "clues")) || "[]");
    const visited = JSON.parse(localStorage.getItem(localKey(uid, "visited")) || "[]");
    state.discoveredClues = Array.isArray(clues) ? clues : [];
    state.visitedScenes = Array.isArray(visited) ? visited : [];
  } catch {
    state.discoveredClues = [];
    state.visitedScenes = [];
  }
}

export function persistLocalExtras() {
  try {
    localStorage.setItem(localKey(state.uid, "clues"), JSON.stringify(state.discoveredClues));
    localStorage.setItem(localKey(state.uid, "visited"), JSON.stringify(state.visitedScenes));
  } catch {
    // Stockage local indisponible — ignoré silencieusement
  }
}

export function markSceneVisited(sceneId) {
  if (sceneId && !state.visitedScenes.includes(sceneId)) {
    state.visitedScenes.push(sceneId);
    persistLocalExtras();
  }
}

export function recordClue(clueId) {
  if (clueId && !state.discoveredClues.includes(clueId)) {
    state.discoveredClues.push(clueId);
    persistLocalExtras();
    return true;
  }
  return false;
}

export function hasItem(name) {
  return state.inventory.includes(name);
}

export function addItem(name) {
  if (name && !state.inventory.includes(name)) {
    state.inventory.push(name);
    return true;
  }
  return false;
}

export function removeItems(...names) {
  state.inventory = state.inventory.filter((item) => !names.includes(item));
}

export async function syncProgressToFirebase(sceneId = state.currentScene) {
  state.currentScene = sceneId;
  if (!state.uid) return;
  try {
    await updateDoc(doc(db, "users", state.uid), {
      currentScene: state.currentScene,
      inventory: state.inventory
    });
  } catch (err) {
    console.error("Erreur synchronisation Firestore :", err);
  }
}

export async function recordWinnerInFirebase() {
  if (!state.uid) return;
  try {
    await setDoc(doc(db, "winners", state.uid), {
      pseudo: state.pseudo,
      date: serverTimestamp()
    });
  } catch (err) {
    console.error("Erreur enregistrement Hall of Fame :", err);
  }
}
