// js/enigmes/zone4.js — Chapitre IV : Le Sarcophage Royal (Horloge, Runes, Gardien, Sceau, Pont Final & Hall of Fame)
import { db } from "../config.js";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { sound } from "../engine/audio.js";
import {
  state,
  hasItem,
  addItem,
  removeItems,
  recordClue,
  recordWinnerInFirebase
} from "../engine/state.js";
import {
  showModal,
  showItemShowcase,
  showToast,
  updateJournalBadge,
  escapeHtml
} from "../engine/ui.js";
import { launchStellarClock } from "../minigames/rampe-and-stars.js";
import { launchPectoralJewels } from "../minigames/hieroglyphs-and-jewels.js";
import { launchMirrorGuardian } from "../minigames/photo-hotspot.js";
import { launchGoldenSealPuzzle } from "../minigames/scarab-slots.js";
import { launchFinalBridgeLock } from "../minigames/bronze-dials.js";

export function createZone4Actions(engine) {
  return {
    donnerIndiceHorloge() {
      sound.playSFX("papyrus", 0.6);
      if (recordClue("indice_horloge")) {
        updateJournalBadge();
        showToast("Carte Stellaire consignée dans votre Carnet");
      }
      showModal({
        title: "Les 12 Heures de la Nuit",
        kicker: "Chapitre IV · Observatoire Stellaire",
        image: "assets/images/items/horloge_indice.webp",
        imageCaption: "Carte Stellaire — Course de Sirius",
        html: `<p>La carte céleste indique que l'étoile <strong>Sirius</strong> se trouve actuellement à la <strong>6e heure</strong> (tout en bas).</p>
               <p>Chaque traction sur le levier fait avancer la roue de <strong>3 heures</strong>. Alignez Sirius exactement au <strong>Zénith (12e heure)</strong> !</p>`
      });
    },

    enigmeHorloge() {
      if (!hasItem("Carte Stellaire")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Voûte céleste illisible",
          kicker: "Chapitre IV · Observatoire",
          text: "Sans la Carte Stellaire, vous ne savez pas quelle étoile aligner."
        });
        return;
      }
      launchStellarClock({
        onSolved: async () => {
          addItem("Amulette Oudjat");
          sound.playSFX("succes", 0.72);
          await engine.save();
          showItemShowcase(
            "Amulette Oudjat",
            "Le faisceau stellaire ouvre le socle de basalte ! Vous recueillez l'Amulette Oudjat, l'Œil sacré d'Horus.",
            () => engine.goTo("horloge_resolue")
          );
        }
      });
    },

    donnerIndiceRunes() {
      sound.playSFX("gravure", 0.55);
      if (recordClue("indice_runes")) {
        updateJournalBadge();
        showToast("Cycle de l'Éternité consigné dans votre Carnet");
      }
      showModal({
        title: "Le Cycle de l'Éternité",
        kicker: "Chapitre IV · Murmures du Sarcophage",
        image: "assets/images/items/rune_indice.webp",
        imageCaption: "Le Cycle de l'Éternité",
        html: `<p>À travers l'Amulette Oudjat, les murmures du tombeau deviennent limpides :</p>
               <p><em>« D'abord le <strong>Souffle de Vie</strong> (Ankh), puis l'<strong>Éclat du Jour</strong> (Disque Solaire), enfin la <strong>Transformation</strong> (Scarabée). »</em></p>`
      });
    },

    enigmeRunes() {
      if (!hasItem("Amulette Oudjat")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Illusion protectrice",
          kicker: "Chapitre IV · Parure Pectorale",
          text: "Il vous faut l'Amulette Oudjat pour percer l'illusion des joyaux."
        });
        return;
      }
      launchPectoralJewels({
        onSolved: async () => {
          addItem("Pilier Djed");
          sound.playSFX("succes", 0.72);
          await engine.save();
          showItemShowcase(
            "Pilier Djed",
            "Un tiroir secret jaillit du sarcophage royal ! Vous en retirez le précieux Pilier Djed, symbole de stabilité éternelle.",
            () => engine.goTo("runes_resolu")
          );
        }
      });
    },

    async fouillerTresor() {
      if (hasItem("Miroir de Bronze")) {
        showModal({
          title: "Trésor déjà fouillé",
          kicker: "Chapitre IV · Porte du Gardien",
          text: "Vous avez déjà récupéré le Miroir de Bronze au pied du colosse."
        });
        return;
      }
      sound.playSFX("cliquetis_or", 0.72);
      addItem("Miroir de Bronze");
      await engine.save();
      showItemShowcase(
        "Miroir de Bronze",
        "Parmi les pièces d'or et les coupes rituelles, votre main saisit un Miroir de Bronze d'un poli étincelant."
      );
    },

    enigmeGardien() {
      if (!hasItem("Miroir de Bronze")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Le Gardien vous barre la route",
          kicker: "Chapitre IV · Porte du Gardien",
          text: "Le colosse gronde dès que vous avancez ! Fouillez d'abord le trésor à ses pieds pour trouver un objet capable de le repousser."
        });
        return;
      }
      launchMirrorGuardian({
        onSolved: async () => {
          removeItems("Miroir de Bronze");
          sound.playSFX("succes", 0.72);
          await engine.save();
          showModal({
            title: "Le Colosse s'efface !",
            kicker: "Chapitre IV · Passage Libéré",
            image: "assets/images/items/miroir_indice.webp",
            imageCaption: "Le reflet aveuglant du Miroir de Bronze",
            text: "Le rayon concentré aveugle le Gardien de pierre qui pivote lourdement, libérant l'escalier en colimaçon vers la corniche de l'abîme.",
            buttonText: "Gravir l'escalier",
            onClose: () => engine.goTo("gardien_vaincu")
          });
        }
      });
    },

    donnerIndiceSceau() {
      sound.playSFX("gravure", 0.55);
      if (recordClue("indice_sceau")) {
        updateJournalBadge();
        showToast("Ordre de la Création consigné dans votre Carnet");
      }
      showModal({
        title: "L'Ordre de la Création",
        kicker: "Chapitre IV · Autel du Sceau d'Or",
        image: "assets/images/items/ordre_indice.webp",
        imageCaption: "L'Ordre de la Création",
        html: `<p>La stèle d'or proclame l'ordre immuable de la Genèse :</p>
               <p><strong>1.</strong> La Vie en premier (<strong>Ankh</strong>) ;<br>
                  <strong>2.</strong> Puis le Regard qui veille (<strong>Oudjat</strong>) ;<br>
                  <strong>3.</strong> Enfin la Stabilité éternelle (<strong>Pilier Djed</strong>).</p>`
      });
    },

    enigmeSceau() {
      // Préserve strictement la vérification originale (Oudjat + Djed) tout en permettant de placer les 3 clés sur l'autel
      if (!hasItem("Amulette Oudjat") || !hasItem("Pilier Djed")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Artefacts manquants",
          kicker: "Chapitre IV · Autel d'Or",
          text: "Il vous manque encore des clés sacrées (Amulette Oudjat et Pilier Djed) pour activer l'autel."
        });
        return;
      }
      launchGoldenSealPuzzle({
        onSolved: async () => {
          removeItems("Amulette Oudjat", "Pilier Djed", "Miroir de Bronze");
          addItem("Bague du Pharaon");
          sound.playSFX("succes", 0.72);
          await engine.save();
          showItemShowcase(
            "Bague du Pharaon",
            "Le pont d'or se déploie au-dessus de l'abîme ! Au centre de l'autel apparaît la Bague du Pharaon.",
            () => engine.goTo("sceau_resolu")
          );
        }
      });
    },

    donnerIndiceFinal() {
      sound.playSFX("cliquetis_bijoux", 0.7);
      if (recordClue("indice_bague")) {
        updateJournalBadge();
        showToast("Code gravé de la Bague consigné dans votre Carnet");
      }
      showModal({
        title: "La Bague du Pharaon",
        kicker: "Chapitre IV · Gravure Secrète",
        image: "assets/images/items/bague_item.webp",
        imageCaption: "Gravure interne de la Bague Royale",
        html: `<p>En inclinant l'anneau d'or massif vers les rayons du soleil qui filtrent sous la porte, vous distinguez trois chiffres finement ciselés à l'intérieur :</p>
               <p style="font-family:var(--font-display);font-size:1.35rem;letter-spacing:0.25em;color:var(--lapis-800);font-weight:700;">9 · 1 · 1</p>`
      });
    },

    enigmeFinal() {
      if (!hasItem("Bague du Pharaon")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Sceau Royal manquant",
          kicker: "Chapitre IV · Porte du Soleil",
          text: "Il vous faut la Bague du Pharaon pour déchiffrer le code de sortie."
        });
        return;
      }
      launchFinalBridgeLock({
        onSolved: async () => {
          sound.playSFX("triomphe", 0.8);
          await recordWinnerInFirebase();
          await engine.goTo("victoire");
        }
      });
    },

    async afficherHallOfFame() {
      sound.playSFX("papyrus", 0.6);
      let rowsHtml = `<p style="text-align:center;color:var(--ink-500);">Consultation des archives royales…</p>`;

      try {
        const q = query(collection(db, "winners"), orderBy("date", "desc"));
        const snap = await getDocs(q);
        if (snap.empty) {
          rowsHtml = `<p style="text-align:center;color:var(--ink-500);">Vous êtes le tout premier archéologue inscrit sur cette stèle !</p>`;
        } else {
          const items = [];
          let rank = 1;
          snap.forEach((docSnap) => {
            const d = docSnap.data();
            const dt = d.date?.toDate ? d.date.toDate().toLocaleDateString("fr-FR") : "Récemment";
            const isMe = docSnap.id === state.uid;
            items.push(`
              <li class="hof-item">
                <span class="hof-rank"><span class="hof-medal">${rank}</span>${escapeHtml(d.pseudo || "Explorateur")}${isMe ? " (Vous)" : ""}</span>
                <span class="hof-date">${escapeHtml(dt)}</span>
              </li>
            `);
            rank += 1;
          });
          rowsHtml = `<ul class="hof-list">${items.join("")}</ul>`;
        }
      } catch (err) {
        console.error("Erreur chargement Hall of Fame :", err);
        rowsHtml = `<p style="color:var(--jasper-600);">Impossible de lire la Liste des Archéologues pour le moment.</p>`;
      }

      showModal({
        title: "Liste des Grands Archéologues",
        kicker: "Hall of Fame · Expédition 1920",
        image: "assets/images/items/hall_fame.webp",
        imageCaption: "Stèle d'Honneur des Explorateurs d'Anubis",
        html: `<p>Voici les explorateurs ayant triomphé des quatorze épreuves du Tombeau Perdu d'Anubis :</p>`,
        extraHtml: rowsHtml,
        buttonText: "Fermer la stèle"
      });
    },

    demandeRejouer() {
      showModal({
        title: "Nouvelle Expédition",
        kicker: "Secrétariat de l'Académie",
        html: `<p>Bravo pour votre triomphe dans le Tombeau Perdu d'Anubis !</p>
               <p>Pour réinitialiser votre sauvegarde et recommencer l'aventure depuis l'Antichambre du Sable, contactez le créateur :</p>
               <p><strong>bruno83200.6929@gmail.com</strong></p>
               <p style="font-size:0.9rem;color:var(--ink-500);">© 2026 — Imaginé et créé par Bruno CULOT</p>`,
        buttonText: "Compris"
      });
    }
  };
}
