// Données des Shinobis
const SHINOBI_DATA = [
    {
        id: 1,
        name: "Wallace Uchiha",
        dataName: "wallace_uchiha",
        title: "Inventeur",
        description: "Inventeur génial et amateur de fromage, toujours prêt pour une nouvelle aventure.",
        village: "konoha",
        clan: "uchiha",
        image: "wallace_uchiha.jpg",
        rank: "Chūnin"
    },
    {
        id: 2,
        name: "Gromit Uzumaki",
        dataName: "gromit_uzumaki",
        title: "Chien Intelligent",
        description: "Chien fidèle et intelligent, partenaire inséparable de Wallace dans toutes ses inventions.",
        village: "konoha",
        clan: "uzumaki",
        image: "gromit_uzumaki.jpg",
        rank: "Chūnin"
    },
    {
        id: 3,
        name: "Hutch Fūma",
        dataName: "hutch",
        title: "Maître des Vents",
        description: "Shinobi du clan Fūma d'Otogakure, expert en techniques de vent et armes de jet.",
        village: "oto",
        clan: "fuma",
        image: "hutch.png",
        rank: "Jōnin"
    }
];

// Données des Clans
const CLAN_DATA = [
    {
        id: 1,
        name: "Clan Uchiha",
        dataName: "uchiha",
        title: "Les descendants du Sage",
        description: "Clan légendaire réputé pour son Sharingan et sa maîtrise des techniques de feu.",
        village: "konoha",
        image: "uchiha.png",
        kekkeiGenkai: ["Sharingan", "Mangekyō Sharingan", "Eternal Mangekyō Sharingan"],
        techniques: ["Katon: Goukakyuu no Jutsu", "Susanoo", "Amaterasu"],
        history: "Le clan Uchiha est l'un des clans fondateurs de Konoha, descendant direct du Sage des Six Chemins. Ils sont réputés pour leur Sharingan et leur maîtrise des techniques de feu.",
        members: ["Wallace Uchiha", "Itachi Uchiha", "Sasuke Uchiha"],
        symbol: "Éventail",
        colors: ["Rouge", "Noir"],
        specialAbilities: "Copie de techniques, hypnose, prédiction des mouvements"
    },
    {
        id: 2,
        name: "Clan Senju",
        dataName: "senju",
        title: "Les héritiers de la Volonté du Feu",
        description: "Clan fondateur de Konoha, maîtres de toutes les natures de chakra.",
        village: "konoha",
        image: "senju.png",
        kekkeiGenkai: ["Wood Release"],
        techniques: ["Mokuton: Kajukai Kōrin", "Mokuton: Kajukai Kōrin"],
        history: "Le clan Senju, fondé par Hashirama Senju, est l'un des clans fondateurs de Konoha. Ils sont connus pour leur maîtrise de toutes les natures de chakra et leur Wood Release.",
        members: ["Hashirama Senju", "Tobirama Senju", "Tsunade Senju"],
        symbol: "Spirale",
        colors: ["Vert", "Brun"],
        specialAbilities: "Maîtrise de toutes les natures de chakra, régénération cellulaire"
    },
    {
        id: 3,
        name: "Clan Hyūga",
        dataName: "hyuga",
        title: "Les gardiens du Byakugan",
        description: "Clan noble protégeant le secret du Byakugan et maîtrisant l'art du Jūken.",
        village: "konoha",
        image: "hyuga.png",
        kekkeiGenkai: ["Byakugan"],
        techniques: ["Jūken", "Byakugan", "Kaiten"],
        history: "Le clan Hyūga est un clan noble de Konoha, gardien du Byakugan. Ils sont réputés pour leur art du Jūken et leur vision à 360 degrés.",
        members: ["Hiashi Hyūga", "Hinata Hyūga", "Neji Hyūga"],
        symbol: "Œil",
        colors: ["Blanc", "Bleu"],
        specialAbilities: "Vision à 360 degrés, détection du chakra, art du Jūken"
    },
    {
        id: 4,
        name: "Clan Uzumaki",
        dataName: "uzumaki",
        title: "Les maîtres des sceaux",
        description: "Clan réputé pour ses techniques de sceaux et sa spirale caractéristique.",
        village: "konoha",
        image: "uzumaki.jpg",
        kekkeiGenkai: ["Chakra spécial"],
        techniques: ["Fūinjutsu", "Rasengan", "Mode Kyūbi"],
        history: "Le clan Uzumaki est réputé pour ses techniques de sceaux (Fūinjutsu). Leur symbole, la spirale, représente l'éternité et la continuité.",
        members: ["Gromit Uzumaki", "Naruto Uzumaki", "Kushina Uzumaki"],
        symbol: "Spirale",
        colors: ["Orange", "Rouge"],
        specialAbilities: "Techniques de sceaux, chakra spécial, régénération"
    },
    {
        id: 5,
        name: "Clan Fūma",
        dataName: "fuma",
        title: "Les maîtres des vents",
        description: "Clan d'Otogakure spécialisé dans les techniques de vent et les armes de jet.",
        village: "oto",
        image: "fuma.png",
        kekkeiGenkai: ["Techniques de vent avancées"],
        techniques: ["Fūton: Daitoppa", "Armes de jet", "Techniques de vent"],
        history: "Le clan Fūma d'Otogakure est spécialisé dans les techniques de vent et les armes de jet. Ils sont réputés pour leur précision et leur maîtrise du vent.",
        members: ["Hutch Fūma"],
        symbol: "Vent",
        colors: ["Vert", "Blanc"],
        specialAbilities: "Maîtrise du vent, précision exceptionnelle, armes de jet"
    }
];

// Données des Kekkei Genkai
const KEKKEI_GENKAI_DATA = [
    {
        id: 1,
        name: "Prochainement disponible",
        type: "",
        description: "De nouveaux Kekkei Genkai seront bientôt ajoutés !",
        clan: "",
        image: "",
        rarity: "",
        activation: "",
        abilities: [],
        users: [],
        weaknesses: [],
        strengths: []
    }
];

// Export des données
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SHINOBI_DATA, CLAN_DATA, KEKKEI_GENKAI_DATA };
}
