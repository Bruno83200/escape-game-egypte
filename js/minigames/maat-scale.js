// js/minigames/maat-scale.js — Épreuve 7 : La Balance de Maât (42 avec le minimum de plumes : 2 Justice + 1 Pureté)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

export function launchMaatScale({ onSolved }) {
  openWorkbench({
    kicker: "Chapitre III · Salle des Pesées",
    title: "La Balance Sacrée de Maât",
    instruction: "Équilibrez le cœur de pierre (42) en déposant les plumes sur le plateau droit avec le nombre MINIMAL de plumes.",
    hint: "Justice = 20, Sagesse = 10, Honneur = 5, Pureté = 2. Pour atteindre exactement 42 en 3 plumes seulement : 2 Justice (40) + 1 Pureté (2).",
    render(api) {
      const TARGET = 42;
      const MIN_FEATHERS = 3;
      const feathers = [
        { id: "justice", name: "Justice", weight: 20, color: "#1b4372", count: 0 },
        { id: "sagesse", name: "Sagesse", weight: 10, color: "#2d6a54", count: 0 },
        { id: "honneur", name: "Honneur", weight: 5, color: "#9a6c22", count: 0 },
        { id: "purete", name: "Pureté", weight: 2, color: "#7b4338", count: 0 }
      ];
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "scale-stage";
      stage.innerHTML = `
        <div class="dial-ref-strip">
          <img src="assets/images/items/poids_indice.webp" alt="Stèle des Plumes de Maât" id="maat-ref-img" />
          <span>Stèle de Maât : Cœur = 42 · Utilisez le minimum de plumes possible.</span>
        </div>

        <div class="scale-svg-wrap">
          <svg viewBox="0 0 420 205" width="400" height="196" aria-label="Balance animée de Maât">
            <!-- Socle et pilier -->
            <rect x="155" y="182" width="110" height="14" rx="4" fill="#9a7228" />
            <rect x="202" y="40" width="16" height="144" rx="4" fill="#ca9b3e" />
            <circle cx="210" cy="36" r="12" fill="#1b4372" stroke="#ca9b3e" stroke-width="3" />
            <!-- Aiguille de verticalité -->
            <line x1="210" y1="22" x2="210" y2="54" stroke="#f7e4a8" stroke-width="2" />

            <!-- Fléau pivotant -->
            <g id="scale-beam-group" style="transform-origin:210px 48px;transition:transform 0.45s cubic-bezier(0.22,1,0.36,1);">
              <rect x="64" y="44" width="292" height="8" rx="4" fill="#ca9b3e" stroke="#6f4d15" stroke-width="1.5" />
              <!-- Plateau gauche : Cœur 42 -->
              <line x1="88" y1="52" x2="66" y2="122" stroke="#8a6524" stroke-width="2" />
              <line x1="88" y1="52" x2="110" y2="122" stroke="#8a6524" stroke-width="2" />
              <path d="M52 122 Q88 142 124 122 Z" fill="#ca9b3e" stroke="#6f4d15" stroke-width="1.8" />
              <!-- Cœur de pierre -->
              <path d="M88 118 C72 106 72 88 84 86 C88 85 88 91 88 91 C88 91 88 85 92 86 C104 88 104 106 88 118 Z" fill="#6b4b3e" stroke="#3c281e" stroke-width="1.8" />
              <text x="88" y="106" text-anchor="middle" fill="#fbf3e1" font-family="Cinzel,serif" font-size="11" font-weight="700">42</text>

              <!-- Plateau droit : Plumes de Maât -->
              <line x1="332" y1="52" x2="310" y2="122" stroke="#8a6524" stroke-width="2" />
              <line x1="332" y1="52" x2="354" y2="122" stroke="#8a6524" stroke-width="2" />
              <path d="M296 122 Q332 142 368 122 Z" fill="#ca9b3e" stroke="#6f4d15" stroke-width="1.8" />
              <g id="scale-feathers-vis"></g>
              <text id="scale-right-label" x="332" y="150" text-anchor="middle" fill="#183d6a" font-family="Cinzel,serif" font-size="13" font-weight="700">0</text>
            </g>
          </svg>
        </div>

        <div class="scale-readout">
          <span class="scale-pill">Cœur : <strong>42</strong></span>
          <span class="scale-pill">Plateau droit : <strong id="maat-total">0</strong></span>
          <span class="scale-pill">Plumes posées : <strong id="maat-count">0</strong></span>
        </div>

        <div class="feathers-grid" id="feathers-grid"></div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#maat-ref-img").addEventListener("click", () => {
        openLightbox("assets/images/items/poids_indice.webp", "Stèle des Plumes de Maât");
      });

      const btnReset = document.createElement("button");
      btnReset.type = "button";
      btnReset.className = "btn-papyrus";
      btnReset.textContent = "Vider le plateau";

      const btnWeigh = document.createElement("button");
      btnWeigh.type = "button";
      btnWeigh.className = "btn-lapis";
      btnWeigh.textContent = "Sceller la Pesée";

      api.footer.append(btnReset, btnWeigh);

      const beamGroup = stage.querySelector("#scale-beam-group");
      const feathersVis = stage.querySelector("#scale-feathers-vis");
      const rightLabel = stage.querySelector("#scale-right-label");
      const totalEl = stage.querySelector("#maat-total");
      const countEl = stage.querySelector("#maat-count");
      const grid = stage.querySelector("#feathers-grid");

      function getTotals() {
        const weight = feathers.reduce((acc, f) => acc + f.weight * f.count, 0);
        const count = feathers.reduce((acc, f) => acc + f.count, 0);
        return { weight, count };
      }

      function renderVisuals() {
        const { weight, count } = getTotals();
        totalEl.textContent = String(weight);
        countEl.textContent = String(count);
        rightLabel.textContent = String(weight);

        // Inclinaison physique : négative (penche à gauche vers le cœur) si weight < 42, 0 si 42, positive si > 42
        const diff = weight - TARGET;
        const angle = Math.max(-16, Math.min(16, diff * 0.42));
        beamGroup.style.transform = `rotate(${angle}deg)`;

        // Dessiner les petites plumes stylisées posées sur le plateau droit
        let svgParts = "";
        let idx = 0;
        feathers.forEach((f) => {
          for (let i = 0; i < f.count; i++) {
            const x = 310 + ((idx % 5) * 11);
            const y = 118 - Math.floor(idx / 5) * 10;
            svgParts += `<ellipse cx="${x}" cy="${y - 10}" rx="4.5" ry="12" transform="rotate(${(idx % 3 - 1) * 14} ${x} ${y - 10})" fill="${f.color}" stroke="#fbf3e1" stroke-width="1"/>`;
            idx += 1;
          }
        });
        feathersVis.innerHTML = svgParts;

        // Mettre à jour compteurs dans les cartes
        feathers.forEach((f) => {
          const el = grid.querySelector(`[data-cnt="${f.id}"]`);
          if (el) el.textContent = String(f.count);
        });
      }

      feathers.forEach((f) => {
        const card = document.createElement("div");
        card.className = "feather-card";
        card.innerHTML = `
          <div class="feather-name">${f.name}</div>
          <div class="feather-val">Poids : ${f.weight}</div>
          <div class="feather-stepper">
            <button type="button" class="step-btn" data-act="dec" aria-label="Retirer ${f.name}">−</button>
            <span class="feather-count" data-cnt="${f.id}">0</span>
            <button type="button" class="step-btn" data-act="inc" aria-label="Ajouter ${f.name}">+</button>
          </div>
        `;
        card.querySelector('[data-act="dec"]').addEventListener("click", () => {
          if (locked || f.count <= 0) return;
          f.count -= 1;
          sound.playSFX("balance_clic", 0.5);
          api.clearStatus();
          renderVisuals();
        });
        card.querySelector('[data-act="inc"]').addEventListener("click", () => {
          if (locked || f.count >= 6) return;
          f.count += 1;
          sound.playSFX("balance_clic", 0.55);
          api.clearStatus();
          renderVisuals();
        });
        grid.appendChild(card);
      });

      btnReset.addEventListener("click", () => {
        if (locked) return;
        feathers.forEach((f) => { f.count = 0; });
        sound.playSFX("balance_clic", 0.4);
        api.clearStatus();
        renderVisuals();
      });

      btnWeigh.addEventListener("click", () => {
        if (locked) return;
        const { weight, count } = getTotals();
        if (weight !== TARGET) {
          sound.playSFX("echec", 0.62);
          api.setStatus(
            weight < TARGET
              ? `Le cœur reste plus lourd (${weight} / 42). Ajoutez des plumes sur le plateau droit.`
              : `Le plateau droit est trop lourd (${weight} / 42). Retirez des plumes.`,
            "error"
          );
          return;
        }
        if (count > MIN_FEATHERS) {
          sound.playSFX("echec", 0.62);
          api.setStatus(
            `La balance est à 42, mais Maât exige le minimum de plumes ! Vous en utilisez ${count} ; on peut y arriver en 3 plumes seulement.`,
            "error"
          );
          return;
        }
        locked = true;
        sound.playSFX("gong_sacre", 0.78);
        api.setStatus("Équilibre parfait en 3 plumes (2 Justice + 1 Pureté) ! Le gong sacré retentit.", "success");
        setTimeout(() => {
          api.close();
          if (onSolved) onSolved();
        }, 1150);
      });

      renderVisuals();
    }
  });
}
