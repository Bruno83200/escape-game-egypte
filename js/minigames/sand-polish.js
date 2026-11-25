// js/minigames/sand-polish.js — Épreuve 1 : Dépoussiérer la Lentille de Cristal au pinceau
import { openWorkbench } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

export function launchSandPolish({ onSolved }) {
  openWorkbench({
    kicker: "Chapitre I · Antichambre du Sable",
    title: "Polir la Lentille de Cristal",
    instruction: "Balayez la couche de sable millénaire avec votre doigt ou la souris pour dégager le cristal solaire.",
    hint: "Frottez le centre de la lentille jusqu'à dégager au moins 65 % du cristal. Vous pouvez aussi cliquer sur « Coup de brosse ».",
    render(api) {
      const stage = document.createElement("div");
      stage.className = "polish-stage";
      stage.innerHTML = `
        <div class="polish-canvas-wrap" id="polish-wrap">
          <img class="polish-crystal-img" src="assets/images/items/lens_item.webp" alt="Lentille de Cristal" draggable="false" />
          <div class="polish-glint" id="polish-glint"></div>
          <canvas id="sand-canvas" width="320" height="320"></canvas>
        </div>
        <div class="polish-meter">
          <div class="polish-meter-head">
            <span>Surface dégagée</span>
            <strong id="polish-pct">0 %</strong>
          </div>
          <div class="polish-bar"><div class="polish-bar-fill" id="polish-fill"></div></div>
        </div>
      `;
      api.stage.appendChild(stage);

      const btnBrush = document.createElement("button");
      btnBrush.type = "button";
      btnBrush.className = "btn-papyrus";
      btnBrush.textContent = "Coup de brosse d'archéologue";
      api.footer.appendChild(btnBrush);

      const canvas = stage.querySelector("#sand-canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const pctEl = stage.querySelector("#polish-pct");
      const fillEl = stage.querySelector("#polish-fill");
      const glintEl = stage.querySelector("#polish-glint");

      // Peindre la couche de sable fin du désert
      const grad = ctx.createRadialGradient(160, 160, 20, 160, 160, 180);
      grad.addColorStop(0, "#d9be8c");
      grad.addColorStop(0.55, "#c5a268");
      grad.addColorStop(1, "#9a7743");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 320, 320);

      // Grain de sable naturel
      for (let i = 0; i < 1800; i++) {
        const x = Math.random() * 320;
        const y = Math.random() * 320;
        const r = Math.random() * 2 + 0.5;
        ctx.fillStyle = i % 2 === 0 ? "rgba(92, 65, 32, 0.28)" : "rgba(255, 245, 222, 0.25)";
        ctx.fillRect(x, y, r, r);
      }

      // Légère inscription tracée dans le sable
      ctx.save();
      ctx.fillStyle = "rgba(76, 52, 24, 0.55)";
      ctx.font = "600 13px Cinzel, serif";
      ctx.textAlign = "center";
      ctx.fillText("FROTTER LE SABLE", 160, 164);
      ctx.restore();

      let isDrawing = false;
      let solved = false;
      let lastSfxTime = 0;
      let strokeCount = 0;

      function getCoords(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
        };
      }

      function wipeAt(x, y, radius = 32) {
        if (solved) return;
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        const g = ctx.createRadialGradient(x, y, radius * 0.25, x, y, radius);
        g.addColorStop(0, "rgba(0,0,0,1)");
        g.addColorStop(0.75, "rgba(0,0,0,0.85)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const now = Date.now();
        if (now - lastSfxTime > 420) {
          lastSfxTime = now;
          sound.playSFX("frotter", 0.45);
        }

        strokeCount += 1;
        if (strokeCount % 4 === 0) checkProgress();
      }

      function checkProgress() {
        if (solved) return;
        const data = ctx.getImageData(0, 0, 320, 320).data;
        let cleared = 0;
        const step = 16; // échantillonnage rapide
        let total = 0;
        for (let i = 3; i < data.length; i += 4 * step) {
          total += 1;
          if (data[i] < 90) cleared += 1;
        }
        const pct = Math.min(100, Math.round((cleared / total) * 100));
        const displayPct = Math.min(100, Math.round((pct / 65) * 100));
        pctEl.textContent = `${displayPct} %`;
        fillEl.style.width = `${displayPct}%`;

        if (pct >= 65) {
          solved = true;
          ctx.clearRect(0, 0, 320, 320);
          pctEl.textContent = "100 %";
          fillEl.style.width = "100%";
          glintEl.classList.add("is-lit");
          btnBrush.disabled = true;
          sound.playSFX("lumiere", 0.72);
          api.setStatus("Un faisceau doré traverse la lentille et illumine l'antichambre !", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1150);
        }
      }

      const onDown = (e) => {
        if (solved) return;
        isDrawing = true;
        canvas.setPointerCapture?.(e.pointerId);
        const { x, y } = getCoords(e);
        wipeAt(x, y, 34);
      };
      const onMove = (e) => {
        if (!isDrawing || solved) return;
        const { x, y } = getCoords(e);
        wipeAt(x, y, 32);
      };
      const onUp = () => {
        if (!isDrawing) return;
        isDrawing = false;
        checkProgress();
      };

      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);

      // Coup de brosse accessible (balaye un large arc)
      let sweepIndex = 0;
      const sweepCenters = [
        [160, 160], [95, 110], [225, 110], [95, 210], [225, 210], [160, 80], [160, 240]
      ];
      btnBrush.addEventListener("click", () => {
        if (solved) return;
        const [cx, cy] = sweepCenters[sweepIndex % sweepCenters.length];
        sweepIndex += 1;
        wipeAt(cx, cy, 78);
        wipeAt(cx + 28, cy - 16, 62);
        wipeAt(cx - 28, cy + 16, 62);
        checkProgress();
      });

      api.setCleanup(() => {
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
      });
    }
  });
}
