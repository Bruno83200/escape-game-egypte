// js/auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./config.js"; 
import { UI } from "./ui.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let isLoginMode = false;

document.addEventListener('DOMContentLoaded', () => {
    const toggleLink = document.getElementById('toggle-link');
    const submitBtn = document.getElementById('submit-auth');

    if (toggleLink) {
        toggleLink.onclick = () => {
            isLoginMode = !isLoginMode;
            document.getElementById('form-title').innerText = isLoginMode ? "CONNEXION" : "REJOINDRE L'EXPÉDITION";
            toggleLink.innerText = isLoginMode ? "Nouvel explorateur ? S'inscrire" : "Déjà inscrit ? Se connecter";
            document.getElementById('group-pseudo').style.display = isLoginMode ? "none" : "block";
        };
    }

    if (submitBtn) {
        submitBtn.onclick = async () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const pseudoElement = document.getElementById('pseudo');
            const pseudo = pseudoElement ? pseudoElement.value : "";

            if (!email || !password) {
                UI.message("Veuillez remplir les champs obligatoires pour l'expédition.");
                return;
            }

            try {
                if (isLoginMode) {
                    await signInWithEmailAndPassword(auth, email, password);
                    UI.message("Bienvenue Professeur. Prêt à reprendre les fouilles ?", () => {
                        window.location.href = "game.html";
                    });
                } else {
                    if (!pseudo) { UI.message("L'Académie a besoin d'un nom pour vous enregistrer !"); return; }
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    
                    await setDoc(doc(db, "users", userCredential.user.uid), {
                        pseudo: pseudo,
                        currentScene: "antichambre_sable",
                        inventory: [],
                        createdAt: new Date()
                    });

                    UI.message("Expédition validée. Bonne chance " + pseudo + " !", () => {
                        window.location.href = "game.html";
                    });
                }
            } catch (e) {
                UI.message("Erreur de l'Académie : " + e.message);
            }
        };
    }
});