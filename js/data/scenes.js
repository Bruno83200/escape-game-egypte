// js/data/scenes.js — L'Héritage d'Anubis (28 scènes · 4 chapitres archéologiques)

export const ZONES = [
  { id: 1, roman: "I", name: "L'Antichambre", desc: "Piédestal de cristal, Scarabées solaires et Mur des Scribes" },
  { id: 2, roman: "II", name: "Couloir des Malédictions", desc: "Colosses de granit, Fresque du Nil et Trappe de bronze" },
  { id: 3, roman: "III", name: "Les Épreuves Sacrées", desc: "Balance de Maât, Réservoir du Nil et Rampe de la Pyramide" },
  { id: 4, roman: "IV", name: "Le Sarcophage Royal", desc: "Observatoire stellaire, Runes, Gardien, Sceau d'Or et Pont Final" }
];

// Catalogue complet des 14 artefacts du sac d'explorateur (noms identiques à Firestore)
export const ITEM_CATALOG = {
  "Lentille de Cristal": {
    title: "Lentille de Cristal",
    image: "assets/images/items/lens_item.webp",
    description: "Un cristal solaire poli à la main, capable d'éveiller les hiéroglyphes endormis."
  },
  "Scarabées de Couleur": {
    title: "Scarabées de Couleur",
    image: "assets/images/items/scarabee_item.webp",
    description: "Trois talismans précieux : lapis-lazuli bleu, malachite verte et jaspe rouge."
  },
  "Tablette de Traduction": {
    title: "Tablette de Traduction",
    image: "assets/images/items/tablette_item.webp",
    description: "Une tablette hiéroglyphique gravée permettant de décrypter les cartouches royaux."
  },
  "Sceptre d'Anubis": {
    title: "Sceptre d'Anubis",
    image: "assets/images/items/sceptre_item.webp",
    description: "Un sceptre cérémoniel en obsidienne destiné au messager du ciel."
  },
  "Fragment de Fresque": {
    title: "Fragment de Fresque",
    image: "assets/images/items/fresque_item.webp",
    description: "Un morceau de fresque peinte représentant la faune du Nil… avec un curieux intrus."
  },
  "Parchemin de Papyrus": {
    title: "Parchemin de Papyrus",
    image: "assets/images/items/papyrus_item.webp",
    description: "Un vieux rouleau scellé renfermant trois énigmes numériques."
  },
  "Ibis de Jade": {
    title: "Ibis de Jade",
    image: "assets/images/items/ibis_item.webp",
    description: "Statuette sacrée de Thot, dieu scribe de la sagesse, requise pour activer la Balance de Maât."
  },
  "Vase Canope (Hapi)": {
    title: "Vase Canope (Hapi)",
    image: "assets/images/items/canope_item.webp",
    description: "Vase d'albâtre consacré à Hapi, gardien des crues et des eaux du Nil."
  },
  "Ankh de Bronze": {
    title: "Ankh de Bronze",
    image: "assets/images/items/ankh_item.webp",
    description: "Clé de vie en bronze forgé, conçue pour libérer le bloc de la grande rampe."
  },
  "Carte Stellaire": {
    title: "Carte Stellaire",
    image: "assets/images/items/carte_stellaire_item.webp",
    description: "Fragment de basalte incrusté d'étoiles d'or indiquant la course nocturne de Sirius."
  },
  "Amulette Oudjat": {
    title: "Amulette Oudjat",
    image: "assets/images/items/oudjat_item.webp",
    description: "L'Œil sacré d'Horus qui perce les illusions et révèle l'ordre véritable des runes."
  },
  "Pilier Djed": {
    title: "Pilier Djed",
    image: "assets/images/items/djed_item.webp",
    description: "Symbole sacré de stabilité éternelle, clé indispensable du Sceau d'Or."
  },
  "Miroir de Bronze": {
    title: "Miroir de Bronze",
    image: "assets/images/items/miroir_item.webp",
    description: "Un miroir en bronze si finement poli qu'il renvoie la moindre lueur avec un éclat aveuglant."
  },
  "Bague du Pharaon": {
    title: "Bague du Pharaon",
    image: "assets/images/items/bague_item.webp",
    description: "Anneau d'or massif ciselé de trois chiffres secrets à l'intérieur : 9 · 1 · 1."
  }
};

// Relevés & papyrus archivés automatiquement dans le Carnet d'Archéologue
export const CLUE_CATALOG = {
  indice_scribes: {
    title: "Cartouche des Scribes",
    image: "assets/images/items/tablette_item.webp",
    text: "Le souffle donne le commencement (V), le roseau relie (I), la source marque la fin (E) → VIE."
  },
  indice_papyrus_trappe: {
    title: "Les Trois Fragments de Papyrus",
    image: "assets/images/items/papyrus2_item.webp",
    text: "Mains d'un homme (2), œil d'Horus après Seth (1), pattes du scarabée sacré (6) → 216."
  },
  indice_balance: {
    title: "Stèle des Plumes de Maât",
    image: "assets/images/items/poids_indice.webp",
    text: "Le cœur pèse 42. Justice = 20, Sagesse = 10, Honneur = 5, Pureté = 2."
  },
  indice_reservoir: {
    title: "Gravure du Réservoir (3L · 5L → 4L)",
    image: "assets/images/items/volume_indice.webp",
    text: "Remplir 5 L, verser dans 3 L : il reste 2 L. Deux fois ce reste donnent exactement 4 L."
  },
  indice_rampe: {
    title: "Le Triangle Parfait",
    image: "assets/images/items/triangle_indice.webp",
    text: "Un triangle aux trois côtés égaux possède trois angles de 60°."
  },
  indice_horloge: {
    title: "Les 12 Heures de la Nuit",
    image: "assets/images/items/horloge_indice.webp",
    text: "Sirius est à la 6e heure ; chaque tour de levier avance de 3 heures vers le zénith (12e heure)."
  },
  indice_runes: {
    title: "Le Cycle de l'Éternité",
    image: "assets/images/items/rune_indice.webp",
    text: "Ordre ancestral : Souffle de Vie (Ankh) → Éclat du Jour (Disque) → Transformation (Scarabée)."
  },
  indice_sceau: {
    title: "L'Ordre de la Création",
    image: "assets/images/items/ordre_indice.webp",
    text: "La Vie en premier (Ankh), puis le Regard (Oudjat), enfin la Stabilité éternelle (Djed)."
  },
  indice_bague: {
    title: "Gravure de la Bague Royale",
    image: "assets/images/items/bague_item.webp",
    text: "Trois chiffres gravés à l'intérieur de l'anneau d'or du Pharaon : 9 - 1 - 1."
  }
};

export const SCENE_ORDER = [
  "antichambre_sable", "antichambre_eclairee", "scarabee_mur", "scarabee_ouvert", "scribes_mur", "scribes_ouvert",
  "statues_couloir", "statues_resolu", "labyrinthe_fresques", "fresque_resolue", "trappe_papyrus", "trappe_ouverte",
  "salle_pesées", "balance_resolue", "reservoir_nil", "reservoir_resolu", "rampe_pyramide", "rampe_resolue",
  "horloge_stellaire", "horloge_resolue", "code_runes", "runes_resolu", "porte_gardiens", "gardien_vaincu",
  "sceau_or", "sceau_resolu", "pont_final", "victoire"
];

export const scenes = {
  "antichambre_sable": {
    zone: 1, step: 1, title: "L'Antichambre du Sable",
    text: "Une dalle s'est effondrée derrière vous. Le silence n'est rompu que par un sifflement de vent. Un piédestal trône au centre, recouvert d'une poussière millénaire.",
    hint: "Frottez le cristal sur le piédestal pour balayer la poussière et laisser jaillir le rayon lumineux.",
    image: "assets/images/scenes/antichambre_01.webp",
    ambience: "vent_desert",
    choices: [
      { text: "Examiner le piédestal", action: "enigmeLentille", icon: "sun", primary: true }
    ]
  },
  "antichambre_eclairee": {
    zone: 1, step: 2, title: "L'Antichambre Éclairée",
    text: "La lumière inonde la pièce. Les hiéroglyphes sur les murs s'éveillent. Une porte massive s'est débloquée au fond de la salle.",
    image: "assets/images/scenes/antichambre_02.webp",
    ambience: "mystere",
    choices: [
      { text: "S'approcher du mur éclairé", next: "scarabee_mur", icon: "arrow", primary: true }
    ]
  },
  "scarabee_mur": {
    zone: 1, step: 3, title: "La Fresque des Scarabées",
    text: "Le faisceau de lumière frappe trois encoches circulaires sur une fresque murale représentant le cycle du soleil. Des jarres scellées reposent dans un coin.",
    hint: "Fouillez d'abord les jarres, puis placez les scarabées dans l'ordre : Bleu (Nil) · Vert (Forêt au centre) · Rouge (Soleil).",
    image: "assets/images/scenes/scarabee_01.webp",
    ambience: "mystere",
    choices: [
      { text: "Fouiller les jarres", action: "fouillerJarres", icon: "search" },
      { text: "Placer les scarabées", action: "resoudreScarabees", icon: "gem", primary: true }
    ]
  },
  "scarabee_ouvert": {
    zone: 1, step: 4, title: "Le Mur Pivoté",
    text: "Les scarabées s'emboîtent parfaitement. Dans un grondement de pierre, le mur pivote, révélant un nouveau passage sombre.",
    image: "assets/images/scenes/scarabee_02.webp",
    ambience: "vent_desert",
    choices: [
      { text: "Pénétrer dans le couloir", next: "scribes_mur", icon: "arrow", primary: true }
    ]
  },
  "scribes_mur": {
    zone: 1, step: 5, title: "Le Mur des Scribes",
    text: "Un murmure semble s'échapper des murs. Devant vous, un cartouche doré isole trois symboles : une Plume, un Roseau et des Ondes d'eau. La Tablette de Traduction dans votre sac devrait vous aider.",
    hint: "Le souffle (V) + le roseau qui relie (I) + la source finale (E) forment le mot sacré : VIE.",
    image: "assets/images/scenes/scribes_01.webp",
    ambience: "murmures",
    choices: [
      { text: "Consulter la Tablette", action: "donnerIndiceScribes", icon: "scroll" },
      { text: "Déchiffrer le mot sacré", action: "enigmeScribes", icon: "feather", primary: true }
    ]
  },
  "scribes_ouvert": {
    zone: 1, step: 6, title: "Passage des Hiéroglyphes",
    text: "Le mécanisme a cédé. Le mur de hiéroglyphes s'est effacé pour révéler l'entrée d'un couloir sombre. Vous sentez que le véritable défi commence ici.",
    image: "assets/images/scenes/scribes_02.webp",
    ambience: null,
    choices: [
      { text: "Entrer dans le Couloir des Malédictions", next: "statues_couloir", icon: "arrow", primary: true }
    ]
  },
  "statues_couloir": {
    zone: 2, step: 7, title: "Les Trois Colosses de Granit",
    text: "Le couloir est bordé de trois gigantesques statues de granit : Sobek le crocodile, Thot l'ibis et Horus le faucon. Une plaque de cuivre au sol dit : « Le messager du ciel a perdu son guide ».",
    hint: "Horus, le dieu à tête de faucon (à gauche), est le maître du ciel et tend ses mains de pierre.",
    image: "assets/images/scenes/statues_01.webp",
    ambience: "vent_profond",
    choices: [
      { text: "Observer les statues", action: "donnerIndiceStatues", icon: "eye" },
      { text: "Placer le Sceptre d'Anubis", action: "enigmeStatues", icon: "key", primary: true }
    ]
  },
  "statues_resolu": {
    zone: 2, step: 8, title: "Le Socle d'Horus",
    text: "Le sceptre vibre violemment dans la main de pierre d'Horus. Dans un fracas lourd, un panneau se dérobe à la base de la statue, libérant le passage vers une nouvelle galerie.",
    image: "assets/images/scenes/statues_02.webp",
    ambience: "vent_profond",
    choices: [
      { text: "S'engager dans le passage", next: "labyrinthe_fresques", icon: "arrow", primary: true }
    ]
  },
  "labyrinthe_fresques": {
    zone: 2, step: 9, title: "Le Labyrinthe des Fresques",
    text: "Une fresque immense couvre le mur de calcaire. Elle fourmille de détails représentant la faune du Nil, mais une large brèche au centre défigure l'œuvre. Votre Fragment de Fresque semble correspondre exactement à ce vide.",
    hint: "Observez bien le coin inférieur droit du fragment : un voyageur des glaces s'est glissé parmi les animaux du Nil !",
    image: "assets/images/scenes/fresque_01.webp",
    ambience: "echo_caverne",
    choices: [
      { text: "Lire l'inscription sur le fragment", action: "donnerIndiceFresque", icon: "scroll" },
      { text: "Replacer le fragment", action: "enigmeFresque", icon: "search", primary: true }
    ]
  },
  "fresque_resolue": {
    zone: 2, step: 10, title: "L'Alcôve du Papyrus",
    text: "Le fragment s'est scellé parfaitement. Sous la peinture, un panneau a glissé, libérant l'accès à une petite alcôve où repose un papyrus. Vous le ramassez et vous dirigez vers une lourde trappe de bronze au sol un peu plus loin.",
    image: "assets/images/scenes/fresque_02.webp",
    ambience: "echo_caverne",
    choices: [
      { text: "S'approcher de la trappe au sol", next: "trappe_papyrus", icon: "arrow", primary: true }
    ]
  },
  "trappe_papyrus": {
    zone: 2, step: 11, title: "La Trappe de Bronze",
    text: "Une trappe de bronze est scellée dans le dallage. Elle est verrouillée par trois anneaux rotatifs gravés de chiffres anciens. Le papyrus que vous venez de trouver semble être la clé.",
    hint: "Mains d'un homme (2), œil d'Horus après son combat contre Seth (1), pattes du scarabée sacré (6) → 216.",
    image: "assets/images/scenes/trappe_01.webp",
    ambience: "vent_profond",
    choices: [
      { text: "Déchiffrer le papyrus", action: "lirePapyrus", icon: "scroll" },
      { text: "Manipuler les anneaux", action: "enigmeTrappe", icon: "gear", primary: true }
    ]
  },
  "trappe_ouverte": {
    zone: 2, step: 12, title: "Descente vers la Salle Dorée",
    text: "Dans un claquement métallique, les verrous se libèrent. La trappe bascule, révélant une statuette d'ibis en jade. Vous la récupérez avant de vous engager dans un escalier qui descend vers une salle baignée d'une lumière dorée.",
    image: "assets/images/scenes/trappe_02.webp",
    ambience: "vent_profond",
    choices: [
      { text: "Entrer dans la Salle des Pesées", next: "salle_pesées", icon: "arrow", primary: true }
    ]
  },
  "salle_pesées": {
    zone: 3, step: 13, title: "La Salle des Pesées de Maât",
    text: "Vous entrez dans la Salle de la Vérité. Une balance monumentale trône au centre. Sur le plateau de gauche, un cœur de pierre. Le plateau de droite attend son contrepoids. Une stèle indique les valeurs des Plumes de Maât.",
    hint: "Pour équilibrer 42 avec le minimum de plumes : 2 plumes de Justice (2 × 20 = 40) + 1 plume de Pureté (2) = 42.",
    image: "assets/images/scenes/balance_01.webp",
    ambience: "choeur_divin",
    choices: [
      { text: "Examiner la stèle des plumes", action: "donnerIndiceBalance", icon: "scroll" },
      { text: "Déposer l'Ibis de Jade", action: "activerBalance", icon: "scale", primary: true }
    ]
  },
  "balance_resolue": {
    zone: 3, step: 14, title: "L'Équilibre Parfait",
    text: "L'équilibre est parfait. Un gong profond résonne dans la salle tandis qu'une porte massive s'ouvre lentement. Vous récupérez le Vase Canope et vous avancez vers une chambre où l'on entend un bruit d'eau courante.",
    image: "assets/images/scenes/balance_02.webp",
    ambience: "choeur_divin",
    choices: [
      { text: "Entrer dans la salle du réservoir", next: "reservoir_nil", icon: "arrow", primary: true }
    ]
  },
  "reservoir_nil": {
    zone: 3, step: 15, title: "Le Réservoir du Nil",
    text: "Cette salle abrite un système hydraulique complexe. Deux jarres vides (3 L et 5 L) sont posées près d'un bassin. Une inscription indique qu'il faut verser une quantité très précise (4 L) dans le conduit pour activer le mécanisme.",
    hint: "Remplissez la jarre de 5 L, versez-la dans celle de 3 L (il reste 2 L), puis versez ces 2 L dans le conduit. Recommencez une seconde fois pour atteindre 4 L !",
    image: "assets/images/scenes/reservoir_01.webp",
    ambience: "eau_ruissellement",
    choices: [
      { text: "Observer les gravures", action: "donnerIndiceReservoir", icon: "scroll" },
      { text: "Manipuler les jarres", action: "enigmeReservoir", icon: "droplet", primary: true }
    ]
  },
  "reservoir_resolu": {
    zone: 3, step: 16, title: "L'Ankh de Bronze Libéré",
    text: "L'Ankh de bronze luit entre vos mains. Alors que vous quittez la salle du réservoir, vous arrivez devant une immense rampe ascendante obstruée par un bloc de pierre colossal.",
    image: "assets/images/scenes/reservoir_02.webp",
    ambience: "eau_ruissellement",
    choices: [
      { text: "S'approcher de la rampe", next: "rampe_pyramide", icon: "arrow", primary: true }
    ]
  },
  "rampe_pyramide": {
    zone: 3, step: 17, title: "La Rampe de la Pyramide",
    text: "Un bloc rectangulaire bloque le passage. Une rampe permet de le faire glisser vers le haut, mais son inclinaison doit être réglée avec précision. Une encoche sur le bloc semble attendre l'Ankh de Bronze.",
    hint: "Un triangle parfait (équilatéral, aux trois côtés égaux) a trois angles identiques : 180° ÷ 3 = 60°.",
    image: "assets/images/scenes/rampe_01.webp",
    ambience: "vent_interieur_pyramide",
    choices: [
      { text: "Observer les gravures murales", action: "donnerIndiceRampe", icon: "scroll" },
      { text: "Insérer l'Ankh et régler l'angle", action: "enigmeRampe", icon: "ruler", primary: true }
    ]
  },
  "rampe_resolue": {
    zone: 3, step: 18, title: "L'Escalier vers le Cosmos",
    text: "Le bloc atteint le sommet et se verrouille. Derrière la porte dérobée, un escalier en colimaçon s'enfonce dans les profondeurs de la pyramide jusqu'à une salle dont le plafond semble ouvert sur le cosmos.",
    image: "assets/images/scenes/rampe_02.webp",
    ambience: "vent_interieur_pyramide",
    choices: [
      { text: "Monter vers l'Observatoire", next: "horloge_stellaire", icon: "arrow", primary: true }
    ]
  },
  "horloge_stellaire": {
    zone: 4, step: 19, title: "L'Observatoire Stellaire",
    text: "Vous êtes dans l'Observatoire de la voûte céleste. Des conduits étroits traversent la pierre vers le ciel. Un mécanisme central permet de faire pivoter une carte du ciel gravée dans le basalte.",
    hint: "Sirius commence à la 6e heure. Chaque tour de levier avance de 3 heures : il faut exactement 2 tours pour atteindre la 12e heure (Zénith).",
    image: "assets/images/scenes/etoiles_01.webp",
    ambience: "mystere_etoiles",
    choices: [
      { text: "Consulter la Carte Stellaire", action: "donnerIndiceHorloge", icon: "scroll" },
      { text: "Actionner le levier de rotation", action: "enigmeHorloge", icon: "compass", primary: true }
    ]
  },
  "horloge_resolue": {
    zone: 4, step: 20, title: "La Chambre du Sarcophage",
    text: "L'alignement est parfait. Vous saisissez l'Amulette Oudjat. Soudain, un pan de mur au fond de l'observatoire se retire, révélant la chambre funéraire où repose le sarcophage royal, étincelant d'or et de lapis-lazuli.",
    image: "assets/images/scenes/etoiles_02.webp",
    ambience: "mystere_etoiles",
    choices: [
      { text: "S'approcher du Sarcophage", next: "code_runes", icon: "arrow", primary: true }
    ]
  },
  "code_runes": {
    zone: 4, step: 21, title: "La Parure Pectorale",
    text: "Le sarcophage est scellé par une parure pectorale complexe. Trois joyaux se détachent : ils portent les symboles de l'Ankh, du Disque Solaire et du Scarabée. Une voix semble murmurer un ordre ancestral.",
    hint: "Pressez les joyaux dans l'ordre du cycle éternel : 1. Ankh (Vie) → 2. Disque Solaire (Jour) → 3. Scarabée (Transformation).",
    image: "assets/images/scenes/runes_01.webp",
    ambience: "murmures_runiques",
    choices: [
      { text: "Écouter les murmures", action: "donnerIndiceRunes", icon: "scroll" },
      { text: "Presser les joyaux", action: "enigmeRunes", icon: "gem", primary: true }
    ]
  },
  "runes_resolu": {
    zone: 4, step: 22, title: "L'Ombre du Colosse",
    text: "Le Pilier Djed est entre vos mains. Alors que vous contournez le sarcophage pour chercher la sortie, une ombre immense se profile : une statue de pharaon assis, haute de cinq mètres, garde la porte finale. Ses yeux luisent d'une lueur ambre menaçante.",
    image: "assets/images/scenes/runes_02.webp",
    ambience: "murmures_runiques",
    choices: [
      { text: "S'approcher de la sortie gardée", next: "porte_gardiens", icon: "arrow", primary: true }
    ]
  },
  "porte_gardiens": {
    zone: 4, step: 23, title: "La Porte du Gardien",
    text: "Le colosse de pierre semble vous fixer. Au pied de la statue, des montagnes de pièces d'or et d'objets rituels jonchent le sol. Le Gardien gronde dès que vous faites un pas vers la porte.",
    hint: "Fouillez d'abord le trésor pour trouver le Miroir de Bronze, puis braquez son reflet lumineux directement sur les yeux luisants du colosse.",
    image: "assets/images/scenes/gardien_01.webp",
    ambience: "souffle_tombeau",
    choices: [
      { text: "Fouiller le trésor", action: "fouillerTresor", icon: "search" },
      { text: "Utiliser le miroir contre le Gardien", action: "enigmeGardien", icon: "sun", primary: true }
    ]
  },
  "gardien_vaincu": {
    zone: 4, step: 24, title: "La Corniche de l'Abîme",
    text: "Éblouie, la statue s'est effacée. Vous grimpez un long escalier en colimaçon pour déboucher sur une corniche étroite surplombant un abîme insondable. Au bord du vide, un autel triangulaire en or massif attend les trois clés du royaume.",
    image: "assets/images/scenes/gardien_02.webp",
    ambience: "souffle_tombeau",
    choices: [
      { text: "S'approcher de l'autel d'or", next: "sceau_or", icon: "arrow", primary: true }
    ]
  },
  "sceau_or": {
    zone: 4, step: 25, title: "L'Autel du Sceau d'Or",
    text: "L'autel brille d'un éclat divin. Trois encoches profondes sont prêtes à recevoir les artefacts : l'Ankh (Vie), l'Oudjat (Vision) et le Djed (Stabilité). Un texte sacré indique l'ordre de la Genèse.",
    hint: "Placez les trois clés sacrées dans l'ordre de la Création : 1. Ankh (Vie) · 2. Oudjat (Regard) · 3. Djed (Stabilité).",
    image: "assets/images/scenes/sceau_01.webp",
    ambience: "vent_abime",
    choices: [
      { text: "Déchiffrer l'ordre sacré", action: "donnerIndiceSceau", icon: "scroll" },
      { text: "Placer les artefacts", action: "enigmeSceau", icon: "gem", primary: true }
    ]
  },
  "sceau_resolu": {
    zone: 4, step: 26, title: "Le Pont Déployé",
    text: "Le pont s'est déployé au-dessus du vide. Vous tenez la Bague du Pharaon. Une porte de pierre massive se dresse de l'autre côté, laissant filtrer quelques rayons de soleil par ses interstices.",
    image: "assets/images/scenes/sceau_02.webp",
    ambience: "vent_abime",
    choices: [
      { text: "Traverser le pont de l'abîme", next: "pont_final", icon: "arrow", primary: true }
    ]
  },
  "pont_final": {
    zone: 4, step: 27, title: "L'Ultime Porte du Soleil",
    text: "Le vent s'engouffre dans le couloir. Vous êtes devant l'ultime porte. Un verrou rotatif bloque la sortie. En examinant l'intérieur de la Bague Royale, vous remarquez trois chiffres gravés.",
    hint: "Examinez l'intérieur de la Bague du Pharaon : les trois chiffres gravés forment le code 911.",
    image: "assets/images/scenes/pont_01.webp",
    ambience: "vent_victoire",
    choices: [
      { text: "Examiner la bague", action: "donnerIndiceFinal", icon: "eye" },
      { text: "Entrer le code de sortie", action: "enigmeFinal", icon: "key", primary: true }
    ]
  },
  "victoire": {
    zone: 4, step: 28, title: "Lever de Soleil sur Gizeh",
    text: "Vous l'avez fait ! L'air frais du désert emplit vos poumons alors que le soleil se lève sur Gizeh. Votre nom rejoint celui des plus grands archéologues de l'histoire.",
    image: "assets/images/scenes/victoire_01.webp",
    ambience: "victoire_finale",
    choices: [
      { text: "Consulter la Liste des Archéologues", action: "afficherHallOfFame", icon: "award", primary: true },
      { text: "Recommencer l'aventure", action: "demandeRejouer", icon: "arrow" }
    ]
  }
};
