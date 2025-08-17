// Données de démonstration – étendez selon vos besoins
const charactersData = {
    wallace_uchiha: {
        key:'wallace_uchiha',
        name: 'Wallace Uchiha',
        quote: '« Une invention par jour éloigne l\'ennui pour toujours ! »',
        village: 'Konohagakure',
        grade: 'Inventeur',
        specialty: 'Génie mécanique',
        relations: 'Gromit (partenaire)',
        kekkei: '???',
        clan: 'Uchiha',
        clanLink: 'clan-detail.html?clan=uchiha',
        bio: `Inventeur de génie passionné par le fromage, Wallace Uchiha parcourt le monde ninja pour perfectionner ses machines les plus farfelues. Son héritage Uchiha lui confère un potentiel immense, même s'il préfère se concentrer sur ses inventions plutôt que sur les techniques de combat traditionnelles.`,
        portrait: 'img/wallace_uchiha.jpg',
        emblem: 'img/solve logo.png'
    },
    gromit_uzumaki: {
        key:'gromit_uzumaki',
        name: 'Gromit Uzumaki',
        quote: '« … »',
        village: 'Konohagakure',
        grade: 'Chien Ninja',
        specialty: 'Analyse tactique',
        relations: 'Wallace Uchiha (partenaire)',
        kekkei: '???',
        clan: 'Uzumaki',
        clanLink: 'clan-detail.html?clan=uzumaki',
        bio: `Compagnon silencieux mais brillant, Gromit protège Wallace Uchiha et élabore souvent les plans qui sauvent la mise. Sa loyauté envers son maître est absolue, et ses capacités tactiques compensent largement son manque de parole.`,
        portrait: 'img/gromit_uzumaki.jpg',
        emblem: 'img/solve logo.png'
    },
    hutch: {
        key:'hutch',
        name: 'Hutch Fūma',
        quote: '« Le vent porte nos lames vers la victoire. »',
        village: 'Otogakure',
        grade: 'Jōnin',
        specialty: 'Techniques de vent et armes de jet',
        relations: 'Clan Fūma',
        kekkei: '???',
        clan: 'Fūma',
        clanLink: 'clan-detail.html?clan=fuma',
        bio: `Hutch est un shinobi originaire de l'univers de Wallace et Gromit, ayant migré vers le monde ninja. Membre du clan Fūma d'Otogakure, il a développé une maîtrise exceptionnelle des techniques de vent et des armes de jet. Son expertise dans la manipulation du chakra de type vent lui permet de contrôler la trajectoire de ses projectiles avec une précision mortelle.

Formé dans les arts secrets du clan Fūma, il maîtrise parfaitement l'utilisation des shuriken géants et des techniques de vent avancées. Sa capacité à créer des courants d'air puissants lui permet de dévier les attaques ennemies et de renforcer la puissance de ses propres techniques.

En tant que ninja d'Otogakure, il a développé une approche tactique basée sur la mobilité et la précision. Ses missions l'ont mené dans de nombreux conflits où sa maîtrise des techniques de vent s'est révélée décisive pour la victoire de son village.`,
        portrait: 'img/hutch.png',
        emblem: 'img/solve logo.png'
    },

};



function loadCharacter() {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('character');
    const char = charactersData[key];
    if (!char) return;

    document.getElementById('characterName').textContent = char.name;
    document.getElementById('characterQuote').textContent = char.quote;
    document.getElementById('villageField').textContent = char.village;
    document.getElementById('gradeField').textContent = char.grade;
    document.getElementById('kekkeiField').textContent = char.kekkei || '???';

    // Clan affiché seulement si présent
    const clanBlock = document.getElementById('clanBlock');
    if (char.clan) {
        if (char.clanLink) {
            // Si un lien de clan est spécifié, rendre le clan cliquable
            document.getElementById('clanField').innerHTML = `<a href="${char.clanLink}" class="clan-link">${char.clan}</a>`;
        } else {
            document.getElementById('clanField').textContent = char.clan;
        }
        clanBlock.style.display = 'block';
    } else {
        clanBlock.style.display = 'none';
    }

    document.getElementById('bioText').textContent = char.bio;
    document.getElementById('portraitImg').src = char.portrait;
    document.getElementById('emblemImg').src = char.emblem;


}

document.addEventListener('DOMContentLoaded', loadCharacter);
