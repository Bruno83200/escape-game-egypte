// js/auth.js — Accréditation Archéologique (Connexion obligatoire Firebase)
import { auth, db } from "./config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let isLogin = false;

const tabRegister = document.getElementById("tab-register");
const tabLogin = document.getElementById("tab-login");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");
const groupPseudo = document.getElementById("group-pseudo");
const pseudoInput = document.getElementById("pseudo");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassBtn = document.getElementById("toggle-password");
const submitBtn = document.getElementById("submit-auth");
const authForm = document.getElementById("auth-form");
const feedbackBox = document.getElementById("auth-feedback");

const modalBackdrop = document.getElementById("custom-modal");
const modalTitle = document.getElementById("modal-title-text");
const modalKicker = document.getElementById("modal-kicker");
const modalText = document.getElementById("modal-text");
const modalBtn = document.getElementById("modal-btn");

function setMode(loginMode) {
  isLogin = loginMode;
  tabRegister.classList.toggle("is-active", !isLogin);
  tabRegister.setAttribute("aria-selected", String(!isLogin));
  tabLogin.classList.toggle("is-active", isLogin);
  tabLogin.setAttribute("aria-selected", String(isLogin));

  if (isLogin) {
    formTitle.textContent = "REPRENDRE L'EXPÉDITION";
    formSubtitle.textContent = "Retrouvez votre carnet d'archéologue à l'étape exacte";
    groupPseudo.style.display = "none";
    submitBtn.querySelector("span").textContent = "Ouvrir le Carnet";
  } else {
    formTitle.textContent = "REJOINDRE L'EXPÉDITION";
    formSubtitle.textContent = "Enregistrez votre carnet de fouilles pour sauvegarder votre avancée";
    groupPseudo.style.display = "block";
    submitBtn.querySelector("span").textContent = "Pénétrer dans le Tombeau";
  }
  clearFeedback();
}

function showFeedback(message, type = "error") {
  feedbackBox.textContent = message;
  feedbackBox.className = `auth-feedback is-visible is-${type}`;
}

function clearFeedback() {
  feedbackBox.textContent = "";
  feedbackBox.className = "auth-feedback";
}

function openModal({ title, kicker = "Sceau de l'Académie", html, buttonText = "Continuer", onClose }) {
  modalTitle.textContent = title;
  modalKicker.textContent = kicker;
  modalText.innerHTML = html;
  modalBtn.textContent = buttonText;
  modalBackdrop.classList.add("is-open");
  modalBtn.onclick = () => {
    modalBackdrop.classList.remove("is-open");
    if (onClose) onClose();
  };
}

function translateFirebaseError(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email ou code secret incorrect. Vérifiez vos identifiants d'expédition.";
    case "auth/email-already-in-use":
      return "Ce courrier est déjà enregistré ! Basculez sur l'onglet « Déjà Inscrit » pour reprendre votre fouille.";
    case "auth/weak-password":
      return "Votre code secret doit comporter au moins 6 caractères.";
    case "auth/invalid-email":
      return "Veuillez saisir une adresse email valide.";
    case "auth/too-many-requests":
      return "Trop de tentatives rapprochées. Patientez quelques instants avant de réessayer.";
    case "auth/network-request-failed":
      return "Impossible de joindre l'Académie. Vérifiez votre connexion internet.";
    default:
      return "Une erreur est survenue lors de l'identification. Réessayez dans un instant.";
  }
}

tabRegister.addEventListener("click", () => setMode(false));
tabLogin.addEventListener("click", () => setMode(true));

togglePassBtn.addEventListener("click", () => {
  const isPwd = passwordInput.type === "password";
  passwordInput.type = isPwd ? "text" : "password";
  togglePassBtn.setAttribute("aria-label", isPwd ? "Masquer le code secret" : "Afficher le code secret");
});

let isSubmitting = false;

authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  clearFeedback();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const pseudo = pseudoInput.value.trim();

  if (!isLogin && !pseudo) {
    showFeedback("Veuillez indiquer votre nom d'explorateur pour l'inscription.");
    pseudoInput.focus();
    return;
  }
  if (!email) {
    showFeedback("Veuillez saisir votre adresse email.");
    emailInput.focus();
    return;
  }
  if (!password || password.length < 6) {
    showFeedback("Le code secret doit contenir au moins 6 caractères.");
    passwordInput.focus();
    return;
  }

  isSubmitting = true;
  submitBtn.disabled = true;
  const labelSpan = submitBtn.querySelector("span");
  const prevLabel = labelSpan.textContent;
  labelSpan.textContent = isLogin ? "Ouverture du tombeau…" : "Inscription en cours…";

  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "game.html";
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Schéma Firestore strictement identique à l'original
      await setDoc(doc(db, "users", user.uid), {
        pseudo,
        currentScene: "antichambre_sable",
        inventory: [],
        createdAt: new Date()
      });

      openModal({
        title: "Bienvenue dans l'expédition !",
        kicker: "Accréditation Validée · 1920",
        html: `<p>Votre carnet d'archéologue est ouvert au nom de <strong>${escapeHtml(pseudo)}</strong>.</p>
               <p>Le sable retombe sur l'antichambre : préparez-vous à explorer le Tombeau Perdu d'Anubis.</p>`,
        buttonText: "Entrer dans l'Antichambre",
        onClose: () => {
          window.location.href = "game.html";
        }
      });
    }
  } catch (err) {
    showFeedback(translateFirebaseError(err.code));
    labelSpan.textContent = prevLabel;
    submitBtn.disabled = false;
    isSubmitting = false;
  }
});

// Redirection automatique si déjà connecté (hors inscription en cours)
onAuthStateChanged(auth, (user) => {
  if (user && !isSubmitting) {
    window.location.href = "game.html";
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
