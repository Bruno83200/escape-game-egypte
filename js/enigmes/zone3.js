// js/enigmes/zone3.js — Chapitre III : Les Épreuves Sacrées (Balance de Maât, Réservoir du Nil, Rampe)
import { sound } from "../engine/audio.js";
import { hasItem, addItem, removeItems, recordClue } from "../engine/state.js";
import { showModal, showItemShowcase, showToast, updateJournalBadge } from "../engine/ui.js";
import { launchMaatScale } from "../minigames/maat-scale.js";
import { launchNilJugs } from "../minigames/nil-jugs.js";
import { launchPyramidRamp } from "../minigames/rampe-and-stars.js";

export function createZone3Actions(engine) {
  return {
    donnerIndiceBalance() {
      sound.playSFX("gravure", 0.55);
      if (recordClue("indice_balance")) {
        updateJournalBadge();
        showToast("Stèle de Maât archivée dans votre Carnet");
      }
      showModal({
        title: "Stèle des Plumes de Maât",
        kicker: "Chapitre III · Salle des Pesées",
        image: "assets/images/items/poids_indice.webp",
        imageCaption: "Valeurs des Plumes de Maât",
        html: `<p>Le cœur de pierre sur le plateau gauche pèse <strong>42</strong>.</p>
               <p>Voici la valeur de chaque plume sacrée :<br>
                  • <strong>Justice</strong> : 20 · <strong>Sagesse</strong> : 10 · <strong>Honneur</strong> : 5 · <strong>Pureté</strong> : 2.</p>
               <p><em>« Équilibrez exactement 42 avec le plus petit nombre de plumes possible. »</em></p>`
      });
    },

    activerBalance() {
      if (!hasItem("Ibis de Jade")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Balance figée",
          kicker: "Chapitre III · Salle des Pesées",
          text: "Il vous manque l'Ibis de Jade pour déverrouiller le mécanisme de la Balance de Maât."
        });
        return;
      }
      launchMaatScale({
        onSolved: async () => {
          removeItems("Ibis de Jade");
          addItem("Vase Canope (Hapi)");
          sound.playSFX("succes", 0.72);
          await engine.save();
          showItemShowcase(
            "Vase Canope (Hapi)",
            "L'équilibre est parfait ! Une niche dorée s'ouvre sous la balance et dévoile le Vase Canope d'Hapi, gardien des eaux.",
            () => engine.goTo("balance_resolue")
          );
        }
      });
    },

    donnerIndiceReservoir() {
      sound.playSFX("gravure", 0.55);
      if (recordClue("indice_reservoir")) {
        updateJournalBadge();
        showToast("Gravure hydraulique ajoutée au Carnet");
      }
      showModal({
        title: "Les Jarres du Nil (3 L & 5 L)",
        kicker: "Chapitre III · Réservoir Hydraulique",
        image: "assets/images/items/volume_indice.webp",
        imageCaption: "Gravure hydraulique : 3 L · 5 L → 4 L",
        html: `<p>Le conduit sacré n'accepte qu'un volume exact de <strong>4 litres</strong>.</p>
               <p>Vous disposez d'une jarre de <strong>5 L</strong> et d'une jarre de <strong>3 L</strong>. Transvasez l'eau jusqu'à mesurer précisément 4 litres dans le conduit.</p>`
      });
    },

    enigmeReservoir() {
      if (!hasItem("Vase Canope (Hapi)")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Conduit scellé",
          kicker: "Chapitre III · Réservoir du Nil",
          text: "Vous avez besoin du Vase Canope (Hapi) pour ouvrir l'arrivée d'eau sacrée."
        });
        return;
      }
      launchNilJugs({
        onSolved: async () => {
          removeItems("Vase Canope (Hapi)");
          addItem("Ankh de Bronze");
          sound.playSFX("succes", 0.72);
          await engine.save();
          showItemShowcase(
            "Ankh de Bronze",
            "L'eau déclenche un contrepoids millénaire ! Du fond du bassin émerge un étincelant Ankh de Bronze.",
            () => engine.goTo("reservoir_resolu")
          );
        }
      });
    },

    donnerIndiceRampe() {
      sound.playSFX("gravure", 0.55);
      if (recordClue("indice_rampe")) {
        updateJournalBadge();
        showToast("Relevé géométrique ajouté au Carnet");
      }
      showModal({
        title: "Le Triangle Parfait",
        kicker: "Chapitre III · Géométrie Sacrée",
        image: "assets/images/items/triangle_indice.webp",
        imageCaption: "Le Triangle Parfait (Équilatéral)",
        html: `<p>Les architectes royaux ont gravé dans la pierre :</p>
               <p><em>« Seule l'inclinaison du triangle parfait — celui dont les trois côtés sont parfaitement égaux — permettra au bloc de gravir la rampe. »</em></p>`
      });
    },

    enigmeRampe() {
      if (!hasItem("Ankh de Bronze")) {
        sound.playSFX("echec", 0.62);
        showModal({
          title: "Encoche vide sur le bloc",
          kicker: "Chapitre III · La Rampe",
          text: "Vous devez posséder l'Ankh de Bronze pour libérer le verrou du bloc de pierre."
        });
        return;
      }
      sound.playSFX("insertion_ankh", 0.7);
      launchPyramidRamp({
        onSolved: async () => {
          removeItems("Ankh de Bronze");
          addItem("Carte Stellaire");
          sound.playSFX("succes", 0.72);
          await engine.save();
          showItemShowcase(
            "Carte Stellaire",
            "Le bloc atteint le sommet et dégage une niche ! Vous y trouvez une Carte Stellaire en basalte incrustée d'or.",
            () => engine.goTo("rampe_resolue")
          );
        }
      });
    }
  };
}
