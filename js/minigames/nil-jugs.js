// js/minigames/nil-jugs.js — Épreuve 8 : Le Réservoir du Nil (Jarres 5 L & 3 L → 4 L exacts dans le conduit)
import { openWorkbench, openLightbox } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

export function launchNilJugs({ onSolved }) {
  openWorkbench({
    kicker: "Chapitre III · Le Réservoir du Nil",
    title: "Mesurer 4 Litres d'Eau Sacrée",
    instruction: "Utilisez la jarre de 5 L et la jarre de 3 L pour verser exactement 4 litres dans le conduit sacré du Nil.",
    hint: "Méthode rapide : remplissez 5 L → transvasez dans 3 L (il reste 2 L) → versez ces 2 L dans le conduit. Recommencez une fois (2 + 2 = 4 L) ! La méthode classique (4 L en une fois) fonctionne aussi.",
    render(api) {
      let jug5 = 0;
      let jug3 = 0;
      let conduit = 0;
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "jugs-stage";
      stage.innerHTML = `
        <div class="dial-ref-strip">
          <img src="assets/images/items/volume_indice.webp" alt="Gravure du Réservoir 3L 5L 4L" id="jug-ref-img" />
          <span>Gravure hydraulique : versez exactement 4 L dans le conduit sacré.</span>
        </div>

        <div class="jugs-visual-row">
          <div class="jug-box">
            <div class="jug-vessel">
              <div class="jug-water" id="water-5" style="height:0%;"></div>
              <span class="jug-amount" id="lbl-5">0 / 5 L</span>
            </div>
            <div class="jug-title">Jarre 5 L</div>
          </div>

          <div class="jug-box">
            <div class="jug-vessel is-small">
              <div class="jug-water" id="water-3" style="height:0%;"></div>
              <span class="jug-amount" id="lbl-3">0 / 3 L</span>
            </div>
            <div class="jug-title">Jarre 3 L</div>
          </div>

          <div class="jug-box">
            <div class="jug-vessel is-conduit">
              <div class="jug-water" id="water-c" style="height:0%;"></div>
              <span class="jug-amount" id="lbl-c">0 / 4 L</span>
            </div>
            <div class="jug-title">Conduit (4 L)</div>
          </div>
        </div>

        <div class="jugs-controls">
          <button type="button" class="jug-action-btn" data-op="fill5">Remplir 5 L</button>
          <button type="button" class="jug-action-btn" data-op="fill3">Remplir 3 L</button>
          <button type="button" class="jug-action-btn" data-op="5to3">Verser 5 L → 3 L</button>
          <button type="button" class="jug-action-btn" data-op="3to5">Verser 3 L → 5 L</button>
          <button type="button" class="jug-action-btn" data-op="empty5">Vider 5 L</button>
          <button type="button" class="jug-action-btn" data-op="empty3">Vider 3 L</button>
          <button type="button" class="jug-action-btn is-pour-conduit" data-op="pour5">Verser 5 L dans le conduit</button>
          <button type="button" class="jug-action-btn is-pour-conduit" data-op="pour3">Verser 3 L dans le conduit</button>
        </div>
      `;
      api.stage.appendChild(stage);

      stage.querySelector("#jug-ref-img").addEventListener("click", () => {
        openLightbox("assets/images/items/volume_indice.webp", "Gravure du Réservoir : 3 L · 5 L → 4 L");
      });

      const btnReset = document.createElement("button");
      btnReset.type = "button";
      btnReset.className = "btn-papyrus";
      btnReset.textContent = "Tout vider";
      api.footer.appendChild(btnReset);

      const water5 = stage.querySelector("#water-5");
      const water3 = stage.querySelector("#water-3");
      const waterC = stage.querySelector("#water-c");
      const lbl5 = stage.querySelector("#lbl-5");
      const lbl3 = stage.querySelector("#lbl-3");
      const lblC = stage.querySelector("#lbl-c");

      function updateView() {
        water5.style.height = `${(jug5 / 5) * 100}%`;
        water3.style.height = `${(jug3 / 3) * 100}%`;
        waterC.style.height = `${Math.min(100, (conduit / 4) * 100)}%`;
        lbl5.textContent = `${jug5} / 5 L`;
        lbl3.textContent = `${jug3} / 3 L`;
        lblC.textContent = `${conduit} / 4 L`;
      }

      function checkConduit() {
        if (conduit === 4) {
          locked = true;
          sound.playSFX("mecanisme_hydraulique", 0.78);
          api.setStatus("4 litres exacts ! Le mécanisme hydraulique libère l'Ankh de Bronze.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1150);
        } else if (conduit > 4) {
          sound.playSFX("echec", 0.65);
          api.setStatus(`Trop d'eau (${conduit} L > 4 L) ! Le trop-plein vidange le conduit sacré.`, "error");
          conduit = 0;
          updateView();
        }
      }

      stage.querySelectorAll("[data-op]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (locked) return;
          const op = btn.dataset.op;
          api.clearStatus();

          switch (op) {
            case "fill5":
              if (jug5 === 5) return;
              jug5 = 5;
              sound.playSFX("eau_verse", 0.55);
              break;
            case "fill3":
              if (jug3 === 3) return;
              jug3 = 3;
              sound.playSFX("eau_verse", 0.55);
              break;
            case "5to3": {
              const moved = Math.min(jug5, 3 - jug3);
              if (moved <= 0) return;
              jug5 -= moved;
              jug3 += moved;
              sound.playSFX("eau_verse", 0.55);
              break;
            }
            case "3to5": {
              const moved = Math.min(jug3, 5 - jug5);
              if (moved <= 0) return;
              jug3 -= moved;
              jug5 += moved;
              sound.playSFX("eau_verse", 0.55);
              break;
            }
            case "empty5":
              if (jug5 === 0) return;
              jug5 = 0;
              sound.playSFX("eau_verse", 0.35);
              break;
            case "empty3":
              if (jug3 === 0) return;
              jug3 = 0;
              sound.playSFX("eau_verse", 0.35);
              break;
            case "pour5":
              if (jug5 === 0) {
                api.setStatus("La jarre de 5 L est vide !", "info");
                return;
              }
              conduit += jug5;
              jug5 = 0;
              sound.playSFX("eau_verse", 0.65);
              updateView();
              checkConduit();
              return;
            case "pour3":
              if (jug3 === 0) {
                api.setStatus("La jarre de 3 L est vide !", "info");
                return;
              }
              conduit += jug3;
              jug3 = 0;
              sound.playSFX("eau_verse", 0.65);
              updateView();
              checkConduit();
              return;
          }
          updateView();
        });
      });

      btnReset.addEventListener("click", () => {
        if (locked) return;
        jug5 = 0;
        jug3 = 0;
        conduit = 0;
        api.clearStatus();
        updateView();
      });

      updateView();
    }
  });
}
