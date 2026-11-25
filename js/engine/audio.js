// js/engine/audio.js — Gestionnaire sonore archéologique (51 pistes exactes + fondu enchaîné)

const AUDIO_MAP = {
  // Ambiances (en boucle)
  vent_desert: "assets/audio/vent_desert.mp3",
  mystere: "assets/audio/mystere_ambiance.mp3",
  murmures: "assets/audio/murmures_anciens.mp3",
  vent_profond: "assets/audio/vent_souterrain.mp3",
  echo_caverne: "assets/audio/echo_caverne.mp3",
  choeur_divin: "assets/audio/choeur_divin.mp3",
  eau_ruissellement: "assets/audio/eau_ruissellement.mp3",
  vent_interieur_pyramide: "assets/audio/vent_interieur_pyramide.mp3",
  mystere_etoiles: "assets/audio/mystere_etoiles.mp3",
  murmures_runiques: "assets/audio/murmures_runiques.mp3",
  souffle_tombeau: "assets/audio/souffle_tombeau.mp3",
  vent_abime: "assets/audio/vent_abime.mp3",
  vent_victoire: "assets/audio/vent_victoire.mp3",
  victoire_finale: "assets/audio/victoire_finale.mp3",

  // Effets sonores
  frotter: "assets/audio/frottement_verre.mp3",
  lumiere: "assets/audio/faisceau_lumineux.mp3",
  succes: "assets/audio/succes_egypte.mp3",
  echec: "assets/audio/echec_egypte.mp3",
  pierre_lourde: "assets/audio/pierre_lourde_ouverture.mp3",
  poterie: "assets/audio/poterie_cassee.mp3",
  clic_pierre: "assets/audio/clic_pierre.mp3",
  pierre_glisse: "assets/audio/pierre_glisse.mp3",
  gravure: "assets/audio/gravure_pierre.mp3",
  activation_magique: "assets/audio/activation_magique.mp3",
  pas_pierre: "assets/audio/pas_pierre.mp3",
  vibration: "assets/audio/vibration_magique.mp3",
  porte_pierre_2: "assets/audio/porte_pierre_2.mp3",
  fresque_clip: "assets/audio/placement_pierre.mp3",
  panneau_secret: "assets/audio/panneau_secret.mp3",
  papyrus: "assets/audio/froissement_papyrus.mp3",
  metal_clic: "assets/audio/cliquetis_metal.mp3",
  trappe_metal: "assets/audio/trappe_metal.mp3",
  balance_clic: "assets/audio/clic_mecanisme.mp3",
  gong_sacre: "assets/audio/gong_sacre.mp3",
  eau_verse: "assets/audio/remplissage_eau.mp3",
  mecanisme_hydraulique: "assets/audio/mecanisme_hydraulique.mp3",
  pierre_frotte: "assets/audio/frottement_pierre_lourde.mp3",
  insertion_ankh: "assets/audio/insertion_metal.mp3",
  engrenage_pierre: "assets/audio/engrenage_pierre.mp3",
  faisceau_stellaire: "assets/audio/faisceau_stellaire.mp3",
  clic_joyau: "assets/audio/clic_pierre_precieuse.mp3",
  declic_secret: "assets/audio/declic_secret.mp3",
  cliquetis_or: "assets/audio/cliquetis_or.mp3",
  faisceau_lumineux_2: "assets/audio/faisceau_lumineux_2.mp3",
  glissement_or: "assets/audio/glissement_or.mp3",
  declic_magique: "assets/audio/declic_magique.mp3",
  mecanisme_final: "assets/audio/mecanisme_final.mp3",
  cliquetis_bijoux: "assets/audio/cliquetis_bijoux.mp3",
  rouage_code: "assets/audio/rouage_code.mp3",
  porte_soleil: "assets/audio/porte_soleil.mp3",
  triomphe: "assets/audio/triomphe_egypte.mp3"
};

const MUTE_KEY = "anubis_audio_muted";

class SoundManager {
  constructor() {
    this.muted = localStorage.getItem(MUTE_KEY) === "1";
    this.currentAmbienceKey = null;
    this.currentAmbienceEl = null;
    this.fadeInterval = null;
    this.unlocked = false;
    this.pendingAmbience = null;

    const unlock = () => {
      if (this.unlocked) return;
      this.unlocked = true;
      if (this.pendingAmbience && !this.muted) {
        const key = this.pendingAmbience;
        this.pendingAmbience = null;
        this.playAmbience(key);
      }
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem(MUTE_KEY, this.muted ? "1" : "0");
    if (this.muted) {
      if (this.currentAmbienceEl) this.currentAmbienceEl.pause();
    } else if (this.currentAmbienceEl) {
      this.currentAmbienceEl.play().catch(() => {});
    } else if (this.pendingAmbience) {
      this.playAmbience(this.pendingAmbience);
    }
    return this.muted;
  }

  playSFX(key, volume = 0.65) {
    if (this.muted) return;
    const src = AUDIO_MAP[key];
    if (!src) return;
    try {
      const a = new Audio(src);
      a.volume = volume;
      a.play().catch(() => {});
    } catch {
      // Ignoré
    }
  }

  playAmbience(key, targetVol = 0.24) {
    if (!key) {
      this.stopAmbience();
      return;
    }
    if (this.currentAmbienceKey === key && this.currentAmbienceEl) {
      if (!this.muted && this.currentAmbienceEl.paused) {
        this.currentAmbienceEl.play().catch(() => {});
      }
      return;
    }

    const src = AUDIO_MAP[key];
    if (!src) return;

    this.currentAmbienceKey = key;
    if (this.muted) {
      this.stopCurrentElementOnly();
      this.pendingAmbience = key;
      return;
    }

    const oldEl = this.currentAmbienceEl;
    const nextEl = new Audio(src);
    nextEl.loop = true;
    nextEl.volume = 0;
    this.currentAmbienceEl = nextEl;

    nextEl.play().then(() => {
      this.crossfade(oldEl, nextEl, targetVol);
    }).catch(() => {
      // Autoplay bloqué avant premier geste utilisateur
      this.pendingAmbience = key;
      if (oldEl) {
        try { oldEl.pause(); } catch {}
      }
    });
  }

  stopCurrentElementOnly() {
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    if (this.currentAmbienceEl) {
      try {
        this.currentAmbienceEl.pause();
        this.currentAmbienceEl.currentTime = 0;
      } catch {}
      this.currentAmbienceEl = null;
    }
  }

  stopAmbience() {
    this.currentAmbienceKey = null;
    this.pendingAmbience = null;
    this.stopCurrentElementOnly();
  }

  crossfade(oldEl, nextEl, targetVol) {
    if (this.fadeInterval) clearInterval(this.fadeInterval);
    const steps = 16;
    let step = 0;
    const startOld = oldEl ? oldEl.volume : 0;

    this.fadeInterval = setInterval(() => {
      step += 1;
      const ratio = step / steps;
      if (nextEl && !this.muted) {
        nextEl.volume = Math.min(targetVol, targetVol * ratio);
      }
      if (oldEl) {
        oldEl.volume = Math.max(0, startOld * (1 - ratio));
      }
      if (step >= steps) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
        if (oldEl && oldEl !== nextEl) {
          try {
            oldEl.pause();
            oldEl.currentTime = 0;
          } catch {}
        }
      }
    }, 55);
  }
}

export const sound = new SoundManager();
