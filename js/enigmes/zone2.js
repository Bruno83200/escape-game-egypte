// js/enigmes/zone2.js — Chapitre II : Couloir des Malédictions (Statues, Fresque du Nil, Trappe de Bronze)
import { sound } from "../engine/audio.js";
import { hasItem, addItem, removeItems, recordClue } from "../engine/state.js";
import { showModal, showItemShowcase, showToast, updateJournalBadge } from "../engine/ui.js";
import { launchStatuesHotspot, launchFresqueIntruder } from "../minigames/photo-hotspot.js";
import { launchTrapdoorDials } from "../minigames/bronze-dials.js";

export function createZone2Actions(engine) {
  return {
    donnerIndiceStatues() {
      sound.playSFX("pas_pierre", 0.65);
      showModal({
        title: "Les Trois Colosses de Granit",
        kicker: "Chapitre II · Observation",
        image: "assets/images/scenes/statues_01.webp",
        imageCaption: "Horus (gauche), Thot (centre) et Sobek (droite)",
        html: `<p>Vous observez les trois colosses alignés dans le couloir :</p>
               <p>• <strong>Horus</strong> (à gauche), le dieu à tête de faucon, maître du ciel ;<br>
                  • <strong>Thot</strong> (au centre), le dieu scribe à tête d'ibis ;<br>
                  • <strong>Sobek</strong> (à droite), le dieu crocodile des eaux du Nil.</p>
               <p>La plaque de cuivre au sol déclare : <em>« Le messager du ciel a perdu son guide. »</em></p>`
      });
    },

    enigmeStatues() {
      if (!hasItem("Sceptre d'Anubis")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Sceptre manquant",
          kicker: "Chapitre II · Les Trois Colosses",
          text: "Vous n'avez pas le Sceptre d'Anubis pour interagir avec ces statues."
        });
        return;
      }
      launchStatuesHotspot({
        onSolved: async () => {
          removeItems("Sceptre d'Anubis");
          addItem("Fragment de Fresque");
          sound.playSFX("succes", 0.72);
          await engine.save();
          showItemShowcase(
            "Fragment de Fresque",
            "Le panneau s'ouvre sous le socle d'Horus ! Vous y découvrez un Fragment de Fresque peint aux couleurs du Nil.",
            () => {
              sound.playSFX("porte_pierre_2", 0.7);
              engine.goTo("statues_resolu");
            }
          );
        }
      });
    },

    donnerIndiceFresque() {
      sound.playSFX("fresque_clip", 0.55);
      showModal({
        title: "Inscription au dos du Fragment",
        kicker: "Chapitre II · Labyrinthe des Fresques",
        image: "assets/images/items/fresque_item.webp",
        imageCaption: "Fragment de Fresque — Cliquez pour ouvrir à la loupe",
        html: `<p>Au dos du morceau de calcaire, une main ancienne a gravé :</p>
               <p><em>« Sept animaux du Nil s'unissent ici, mais un voyageur des glaces s'est glissé parmi eux. Touchez l'intrus pour sceller la fresque ! »</em></p>`
      });
    },

    enigmeFresque() {
      if (!hasItem("Fragment de Fresque")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Fragment introuvable",
          kicker: "Chapitre II · Labyrinthe des Fresques",
          text: "Vous n'avez pas le Fragment de Fresque nécessaire pour combler cette brèche."
        });
        return;
      }
      launchFresqueIntruder({
        onSolved: async () => {
          removeItems("Fragment de Fresque");
          addItem("Parchemin de Papyrus");
          sound.playSFX("succes", 0.72);
          await engine.save();
          showItemShowcase(
            "Parchemin de Papyrus",
            "Le panneau coulisse derrière la fresque, révélant une alcôve secrète où repose un Parchemin de Papyrus roulé.",
            () => {
              sound.playSFX("panneau_secret", 0.72);
              engine.goTo("fresque_resolue");
            }
          );
        }
      });
    },

    lirePapyrus() {
      if (!hasItem("Parchemin de Papyrus")) {
        sound.playSFX("echec", 0.6);
        showModal({
          title: "Aucun parchemin",
          kicker: "Chapitre II · Trappe de Bronze",
          text: "Vous n'avez aucun parchemin à déchiffrer dans votre sac."
        });
        return;
      }
      sound.playSFX("papyrus", 0.7);
      if (recordClue("indice_papyrus_trappe")) {
        updateJournalBadge();
        showToast("Papyrus consigné dans votre Carnet d'Archéologue");
      }
      showModal({
        title: "Le Parchemin des Trois Fragments",
        kicker: "Chapitre II · Archive Papyrus",
        image: "assets/images/items/papyrus2_item.webp",
        imageCaption: "Les Trois Fragments de Papyrus — Code de la Trappe",
        html: `<p>Le rouleau d'encre noire dévoile trois énigmes numériques :</p>
               <p>• <strong>I.</strong> Le nombre de mains d'un homme ;<br>
                  • <strong>II.</strong> L'œil qui resta à Horus après son combat contre Seth ;<br>
                  • <strong>III.</strong> Le nombre de pattes du scarabée sacré.</p>`
      });
    },

    enigmeTrappe() {
      if (!hasItem("Parchemin de Papyrus")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Code inconnu",
          kicker: "Chapitre II · Trappe de Bronze",
          text: "Sans le parchemin de papyrus, vous ne pouvez pas connaître la combinaison de ces anneaux."
        });
        return;
      }
      launchTrapdoorDials({
        onSolved: async () => {
          removeItems("Parchemin de Papyrus");
          addItem("Ibis de Jade");
          sound.playSFX("succes", 0.72);
          await engine.save();
          showItemShowcase(
            "Ibis de Jade",
            "La trappe bascule sur un escalier secret ! Sur la première marche brille une statuette d'Ibis de Jade.",
            () => engine.goTo("trappe_ouverte")
          );
        }
      });
    }
  };
}
