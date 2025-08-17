// Données des clans
const clansData = {
    uchiha: {
        name: 'Clan Uchiha',
        quote: '« ... »',
        village: '???',
        specialty: '???',
        members: '???',
        membersLinks: [
            {name: 'Wallace Uchiha', key: 'wallace_uchiha'}
        ],
        bio: `...`,
        portrait: 'img/uchiha.png',
        emblem: 'img/solve logo.png'
    },
    senju: {
        name: 'Clan Senju',
        quote: '« ... »',
        village: '???',
        specialty: '???',
        members: '???',
        bio: `...`,
        portrait: 'img/senju.png',
        emblem: 'img/solve logo.png'
    },
    hyuga: {
        name: 'Clan Hyūga',
        quote: '« ... »',
        village: '???',
        specialty: '???',
        members: '???',
        bio: `...`,
        portrait: 'img/hyuga.png',
        emblem: 'img/solve logo.png'
    },
    uzumaki: {
        name: 'Clan Uzumaki',
        quote: '« ... »',
        village: '???',
        specialty: '???',
        members: '???',
        membersLinks: [
            {name: 'Gromit Uzumaki', key: 'gromit_uzumaki'}
        ],
        bio: `...`,
        portrait: 'img/uzumaki.jpg',
        emblem: 'img/solve logo.png'
    },
    fuma: {
        name: 'Clan Fūma',
        quote: '« ... »',
        village: '???',
        specialty: '???',
        members: 'Hutch Fūma',
        membersLinks: [
            {name: 'Hutch Fūma', key: 'hutch'}
        ],
        bio: `...`,
        portrait: 'img/fuma.png',
        emblem: 'img/solve logo.png'
    }
};



function loadClan() {
    const params = new URLSearchParams(window.location.search);
    let key = params.get('clan');
    console.log('Clan key:', key); // Debug
    
    if(!key){ 
        console.log('No clan key found, redirecting...'); // Debug
        window.location.href='index.html?tab=clans'; 
        return; 
    }
    
    key = key.toLowerCase().trim();
    const clan = clansData[key];
    console.log('Clan data:', clan); // Debug
    
    if (!clan) { 
        console.log('Clan not found, redirecting...'); // Debug
        window.location.href='index.html?tab=clans'; 
        return;
    }

    // Mettre à jour le titre de la page
    document.title = `${clan.name} – Fiche RP`;

    // Remplir les informations du clan
    const clanNameEl = document.getElementById('clanName');
    const clanQuoteEl = document.getElementById('clanQuote');
    const villageFieldEl = document.getElementById('villageField');
    const specialtyFieldEl = document.getElementById('specialtyField');
    const membersFieldEl = document.getElementById('membersField');
    const bioTextEl = document.getElementById('bioText');
    const portraitImgEl = document.getElementById('portraitImg');
    const emblemImgEl = document.getElementById('emblemImg');



    if (clanNameEl) clanNameEl.textContent = clan.name;
    if (clanQuoteEl) clanQuoteEl.textContent = clan.quote;
    if (villageFieldEl) {
        console.log('Setting village to:', clan.village); // Debug
        villageFieldEl.textContent = clan.village;
    }
    if (specialtyFieldEl) specialtyFieldEl.textContent = clan.specialty;
    if (membersFieldEl) {
        if (clan.membersLinks && clan.membersLinks.length > 0) {
            // Créer des liens cliquables pour chaque membre
            const memberLinks = clan.membersLinks.map(member => {
                return `<a href="character-detail.html?character=${member.key}" class="member-link">${member.name}</a>`;
            }).join(', ');
            membersFieldEl.innerHTML = memberLinks;
        } else {
            membersFieldEl.textContent = clan.members;
        }
    }
    if (bioTextEl) bioTextEl.textContent = clan.bio;
    
    // Charger les images avec gestion d'erreur
    if (portraitImgEl) {
        portraitImgEl.src = clan.portrait;
        portraitImgEl.onerror = function() {
            this.src = 'https://via.placeholder.com/400x600/444/ffffff?text=Portrait+Clan';
        };
    }
    
    if (emblemImgEl) {
        emblemImgEl.src = clan.emblem;
        emblemImgEl.onerror = function() {
            this.src = 'https://via.placeholder.com/120x120/666/ffffff?text=Emblem';
        };
    }

    // Peupler la liste des membres
    populateMembers(key);


}

// Générer la liste des membres du clan
const clanMembersList = {
    uchiha: [
        {key:'wallace_uchiha', name:'Wallace Uchiha', title:'Inventeur', desc:'Inventeur de génie passionné par le fromage.', img:'img/wallace_uchiha.jpg'}
    ],
    senju: [
        // Aucun membre créé pour le moment
    ],
    hyuga: [
        // Aucun membre créé pour le moment
    ],
    uzumaki: [
        {key:'gromit_uzumaki', name:'Gromit Uzumaki', title:'Chien Ninja', desc:'Chien fidèle et tacticien.', img:'img/gromit_uzumaki.jpg'}
    ],
    fuma: [
        {key:'hutch', name:'Hutch Fūma', title:'Maître des Vents', desc:'Shinobi d\'Otogakure, expert en techniques de vent et armes de jet.', img:'img/hutch.png'}
    ]
};

function populateMembers(clanKey) {
    console.log('Populating members for clan:', clanKey); // Debug
    
    const grid = document.getElementById('membersGrid');
    if (!grid) {
        console.error('Members grid not found!'); // Debug
        return;
    }
    
    grid.innerHTML = '';
    const list = clanMembersList[clanKey] || [];
    console.log('Members list:', list); // Debug
    
    list.forEach(member => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.setAttribute('data-name', member.key);
        card.innerHTML = `
            <div class="character-image">
                <img src="${member.img}" alt="${member.name}" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x400/555/ffffff?text=${encodeURIComponent(member.name)}'">
            </div>
            <div class="character-info">
                <h3>${member.name}</h3>
                <p class="character-title">${member.title}</p>
                <p class="character-description">${member.desc}</p>
            </div>`;
        
        card.addEventListener('click',()=>{
            // Vérifier si le personnage existe dans les données
            if (member.key === 'wallace_uchiha' || member.key === 'gromit_uzumaki' || member.key === 'hutch') {
                window.location.href = `character-detail.html?character=${member.key}`;
            } else {
                // Pour les personnages qui n'ont pas encore de page de détail
                alert('Page de détail en cours de création pour ce personnage.');
            }
        });
        
        grid.appendChild(card);
    });
    
    console.log(`Added ${list.length} members to grid`); // Debug
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Clan detail page loaded'); // Debug
    
    // Test simple pour vérifier que le script fonctionne
    const testElement = document.getElementById('clanName');
    if (testElement) {
        console.log('Test element found:', testElement);
        testElement.textContent = 'TEST - Clan Detail Page Working';
    } else {
        console.error('Test element not found!');
    }
    
    loadClan();
});
 