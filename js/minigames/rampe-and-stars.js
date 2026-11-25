// js/minigames/rampe-and-stars.js — Épreuve 9 (Rampe 60°) & Épreuve 10 (Horloge Stellaire Sirius 12h)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

// --- ÉPREUVE 9 : LA RAMPE DE LA PYRAMIDE (ANGLE 60°) ---
export function launchPyramidRamp({ onSolved }) {
  openWorkbench({
    kicker: "Chapitre III · La Rampe de la Pyramide",
    title: "Inclinaison du Triangle Parfait",
    instruction: "L'Ankh de Bronze est enclenché ! Réglez l'angle de la rampe sur celui du triangle parfait (équilatéral) pour hisser le bloc.",
    hint: "Un triangle dont les trois côtés sont égaux possède trois angles identiques : 180° ÷ 3 = 60°.",
    render(api) {
      let angle = 35;
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "ramp-stage";
      stage.innerHTML = `
        <div class="dial-ref-strip">
          <img src="assets/images/items/triangle_indice.webp" alt="Gravure du Triangle Parfait" id="ramp-ref-img" />
          <span>Gravure murale : « L'angle du triangle parfait ouvrira la voie. »</span>
        </div>

        <div class="ramp-svg-wrap">
          <svg viewBox="0 0 380 210" width="370" height="204" aria-label="Simulateur de rampe inclinée">
            <!-- Base horizontale -->
            <line x1="36" y1="184" x2="346" y2="184" stroke="#8a6c3c" stroke-width="3" />
            <!-- Arc du rapporteur -->
            <path d="M 116 184 A 80 80 0 0 0 36 104" fill="none" stroke="rgba(27,67,114,0.22)" stroke-width="2" stroke-dasharray="4 4" />
            <path id="ramp-arc" d="" fill="rgba(202,155,62,0.22)" stroke="#ca9b3e" stroke-width="2.5" />

            <!-- Rampe inclinée pivotant autour de (36, 184) -->
            <g id="ramp-arm" style="transform-origin:36px 184px;transition:transform 0.2s ease;">
              <rect x="36" y="176" width="235" height="10" rx="3" fill="#9a7228" stroke="#4f3812" stroke-width="1.5" />
              <!-- Bloc de pierre sur la rampe -->
              <g id="ramp-block" style="transition:transform 0.8s cubic-bezier(0.22,1,0.36,1);">
                <rect x="64" y="142" width="48" height="34" rx="4" fill="#d4be96" stroke="#5f4725" stroke-width="2" />
                <text x="88" y="164" text-anchor="middle" fill="#1b4372" font-size="16" font-weight="700">☥</text>
              </g>
            </g>

            <circle cx="36" cy="184" r="6" fill="#1b4372" stroke="#ca9b3e" stroke-width="2.5" />
            <text id="ramp-deg-svg" x="132" y="172" fill="#1b4372" font-family="Cinzel,serif" font-size="15" font-weight="700">35°</text>
          </svg>
        </div>

        <div class="ramp-slider-row">
          <button type="button" class="step-btn" id="ramp-dec" aria-label="Diminuer de 1 degré">−</button>
          <input type="range" id="ramp-slider" min="15" max="80" step="1" value="35" />
          <button type="button" class="step-btn" id="ramp-inc" aria-label="Augmenter de 1 degré">+</button>
          <span class="ramp-deg-badge" id="ramp-deg-badge">35°</span>
        </div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#ramp-ref-img").addEventListener("click", () => {
        openLightbox("assets/images/items/triangle_indice.webp", "Le Triangle Parfait");
      });

      const btnEngage = document.createElement("button");
      btnEngage.type = "button";
      btnEngage.className = "btn-lapis";
      btnEngage.textContent = "Verrouiller l'Inclinaison";
      api.footer.appendChild(btnEngage);

      const arm = stage.querySelector("#ramp-arm");
      const block = stage.querySelector("#ramp-block");
      const arc = stage.querySelector("#ramp-arc");
      const degSvg = stage.querySelector("#ramp-deg-svg");
      const badge = stage.querySelector("#ramp-deg-badge");
      const slider = stage.querySelector("#ramp-slider");

      function updateRamp(val) {
        angle = Math.max(15, Math.min(80, val));
        slider.value = String(angle);
        badge.textContent = `${angle}°`;
        degSvg.textContent = `${angle}°`;
        arm.style.transform = `rotate(${-angle}deg)`;

        const r = 64;
        const rad = (angle * Math.PI) / 180;
        const ex = 36 + r * Math.cos(rad);
        const ey = 184 - r * Math.sin(rad);
        arc.setAttribute("d", `M 36 184 L ${36 + r} 184 A ${r} ${r} 0 0 0 ${ex.toFixed(1)} ${ey.toFixed(1)} Z`);
      }

      slider.addEventListener("input", () => {
        if (locked) return;
        api.clearStatus();
        updateRamp(Number(slider.value));
      });
      stage.querySelector("#ramp-dec").addEventListener("click", () => {
        if (locked) return;
        sound.playSFX("clic_pierre", 0.35);
        api.clearStatus();
        updateRamp(angle - 1);
      });
      stage.querySelector("#ramp-inc").addEventListener("click", () => {
        if (locked) return;
        sound.playSFX("clic_pierre", 0.35);
        api.clearStatus();
        updateRamp(angle + 1);
      });

      btnEngage.addEventListener("click", () => {
        if (locked) return;
        if (angle === 60) {
          locked = true;
          block.style.transform = "translateX(148px)";
          sound.playSFX("pierre_frotte", 0.78);
          api.setStatus("60° exacts ! Le bloc glisse jusqu'au sommet et dégage l'escalier secret.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1250);
        } else {
          sound.playSFX("echec", 0.62);
          api.setStatus(`${angle}° ne convient pas : le bloc refuse de glisser. Cherchez l'angle d'un triangle équilatéral.`, "error");
        }
      });

      updateRamp(angle);
    }
  });
}

// --- ÉPREUVE 10 : L'HORLOGE STELLAIRE (SIRIUS AU ZÉNITH 12H) ---
export function launchStellarClock({ onSolved }) {
  openWorkbench({
    kicker: "Chapitre IV · L'Observatoire Stellaire",
    title: "Aligner Sirius au Zénith",
    instruction: "Sirius débute à la 6e heure (en bas). Chaque traction du levier fait tourner la roue céleste de 3 heures (90°). Amenez Sirius exactement au Zénith (12e heure).",
    hint: "De 6h à 12h, il y a 6 heures d'écart : actionnez exactement 2 fois le levier (+3h puis +3h) avant de verrouiller l'alignement !",
    render(api) {
      let turns = 0; // Chaque tour = +3h = +90° sens horaire ; départ Sirius à 6h (180°)
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "star-stage";
      stage.innerHTML = `
        <div class="dial-ref-strip">
          <img src="assets/images/items/horloge_indice.webp" alt="Les 12 Heures de la Nuit" id="star-ref-img" />
          <span>Carte Stellaire : Sirius doit atteindre la 12e heure (Zénith, en haut).</span>
        </div>

        <div class="star-wheel-wrap">
          <svg viewBox="0 0 280 280" width="268" height="268" aria-label="Roue de l'horloge stellaire">
            <!-- Cadre fixe & marqueur Zénith 12h -->
            <circle cx="140" cy="140" r="132" fill="#0d1b2c" stroke="#ca9b3e" stroke-width="4" />
            <polygon points="140,4 132,20 148,20" fill="#f3dc9a" />
            <text x="140" y="34" text-anchor="middle" fill="#f3dc9a" font-family="Cinzel,serif" font-size="11" font-weight="700">12H · ZÉNITH</text>
            <text x="252" y="144" text-anchor="middle" fill="#9fb8d8" font-family="Cinzel,serif" font-size="11">3H</text>
            <text x="140" y="256" text-anchor="middle" fill="#9fb8d8" font-family="Cinzel,serif" font-size="11">6H</text>
            <text x="28" y="144" text-anchor="middle" fill="#9fb8d8" font-family="Cinzel,serif" font-size="11">9H</text>

            <!-- Disque rotatif de basalte -->
            <g id="star-rotor" style="transform-origin:140px 140px;transition:transform 0.55s cubic-bezier(0.22,1,0.36,1);">
              <circle cx="140" cy="140" r="98" fill="#132944" stroke="rgba(235,197,107,0.55)" stroke-width="2" />
              <circle cx="140" cy="140" r="56" fill="none" stroke="rgba(235,197,107,0.28)" stroke-width="1.5" stroke-dasharray="4 4" />
              <line x1="140" y1="42" x2="140" y2="238" stroke="rgba(235,197,107,0.22)" stroke-width="1.2" />
              <line x1="42" y1="140" x2="238" y2="140" stroke="rgba(235,197,107,0.22)" stroke-width="1.2" />

              <!-- Petites étoiles décoratives -->
              <circle cx="96" cy="95" r="2.2" fill="#e7d6a5" />
              <circle cx="186" cy="102" r="2" fill="#e7d6a5" />
              <circle cx="104" cy="182" r="1.8" fill="#e7d6a5" />
              <circle cx="182" cy="176" r="2.4" fill="#e7d6a5" />

              <!-- Étoile SIRIUS placée à 6h (en bas, y=218) au départ -->
              <g id="sirius-star">
                <circle cx="140" cy="216" r="15" fill="rgba(243,220,154,0.25)" />
                <polygon points="140,201 144,212 155,216 144,220 140,231 136,220 125,216 136,212" fill="#f7df94" stroke="#fff7dc" stroke-width="1" />
                <text x="140" y="196" text-anchor="middle" fill="#f7df94" font-family="Cinzel,serif" font-size="9.5" font-weight="700">SIRIUS</text>
              </g>
            </g>

            <!-- Pivot central -->
            <circle cx="140" cy="140" r="12" fill="#ca9b3e" stroke="#f7e4a8" stroke-width="2" />
          </svg>
        </div>

        <div class="star-readout">
          <span class="star-chip">Position de Sirius : <strong id="star-hour">6e heure</strong></span>
          <span class="star-chip">Tours de levier : <strong id="star-turns">0</strong></span>
        </div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#star-ref-img").addEventListener("click", () => {
        openLightbox("assets/images/items/horloge_indice.webp", "Les 12 Heures de la Nuit");
      });

      const btnTurn = document.createElement("button");
      btnTurn.type = "button";
      btnTurn.className = "btn-papyrus";
      btnTurn.textContent = "Tirer le levier (+3 heures)";

      const btnAlign = document.createElement("button");
      btnAlign.type = "button";
      btnAlign.className = "btn-lapis";
      btnAlign.textContent = "Aligner le Rayon Stellaire";

      api.footer.append(btnTurn, btnAlign);

      const rotor = stage.querySelector("#star-rotor");
      const hourEl = stage.querySelector("#star-hour");
      const turnsEl = stage.querySelector("#star-turns");

      function currentHour() {
        const h = (6 + turns * 3) % 12;
        return h === 0 ? 12 : h;
      }

      function updateView() {
        rotor.style.transform = `rotate(${turns * 90}deg)`;
        const h = currentHour();
        hourEl.textContent = h === 12 ? "12e heure (Zénith)" : `${h}e heure`;
        turnsEl.textContent = String(turns);
      }

      btnTurn.addEventListener("click", () => {
        if (locked) return;
        turns += 1;
        sound.playSFX("engrenage_pierre", 0.65);
        api.clearStatus();
        updateView();
      });

      btnAlign.addEventListener("click", () => {
        if (locked) return;
        if (currentHour() === 12) {
          locked = true;
          sound.playSFX("faisceau_stellaire", 0.78);
          api.setStatus("Sirius brille au Zénith ! Un rayon stellaire descend dans le conduit et ouvre le socle.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1150);
        } else {
          sound.playSFX("echec", 0.62);
          api.setStatus(`Sirius est actuellement à la ${currentHour()}e heure. Amenez-la jusqu'à la 12e heure (Zénith).`, "error");
        }
      });

      updateView();
    }
  });
}
