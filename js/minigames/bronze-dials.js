// js/minigames/bronze-dials.js — Épreuve 6 (Anneaux de la Trappe 2·1·6) & Épreuve 14 (Verrou Final 9·1·1)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

function launchRotaryLock({
  kicker,
  title,
  instruction,
  hint,
  referenceImage = null,
  referenceLabel = "",
  labels = ["Anneau I", "Anneau II", "Anneau III"],
  solution = "216",
  turnSfx = "metal_clic",
  successSfx = "trappe_metal",
  successText = "Les verrous cèdent !",
  failText = "Le verrou reste bloqué. Vérifiez chaque chiffre.",
  buttonLabel = "Déverrouiller",
  onSolved
}) {
  openWorkbench({
    kicker,
    title,
    instruction,
    hint,
    render(api) {
      const digits = [0, 0, 0];
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "dial-stage";

      if (referenceImage) {
        const ref = document.createElement("div");
        ref.className = "dial-ref-strip";
        ref.innerHTML = `
          <img src="${referenceImage}" alt="${referenceLabel}" />
          <span>${referenceLabel} — cliquez sur l'archive pour ouvrir la loupe.</span>
        `;
        ref.querySelector("img").addEventListener("click", () => openLightbox(referenceImage, referenceLabel));
        stage.appendChild(ref);
      }

      const wheelsWrap = document.createElement("div");
      wheelsWrap.className = "dial-wheels";
      stage.appendChild(wheelsWrap);
      api.stage.appendChild(stage);

      const btnReset = document.createElement("button");
      btnReset.type = "button";
      btnReset.className = "btn-papyrus";
      btnReset.textContent = "Remettre à 000";

      const btnUnlock = document.createElement("button");
      btnUnlock.type = "button";
      btnUnlock.className = "btn-lapis";
      btnUnlock.textContent = buttonLabel;

      api.footer.append(btnReset, btnUnlock);

      const displays = [];

      function updateDigit(idx, delta) {
        if (locked) return;
        digits[idx] = (digits[idx] + delta + 10) % 10;
        displays[idx].textContent = String(digits[idx]);
        sound.playSFX(turnSfx, 0.55);
        api.clearStatus();
      }

      labels.forEach((lbl, idx) => {
        const col = document.createElement("div");
        col.className = "dial-wheel";
        col.innerHTML = `
          <span class="dial-label">${lbl}</span>
          <button type="button" class="dial-arrow" data-dir="1" aria-label="Augmenter ${lbl}">▲</button>
          <div class="dial-drum" id="dial-val-${idx}">0</div>
          <button type="button" class="dial-arrow" data-dir="-1" aria-label="Diminuer ${lbl}">▼</button>
        `;
        const valEl = col.querySelector(`#dial-val-${idx}`);
        displays.push(valEl);

        col.querySelectorAll(".dial-arrow").forEach((btn) => {
          btn.addEventListener("click", () => updateDigit(idx, Number(btn.dataset.dir)));
        });

        valEl.addEventListener("wheel", (e) => {
          e.preventDefault();
          updateDigit(idx, e.deltaY < 0 ? 1 : -1);
        }, { passive: false });

        wheelsWrap.appendChild(col);
      });

      btnReset.addEventListener("click", () => {
        if (locked) return;
        for (let i = 0; i < 3; i++) {
          digits[i] = 0;
          displays[i].textContent = "0";
        }
        api.clearStatus();
      });

      function checkCode() {
        if (locked) return;
        const code = digits.join("");
        if (code === solution) {
          locked = true;
          sound.playSFX(successSfx, 0.78);
          api.setStatus(successText, "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1050);
        } else {
          sound.playSFX("echec", 0.65);
          api.setStatus(failText, "error");
        }
      }

      btnUnlock.addEventListener("click", checkCode);

      // Saisie directe au clavier (3 chiffres + Entrée)
      let keyCursor = 0;
      const onKey = (e) => {
        if (locked) return;
        if (/^[0-9]$/.test(e.key)) {
          digits[keyCursor] = Number(e.key);
          displays[keyCursor].textContent = e.key;
          keyCursor = (keyCursor + 1) % 3;
          sound.playSFX(turnSfx, 0.5);
          api.clearStatus();
        } else if (e.key === "Enter") {
          checkCode();
        }
      };
      window.addEventListener("keydown", onKey);
      api.setCleanup(() => window.removeEventListener("keydown", onKey));
    }
  });
}

export function launchTrapdoorDials({ onSolved }) {
  launchRotaryLock({
    kicker: "Chapitre II · La Trappe de Bronze",
    title: "Anneaux Rotatifs de la Trappe",
    instruction: "Réglez les trois anneaux gravés selon les trois fragments du papyrus : mains d'un homme, œil intact d'Horus, pattes du scarabée.",
    hint: "Un homme possède 2 mains, Horus garda 1 œil après son combat contre Seth, et le scarabée sacré possède 6 pattes → 2 · 1 · 6.",
    referenceImage: "assets/images/items/papyrus2_item.webp",
    referenceLabel: "Les Trois Fragments de Papyrus",
    labels: ["I · Mains", "II · Horus", "III · Scarabée"],
    solution: "216",
    turnSfx: "metal_clic",
    successSfx: "trappe_metal",
    successText: "2 · 1 · 6 ! Les verrous métalliques claquent et la trappe de bronze bascule.",
    failText: "Les anneaux résistent. Vérifiez les trois énigmes du papyrus.",
    buttonLabel: "Ouvrir la Trappe",
    onSolved
  });
}

export function launchFinalBridgeLock({ onSolved }) {
  launchRotaryLock({
    kicker: "Chapitre IV · L'Ultime Porte du Soleil",
    title: "Verrou Rotatif du Pharaon",
    instruction: "Alignez les trois chiffres gravés à l'intérieur de la Bague Royale pour ouvrir la porte vers le soleil de Gizeh.",
    hint: "Observez la gravure à l'intérieur de la Bague du Pharaon : les trois chiffres secrets sont 9 · 1 · 1.",
    referenceImage: "assets/images/items/bague_item.webp",
    referenceLabel: "La Bague du Pharaon (gravure interne : 9 · 1 · 1)",
    labels: ["Sceau I", "Sceau II", "Sceau III"],
    solution: "911",
    turnSfx: "rouage_code",
    successSfx: "porte_soleil",
    successText: "9 · 1 · 1 ! La porte du soleil s'ouvre sur le désert de Gizeh !",
    failText: "Ce code ne déclenche pas le verrou royal. Examinez la bague de plus près.",
    buttonLabel: "Ouvrir la Porte du Soleil",
    onSolved
  });
}
