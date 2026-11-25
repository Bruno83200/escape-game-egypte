// js/minigames/hieroglyphs-and-jewels.js — Épreuve 3 (Cartouche V·I·E) & Épreuve 11 (Joyaux du Sarcophage)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

// --- ÉPREUVE 3 : CARTOUCHE DES SCRIBES (V · I · E) ---
export function launchScribesCartouche({ onSolved }) {
  openWorkbench({
    kicker: "Chapitre I · Le Mur des Scribes",
    title: "Déchiffrer le Cartouche Sacré",
    instruction: "Assemblez les trois lettres révélées par la Plume (souffle), le Roseau (lien) et les Ondes d'eau (source) pour graver le mot sacré.",
    hint: "Le souffle donne V, le roseau relie I, la source marque E : le mot formé est VIE.",
    render(api) {
      const letters = ["", "", ""];
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "cartouche-stage";
      stage.innerHTML = `
        <div class="cartouche-tablet">
          <div class="glyph-slot" data-pos="0">
            <svg viewBox="0 0 64 64" width="44" height="44" fill="none" stroke="#1b4372" stroke-width="2.2" aria-hidden="true">
              <path d="M40 10C26 14 20 26 22 50" stroke-linecap="round"/>
              <path d="M40 10c6 12 2 28-18 40" fill="rgba(202,155,62,0.22)"/>
              <path d="M26 26h12M23 35h13" stroke-opacity="0.6"/>
            </svg>
            <div class="glyph-letter is-empty" id="gl-0">?</div>
            <span class="glyph-caption">Plume · Souffle</span>
          </div>
          <div class="glyph-slot" data-pos="1">
            <svg viewBox="0 0 64 64" width="44" height="44" fill="none" stroke="#1b4372" stroke-width="2.2" aria-hidden="true">
              <path d="M32 54V14" stroke-linecap="round"/>
              <path d="M32 14c10 2 12 14 0 24" fill="rgba(47,125,94,0.2)"/>
              <path d="M24 54h16" stroke-linecap="round"/>
            </svg>
            <div class="glyph-letter is-empty" id="gl-1">?</div>
            <span class="glyph-caption">Roseau · Lien</span>
          </div>
          <div class="glyph-slot" data-pos="2">
            <svg viewBox="0 0 64 64" width="44" height="44" fill="none" stroke="#1b4372" stroke-width="2.4" aria-hidden="true">
              <path d="M10 24l6-6 6 6 6-6 6 6 6-6 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 38l6-6 6 6 6-6 6 6 6-6 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 50l6-6 6 6 6-6 6 6 6-6 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.55"/>
            </svg>
            <div class="glyph-letter is-empty" id="gl-2">?</div>
            <span class="glyph-caption">Ondes · Source</span>
          </div>
        </div>
        <div class="letter-keyboard" id="scribes-keys"></div>
      `;
      api.stage.appendChild(stage);

      const btnClear = document.createElement("button");
      btnClear.type = "button";
      btnClear.className = "btn-papyrus";
      btnClear.textContent = "Effacer";

      const btnCheck = document.createElement("button");
      btnCheck.type = "button";
      btnCheck.className = "btn-lapis";
      btnCheck.textContent = "Graver le Cartouche";

      api.footer.append(btnClear, btnCheck);

      const palette = ["V", "A", "I", "R", "E", "O", "S", "N"];
      const keysWrap = stage.querySelector("#scribes-keys");

      function updateDisplay() {
        letters.forEach((ch, idx) => {
          const el = stage.querySelector(`#gl-${idx}`);
          el.textContent = ch || "?";
          el.classList.toggle("is-empty", !ch);
        });
        btnCheck.disabled = letters.some((c) => !c) || locked;
      }

      function pushLetter(ch) {
        if (locked) return;
        const nextIdx = letters.indexOf("");
        if (nextIdx === -1) return;
        letters[nextIdx] = ch;
        sound.playSFX("gravure", 0.5);
        api.clearStatus();
        updateDisplay();
      }

      function clearAll() {
        if (locked) return;
        letters[0] = letters[1] = letters[2] = "";
        api.clearStatus();
        updateDisplay();
      }

      function validate() {
        if (locked || letters.some((c) => !c)) return;
        const word = letters.join("");
        if (word === "VIE") {
          locked = true;
          sound.playSFX("activation_magique", 0.72);
          api.setStatus("« VIE » — Les hiéroglyphes s'embrasent d'une lumière bleue !", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1050);
        } else {
          sound.playSFX("echec", 0.65);
          api.setStatus(`« ${word} » reste silencieux. Relisez la Tablette de Traduction.`, "error");
        }
      }

      palette.forEach((ch) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "letter-tile";
        b.textContent = ch;
        b.addEventListener("click", () => pushLetter(ch));
        keysWrap.appendChild(b);
      });

      // Clic sur une case remplie pour la vider
      stage.querySelectorAll(".glyph-slot").forEach((slot) => {
        slot.addEventListener("click", () => {
          if (locked) return;
          const idx = Number(slot.dataset.pos);
          if (letters[idx]) {
            letters[idx] = "";
            updateDisplay();
          }
        });
      });

      btnClear.addEventListener("click", clearAll);
      btnCheck.addEventListener("click", validate);

      // Raccourci clavier naturel
      const onKey = (e) => {
        if (locked) return;
        if (e.key === "Backspace") {
          const lastFilled = letters[2] ? 2 : letters[1] ? 1 : letters[0] ? 0 : -1;
          if (lastFilled !== -1) {
            letters[lastFilled] = "";
            updateDisplay();
          }
        } else if (e.key === "Enter") {
          validate();
        } else if (/^[a-zA-Z]$/.test(e.key)) {
          const up = e.key.toUpperCase();
          if (palette.includes(up)) pushLetter(up);
        }
      };
      window.addEventListener("keydown", onKey);
      api.setCleanup(() => window.removeEventListener("keydown", onKey));

      updateDisplay();
    }
  });
}

// --- ÉPREUVE 11 : LES JOYAUX DE LA PARURE PECTORALE (Ankh → Disque → Scarabée) ---
export function launchPectoralJewels({ onSolved }) {
  openWorkbench({
    kicker: "Chapitre IV · Le Sarcophage Royal",
    title: "La Parure Pectorale",
    instruction: "Pressez les trois joyaux sacrés dans l'ordre du Cycle de l'Éternité sans commettre d'erreur.",
    hint: "1. Le Souffle de Vie (Ankh) → 2. L'Éclat du Jour (Disque Solaire) → 3. La Transformation (Scarabée).",
    render(api) {
      const expected = ["ankh", "disque", "scarabee"];
      const pressed = [];
      let locked = false;

      const jewels = [
        {
          id: "scarabee",
          name: "Scarabée",
          meaning: "Transformation",
          svg: `<svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
            <path d="M18 22 11 15M46 22 53 15M16 35 9 35M48 35 55 35M19 47 12 54M45 47 52 54" stroke="#183d6a" stroke-width="2.4" stroke-linecap="round"/>
            <ellipse cx="32" cy="36" rx="14" ry="17" fill="#23648c" stroke="#ca9b3e" stroke-width="2.4"/>
            <ellipse cx="32" cy="19" rx="8" ry="5" fill="#183d6a" stroke="#ca9b3e" stroke-width="2"/>
            <path d="M32 24v28" stroke="#f3dc9a" stroke-width="1.8"/>
          </svg>`
        },
        {
          id: "ankh",
          name: "Ankh",
          meaning: "Souffle de Vie",
          svg: `<svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
            <ellipse cx="32" cy="20" rx="10" ry="12" fill="rgba(235,197,107,0.3)" stroke="#9a7228" stroke-width="4"/>
            <path d="M32 32v24M18 39h28" stroke="#9a7228" stroke-width="4.5" stroke-linecap="round"/>
            <ellipse cx="32" cy="20" rx="5" ry="7" fill="#1b4372"/>
          </svg>`
        },
        {
          id: "disque",
          name: "Disque Solaire",
          meaning: "Éclat du Jour",
          svg: `<svg viewBox="0 0 64 64" width="54" height="54" aria-hidden="true">
            <circle cx="32" cy="32" r="15" fill="#d99a32" stroke="#8a5610" stroke-width="2.5"/>
            <circle cx="32" cy="32" r="8" fill="#f7e2a0"/>
            <path d="M32 6v7M32 51v7M6 32h7M51 32h7M14 14l5 5M45 45l5 5M50 14l-5 5M19 45l-5 5" stroke="#ca9b3e" stroke-width="2.6" stroke-linecap="round"/>
          </svg>`
        }
      ];

      const stage = document.createElement("div");
      stage.className = "jewels-stage";
      stage.innerHTML = `
        <div class="dial-ref-strip">
          <img src="assets/images/items/rune_indice.webp" alt="Le Cycle de l'Éternité" id="rune-ref-img" />
          <span>Relevé : Le Cycle de l'Éternité — cliquez pour ouvrir à la loupe.</span>
        </div>
        <div class="jewels-sequence-bar" id="jewels-seq">
          <span class="seq-pip" data-s="0">1er Joyau</span>
          <span class="seq-pip" data-s="1">2e Joyau</span>
          <span class="seq-pip" data-s="2">3e Joyau</span>
        </div>
        <div class="pectoral-board" id="pectoral-board"></div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#rune-ref-img").addEventListener("click", () => {
        openLightbox("assets/images/items/rune_indice.webp", "Le Cycle de l'Éternité");
      });

      const btnReset = document.createElement("button");
      btnReset.type = "button";
      btnReset.className = "btn-papyrus";
      btnReset.textContent = "Réinitialiser la séquence";
      api.footer.appendChild(btnReset);

      const board = stage.querySelector("#pectoral-board");

      function updateSequenceBar() {
        stage.querySelectorAll(".seq-pip").forEach((pip, idx) => {
          const id = pressed[idx];
          if (id) {
            const j = jewels.find((x) => x.id === id);
            pip.textContent = `${idx + 1}. ${j.name}`;
            pip.classList.add("is-lit");
          } else {
            pip.textContent = `${idx + 1}e Joyau`;
            pip.classList.remove("is-lit");
          }
        });
      }

      function renderBoard() {
        board.innerHTML = "";
        jewels.forEach((j) => {
          const orderPos = pressed.indexOf(j.id);
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `jewel-medallion ${orderPos !== -1 ? "is-pressed" : ""}`;
          btn.innerHTML = `
            ${orderPos !== -1 ? `<span class="jewel-badge">${orderPos + 1}</span>` : ""}
            ${j.svg}
            <strong>${j.name}</strong>
            <span style="font-size:0.78rem;color:var(--ink-500);">${j.meaning}</span>
          `;

          btn.addEventListener("click", () => {
            if (locked || pressed.includes(j.id)) return;
            const stepIdx = pressed.length;
            if (j.id === expected[stepIdx]) {
              pressed.push(j.id);
              sound.playSFX("clic_joyau", 0.7);
              api.clearStatus();
              updateSequenceBar();
              renderBoard();

              if (pressed.length === expected.length) {
                locked = true;
                sound.playSFX("declic_secret", 0.78);
                api.setStatus("Un déclic cristallin ! Un compartiment secret s'ouvre sur le sarcophage.", "success");
                setTimeout(() => {
                  api.close();
                  if (onSolved) onSolved();
                }, 1000);
              }
            } else {
              sound.playSFX("echec", 0.65);
              btn.classList.add("is-wrong");
              api.setStatus("L'ordre du cycle est rompu ! Recommencez par le Souffle de Vie.", "error");
              setTimeout(() => {
                pressed.length = 0;
                updateSequenceBar();
                renderBoard();
              }, 520);
            }
          });

          board.appendChild(btn);
        });
      }

      btnReset.addEventListener("click", () => {
        if (locked) return;
        pressed.length = 0;
        api.clearStatus();
        updateSequenceBar();
        renderBoard();
      });

      renderBoard();
      updateSequenceBar();
    }
  });
}
