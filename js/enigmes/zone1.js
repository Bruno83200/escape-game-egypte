// js/enigmes/zone1.js — Chapitre I : L'Antichambre (Lentille, Scarabées, Mur des Scribes)
import { sound } from "../engine/audio.js";
import { hasItem, addItem, removeItems, recordClue } from "../engine/state.js";
import { showModal, showItemShowcase, showToast, updateJournalBadge } from "../engine/ui.js";
import { launchSandPolish } from "../minigames/sand-polish.js";
import { launchScarabPuzzle } from "../minigames/scarab-slots.js";
import { launchScribesCartouche } from "../minigames/hieroglyphs-and-jewels.js";

export function createZone1Actions(engine) {
  return {
    enigmeLentille() {
      launchSandPolish({
        onSolved: async () => {
          addItem("Lentille de Cristal");
          sound.playSFX("succes", 0.7);
          await engine.save();
          showItemShowcase(
            "Lentille de Cristal",
            "En frottant la poussière, un rayon lumineux jaillit et dévoile une porte dissimulée ! Vous rangez la Lentille de Cristal dans votre sac.",
            () => {
              sound.playSFX("pierre_lourde", 0.72);
              engine.goTo("antichambre_eclairee");
            }
          );
        }
      });
    },

    async fouillerJarres() {
      if (hasItem("Scarabées de Couleur")) {
        showModal({
          title: "Jarres déjà fouillées",
          kicker: "Chapitre I · Antichambre",
          text: "Les jarres sont vides : vous avez déjà recueilli les trois scarabées précieux."
        });
        return;
      }
      sound.playSFX("poterie", 0.72);
      addItem("Scarabées de Couleur");
      await engine.save();
      showItemShowcase(
        "Scarabées de Couleur",
        "En brisant le sceau d'argile, vous découvrez trois scarabées : un bleu lapis-lazuli, un rouge jaspe et un vert malachite."
      );
    },

    resoudreScarabees() {
      if (!hasItem("Scarabées de Couleur")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Encoches vides",
          kicker: "Chapitre I · Fresque des Scarabées",
          text: "Il vous manque les scarabées pour activer ce mécanisme. Fouillez d'abord les jarres scellées dans la pièce."
        });
        return;
      }
      launchScarabPuzzle({
        onSolved: async () => {
          removeItems("Scarabées de Couleur");
          addItem("Tablette de Traduction");
          sound.playSFX("succes", 0.7);
          await engine.save();
          showItemShowcase(
            "Tablette de Traduction",
            "Les scarabées s'emboîtent et le mur pivote ! Dans une niche dissimulée, vous recueillez la Tablette de Traduction.",
            () => engine.goTo("scarabee_ouvert")
          );
        }
      });
    },

    donnerIndiceScribes() {
      sound.playSFX("gravure", 0.55);
      if (recordClue("indice_scribes")) {
        updateJournalBadge();
        showToast("Relevé archivé dans votre Carnet d'Archéologue");
      }
      showModal({
        title: "La Tablette de Traduction",
        kicker: "Chapitre I · Relevé Hiéroglyphique",
        image: "assets/images/items/tablette_item.webp",
        imageCaption: "Tablette de Traduction — Cartouche des Scribes",
        html: `<p>La tablette révèle le sens des trois symboles gravés dans le cartouche doré :</p>
               <p>« Le <strong>souffle</strong> donne le commencement (<strong>V</strong>), le <strong>roseau</strong> relie (<strong>I</strong>) et la <strong>source</strong> marque la fin (<strong>E</strong>). »</p>`
      });
    },

    enigmeScribes() {
      if (!hasItem("Tablette de Traduction")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Écriture indéchiffrable",
          kicker: "Chapitre I · Le Mur des Scribes",
          text: "Vous ne comprenez pas ces hiéroglyphes sans la Tablette de Traduction."
        });
        return;
      }
      launchScribesCartouche({
        onSolved: async () => {
          addItem("Sceptre d'Anubis");
          sound.playSFX("succes", 0.72);
          await engine.save();
          showItemShowcase(
            "Sceptre d'Anubis",
            "Le mur s'efface dans un souffle mystique ! Sur un piédestal d'obsidienne repose le Sceptre d'Anubis.",
            () => {
              sound.playSFX("pierre_lourde", 0.7);
              engine.goTo("scribes_ouvert");
            }
          );
        }
      });
    }
  };
}
