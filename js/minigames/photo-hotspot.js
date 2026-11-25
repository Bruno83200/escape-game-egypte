// js/minigames/photo-hotspot.js — Épreuve 4 (Horus), Épreuve 5 (Intrus de la Fresque) & Épreuve 12 (Miroir contre le Gardien)
import { openWorkbench } from "../engine/ui.js";
import { sound } from "../engine/audio.js";

// --- ÉPREUVE 4 : LES TROIS COLOSSES DE GRANIT (HORUS) ---
export function launchStatuesHotspot({ onSolved }) {
  openWorkbench({
    kicker: "Chapitre II · Couloir des Malédictions",
    title: "Remettre le Sceptre d'Anubis",
    instruction: "« Le messager du ciel a perdu son guide. » Cliquez directement sur la statue divine à laquelle confier le Sceptre d'Anubis.",
    hint: "Sobek (à droite) est le crocodile du Nil, Thot (au centre) est l'ibis scribe, et Horus (à gauche) est le faucon, maître du ciel.",
    render(api) {
      let locked = false;

      const stage = document.createElement("div");
      stage.className = "hotspot-stage";
      stage.innerHTML = `
        <div class="hotspot-frame" id="statues-frame">
          <img src="assets/images/scenes/statues_01.webp" alt="Les trois statues de granit : Horus, Thot et Sobek" draggable="false" />
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
          <button type="button" class="btn-papyrus" data-god="horus">Horus (Faucon · Gauche)</button>
          <button type="button" class="btn-papyrus" data-god="thot">Thot (Ibis · Centre)</button>
          <button type="button" class="btn-papyrus" data-god="sobek">Sobek (Crocodile · Droite)</button>
        </div>
      `;
      api.stage.appendChild(stage);

      const frame = stage.querySelector("#statues-frame");
      const zones = [
        { id: "horus", label: "Horus · Faucon", left: "2%", top: "4%", width: "44%", height: "92%" },
        { id: "thot", label: "Thot · Ibis", left: "50%", top: "30%", width: "16%", height: "44%" },
        { id: "sobek", label: "Sobek · Crocodile", left: "66%", top: "14%", width: "32%", height: "82%" }
      ];

      function chooseGod(id, zoneEl = null) {
        if (locked) return;
        if (id === "horus") {
          locked = true;
          if (zoneEl) zoneEl.classList.add("is-hit");
          sound.playSFX("vibration", 0.72);
          api.setStatus("Le Sceptre d'Anubis vibre dans les mains de pierre d'Horus, maître du ciel !", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1050);
        } else {
          if (zoneEl) {
            zoneEl.classList.add("is-miss");
            setTimeout(() => zoneEl.classList.remove("is-miss"), 550);
          }
          sound.playSFX("echec", 0.65);
          const msg = id === "sobek"
            ? "Sobek règne sur les eaux du Nil, pas sur la voûte céleste…"
            : "Thot est le dieu scribe de la sagesse, mais quel dieu règne sur le ciel ?";
          api.setStatus(msg, "error");
        }
      }

      zones.forEach((z) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "hotspot-zone";
        el.style.left = z.left;
        el.style.top = z.top;
        el.style.width = z.width;
        el.style.height = z.height;
        el.setAttribute("aria-label", z.label);
        el.innerHTML = `<span class="hotspot-tag">${z.label}</span>`;
        el.addEventListener("click", () => chooseGod(z.id, el));
        frame.appendChild(el);
      });

      stage.querySelectorAll("[data-god]").forEach((btn) => {
        btn.addEventListener("click", () => chooseGod(btn.dataset.god));
      });
    }
  });
}

// --- ÉPREUVE 5 : L'INTRUS DE LA FRESQUE DU NIL (PINGOUIN / MANCHOT) ---
export function launchFresqueIntruder({ onSolved }) {
  openWorkbench({
    kicker: "Chapitre II · Labyrinthe des Fresques",
    title: "Débusquer l'Intrus du Nil",
    instruction: "« Sept animaux du Nil s'unissent ici, mais un voyageur des glaces s'est glissé parmi eux. » Touchez directement l'intrus sur le fragment de fresque.",
    hint: "Examinez le quart inférieur droit de la fresque, sous le crocodile : un petit oiseau noir et blanc des pôles s'y cache !",
    render(api) {
      let locked = false;
      let attempts = 0;

      const stage = document.createElement("div");
      stage.className = "hotspot-stage";
      stage.innerHTML = `
        <div class="hotspot-frame" id="fresque-frame" style="max-width:440px;">
          <img src="assets/images/items/fresque_item.webp" alt="Fragment de fresque représentant la faune du Nil" draggable="false" />
          <div id="fresque-target" class="hotspot-zone" style="left:74%;top:57%;width:20%;height:28%;border-color:transparent;"></div>
        </div>
      `;
      api.stage.appendChild(stage);

      const frame = stage.querySelector("#fresque-frame");
      const target = stage.querySelector("#fresque-target");

      function spawnPing(xPct, yPct, hit) {
        const ring = document.createElement("div");
        ring.className = `tap-ping ${hit ? "is-hit" : "is-miss"}`;
        ring.style.left = `${xPct}%`;
        ring.style.top = `${yPct}%`;
        frame.appendChild(ring);
        setTimeout(() => ring.remove(), 650);
      }

      frame.addEventListener("click", (e) => {
        if (locked) return;
        const rect = frame.getBoundingClientRect();
        const xPct = ((e.clientX - rect.left) / rect.width) * 100;
        const yPct = ((e.clientY - rect.top) / rect.height) * 100;

        // Zone généreuse autour du manchot/pingouin en bas à droite (x: 73..95, y: 55..88)
        const isHit = xPct >= 73 && xPct <= 96 && yPct >= 55 && yPct <= 88;
        spawnPing(xPct, yPct, isHit);

        if (isHit) {
          locked = true;
          target.style.borderColor = "#34a474";
          target.classList.add("is-hit");
          sound.playSFX("fresque_clip", 0.72);
          api.setStatus("Un pingouin des glaces ! Le fragment s'emboîte et libère l'alcôve secrète.", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1100);
        } else {
          attempts += 1;
          sound.playSFX("echec", 0.55);
          if (attempts >= 3) {
            api.setStatus("Cet animal appartient bien au Nil. Regardez tout en bas à droite du fragment !", "error");
          } else {
            api.setStatus("Cet animal vit bel et bien en Égypte… cherchez le voyageur venu des glaces.", "error");
          }
        }
      });
    }
  });
}

// --- ÉPREUVE 12 : ÉBLOUIR LE GARDIEN AVEC LE MIROIR DE BRONZE ---
export function launchMirrorGuardian({ onSolved }) {
  openWorkbench({
    kicker: "Chapitre IV · La Porte du Gardien",
    title: "Reflet du Miroir de Bronze",
    instruction: "Déplacez le miroir de bronze pour diriger le rayon solaire directement sur les yeux luisants du colosse et l'éblouir.",
    hint: "Amenez le disque lumineux sur les yeux ambre au sommet du visage du pharaon (haut-centre) et maintenez-le jusqu'à 100 %.",
    render(api) {
      let locked = false;
      let charge = 0;
      let beamX = 24;
      let beamY = 74;
      let dragging = false;

      // Coordonnées mesurées sur gardien_01.webp (yeux ambre du colosse)
      const TARGET_X = 49.5;
      const TARGET_Y = 18.5;
      const HIT_RADIUS = 11.5;

      const stage = document.createElement("div");
      stage.className = "mirror-stage";
      stage.innerHTML = `
        <div class="mirror-arena" id="mirror-arena">
          <img src="assets/images/scenes/gardien_01.webp" alt="Le Colosse Gardien aux yeux ambre" draggable="false" />
          <svg class="mirror-ray-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line id="mirror-ray" x1="50" y1="98" x2="24" y2="74" stroke="rgba(255,232,148,0.58)" stroke-width="2.2" stroke-linecap="round" />
          </svg>
          <div class="mirror-target-hint" style="left:${TARGET_X}%;top:${TARGET_Y}%;"></div>
          <div class="mirror-beam" id="mirror-beam" style="left:${beamX}%;top:${beamY}%;"></div>
        </div>
        <div class="glare-meter">
          <div class="glare-meter-head">
            <span>Éblouissement du Gardien</span>
            <strong id="glare-pct">0 %</strong>
          </div>
          <div class="glare-bar"><div class="glare-bar-fill" id="glare-fill"></div></div>
        </div>
      `;
      api.stage.appendChild(stage);

      const btnAimAuto = document.createElement("button");
      btnAimAuto.type = "button";
      btnAimAuto.className = "btn-papyrus";
      btnAimAuto.textContent = "Incliner le miroir vers le visage";
      api.footer.appendChild(btnAimAuto);

      const arena = stage.querySelector("#mirror-arena");
      const beamEl = stage.querySelector("#mirror-beam");
      const rayEl = stage.querySelector("#mirror-ray");
      const pctEl = stage.querySelector("#glare-pct");
      const fillEl = stage.querySelector("#glare-fill");

      function updateBeamPosition(xPct, yPct) {
        beamX = Math.max(4, Math.min(96, xPct));
        beamY = Math.max(4, Math.min(96, yPct));
        beamEl.style.left = `${beamX}%`;
        beamEl.style.top = `${beamY}%`;
        rayEl.setAttribute("x2", String(beamX));
        rayEl.setAttribute("y2", String(beamY));
      }

      function pointFromEvent(e) {
        const rect = arena.getBoundingClientRect();
        return {
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        };
      }

      const onDown = (e) => {
        if (locked) return;
        dragging = true;
        arena.setPointerCapture?.(e.pointerId);
        const pt = pointFromEvent(e);
        updateBeamPosition(pt.x, pt.y);
      };
      const onMove = (e) => {
        if (locked) return;
        // Permet aussi de viser à la souris en glissant ou au survol tactile
        if (dragging || e.pointerType === "mouse") {
          const pt = pointFromEvent(e);
          updateBeamPosition(pt.x, pt.y);
        }
      };
      const onUp = () => {
        dragging = false;
      };

      arena.addEventListener("pointerdown", onDown);
      arena.addEventListener("pointermove", onMove);
      arena.addEventListener("pointerup", onUp);
      arena.addEventListener("pointercancel", onUp);

      btnAimAuto.addEventListener("click", () => {
        if (locked) return;
        updateBeamPosition(TARGET_X, TARGET_Y);
      });

      let sfxPlayed = false;
      const tick = setInterval(() => {
        if (locked) return;
        const dist = Math.hypot(beamX - TARGET_X, beamY - TARGET_Y);
        const onTarget = dist <= HIT_RADIUS;
        beamEl.classList.toggle("is-locked", onTarget);

        if (onTarget) {
          charge = Math.min(100, charge + 4.5);
          if (!sfxPlayed && charge > 20) {
            sfxPlayed = true;
            sound.playSFX("faisceau_lumineux_2", 0.65);
          }
          api.setStatus("Maintenez le rayon sur les yeux du colosse !", "info");
        } else {
          charge = Math.max(0, charge - 1.5);
        }

        const rounded = Math.round(charge);
        pctEl.textContent = `${rounded} %`;
        fillEl.style.width = `${rounded}%`;

        if (charge >= 100) {
          locked = true;
          clearInterval(tick);
          sound.playSFX("glissement_or", 0.72);
          api.setStatus("Aveuglé par l'éclat solaire, le colosse recule et libère la porte !", "success");
          setTimeout(() => {
            api.close();
            if (onSolved) onSolved();
          }, 1050);
        }
      }, 60);

      api.setCleanup(() => {
        clearInterval(tick);
        arena.removeEventListener("pointerdown", onDown);
        arena.removeEventListener("pointermove", onMove);
        arena.removeEventListener("pointerup", onUp);
        arena.removeEventListener("pointercancel", onUp);
      });
    }
  });
}
