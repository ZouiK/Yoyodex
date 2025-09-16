// Données des clans – étendez selon vos besoins
const clansData = {
    uchiha: {
        key: 'uchiha',
        name: 'Clan Uchiha',
        quote: '???',
        village: '???',
        specialty: '???',
        members: '???',
        bio: '???',
        portrait: 'img/uchiha.webp',
        emblem: 'img/solve_logo.png'
    },
    senju: {
        key: 'senju',
        name: 'Clan Senju',
        quote: '???',
        village: '???',
        specialty: '???',
        members: '???',
        bio: '???',
        portrait: 'img/senju.webp',
        emblem: 'img/solve_logo.png'
    },
    hyuga: {
        key: 'hyuga',
        name: 'Clan Hyūga',
        quote: '???',
        village: '???',
        specialty: '???',
        members: '???',
        bio: '???',
        portrait: 'img/hyuga.webp',
        emblem: 'img/solve_logo.png'
    },
    uzumaki: {
        key: 'uzumaki',
        name: 'Clan Uzumaki',
        quote: '???',
        village: '???',
        specialty: '???',
        members: '???',
        bio: '???',
        portrait: 'img/uzumaki.webp',
        emblem: 'img/solve_logo.png'
    },
    fuma: {
        key: 'fuma',
        name: 'Clan Fūma',
        quote: '???',
        village: '???',
        specialty: '???',
        members: '???',
        bio: '???',
        portrait: 'img/fuma.webp',
        emblem: 'img/solve_logo.png'
    }
};

function loadClan() {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('clan');
    const clan = clansData[key];
    if (!clan) return;

    document.getElementById('clanName').textContent = clan.name;
    document.getElementById('clanQuote').textContent = clan.quote;
    document.getElementById('villageField').textContent = clan.village;
    document.getElementById('specialtyField').textContent = clan.specialty;
    document.getElementById('membersField').textContent = clan.members;
    document.getElementById('bioText').textContent = clan.bio;
    document.getElementById('portraitImg').src = clan.portrait;
    document.getElementById('emblemImg').src = clan.emblem;

    // Chargement des membres du clan
    loadClanMembers(key);
}

function loadClanMembers(clanKey) {
    const membersGrid = document.getElementById('membersGrid');
    if (!membersGrid) return;

    // Filtrer les personnages qui appartiennent à ce clan
    const clanMembers = Object.values(charactersData).filter(char => 
        char.clan && char.clan.toLowerCase() === clanKey
    );

    membersGrid.innerHTML = '';

    if (clanMembers.length === 0) {
        membersGrid.innerHTML = '<p class="no-members">Aucun membre enregistré pour le moment.</p>';
        return;
    }

    clanMembers.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'character-card member-card';
        memberCard.setAttribute('data-name', member.key);
        
        memberCard.innerHTML = `
            <div class="character-image">
                <img src="${member.portrait}" alt="${member.name}" loading="lazy">
            </div>
            <div class="character-info">
                <h3>${member.name}</h3>
                <p class="character-title">${member.grade}</p>
            </div>
        `;

        memberCard.addEventListener('click', function() {
            window.location.href = `character-detail.html?character=${member.key}`;
        });

        membersGrid.appendChild(memberCard);
    });
}

// Données des personnages (copiées depuis character-detail.js pour la compatibilité)
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
        portrait: 'img/wallace_uchiha.webp',
        emblem: 'img/solve_logo.png'
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
        portrait: 'img/gromit_uzumaki.webp',
        emblem: 'img/solve_logo.png'
    },
    hutch: {
        key:'hutch',
        name: 'Hutch Fūma',
        quote: '« Le vent porte nos lames vers la victoire. »',
        village: 'Otogakure',
        grade: 'Jonin',
        specialty: 'Techniques de vent et armes de jet',
        relations: 'Clan Fūma',
        kekkei: '???',
        clan: 'Fūma',
        clanLink: 'clan-detail.html?clan=fuma',
        bio: `Hutch est un shinobi originaire de l'univers de Wallace et Gromit, ayant migré vers le monde ninja. Membre du clan Fūma d'Otogakure, il a développé une maîtrise exceptionnelle des techniques de vent et des armes de jet. Son expertise dans la manipulation du chakra de type vent lui permet de contrôler la trajectoire de ses projectiles avec une précision mortelle.

Formé dans les arts secrets du clan Fūma, il maîtrise parfaitement l'utilisation des shuriken géants et des techniques de vent avancées. Sa capacité à créer des courants d'air puissants lui permet de dévier les attaques ennemies et de renforcer la puissance de ses propres techniques.

En tant que ninja d'Otogakure, il a développé une approche tactique basée sur la mobilité et la précision. Ses missions l'ont mené dans de nombreux conflits où sa maîtrise des techniques de vent s'est révélée décisive pour la victoire de son village.`,
        portrait: 'img/hutch.webp',
        emblem: 'img/solve_logo.png'
    }
};

document.addEventListener('DOMContentLoaded', loadClan);
