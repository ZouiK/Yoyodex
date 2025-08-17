// Données de démonstration pour Kekkei Genkai – étendez selon vos besoins
const kekkeiData = {
    // Exemple de structure. Ajoutez vos propres entrées ici.
    sharingan: {
        key: 'sharingan',
        name: 'Sharingan',
        subtitle: 'Dōjutsu • Affinité non élémentaire',
        rarity: 'Rare',
        type: 'Dōjutsu',
        clan: 'Uchiha',
        clanLink: 'clan-detail.html?clan=uchiha',
        description: `Dōjutsu héréditaire du clan Uchiha. Il confère une perception avancée, la copie de techniques, et des évolutions puissantes.`,
        portrait: 'img/kekkei_genkai/sharingan.png',
        emblem: 'img/solve logo.png'
    },
    mokuton: {
        key: 'mokuton',
        name: 'Mokuton',
        subtitle: 'Combinaison des éléments Terre et Eau',
        rarity: 'Légendaire',
        type: 'Élément combiné',
        clan: 'Senju',
        clanLink: 'clan-detail.html?clan=senju',
        description: `Le Mokuton permet de créer et manipuler le bois. Utilisé par Hashirama Senju, il peut modeler le terrain et retenir des bêtes à queues.`,
        portrait: 'img/kekkei_genkai/mokuton.png',
        emblem: 'img/solve logo.png'
    }
};

function slugify(str) {
    return (str || '')
        .toString()
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function loadKekkei() {
    const params = new URLSearchParams(window.location.search);
    let key = params.get('kekkei');

    const nameEl = document.getElementById('kekkeiName');
    const subEl = document.getElementById('kekkeiSubtitle');
    const rarityEl = document.getElementById('rarityField');
    const typeEl = document.getElementById('typeField');
    const clanBlockEl = document.getElementById('clanBlock');
    const clanEl = document.getElementById('clanField');
    const descEl = document.getElementById('descriptionText');
    const portraitEl = document.getElementById('portraitImg');
    const emblemEl = document.getElementById('emblemImg');

    if (!key) { return; }

    // normaliser la clé reçue
    const normalized = slugify(key);

    // Première tentative: accès direct par clé telle quelle (compat)
    let k = kekkeiData[key.toLowerCase().trim()];

    // Deuxième tentative: utiliser la version slugifiée
    if (!k) {
        k = kekkeiData[normalized];
    }

    if (!k) { return; }

    // Mettre à jour le titre de la page
    document.title = `${k.name} – Fiche RP`;

    if (nameEl) nameEl.textContent = k.name;
    if (subEl) subEl.textContent = k.subtitle || '';
    if (rarityEl) rarityEl.textContent = k.rarity || '-';
    if (typeEl) typeEl.textContent = k.type || '-';

    if (k.clan) {
        if (k.clanLink && clanEl) {
            clanEl.innerHTML = `<a href="${k.clanLink}" class="clan-link">${k.clan}</a>`;
        } else if (clanEl) {
            clanEl.textContent = k.clan;
        }
        if (clanBlockEl) clanBlockEl.style.display = 'block';
    } else if (clanBlockEl) {
        clanBlockEl.style.display = 'none';
    }

    if (descEl) descEl.textContent = k.description || '';

    if (portraitEl) {
        portraitEl.src = k.portrait || 'https://via.placeholder.com/400x600/444/ffffff?text=Kekkei+Genkai';
        portraitEl.onerror = function() {
            this.src = 'https://via.placeholder.com/400x600/444/ffffff?text=Kekkei+Genkai';
        };
    }

    if (emblemEl) {
        emblemEl.src = k.emblem || 'https://via.placeholder.com/120x120/666/ffffff?text=Clan';
        emblemEl.onerror = function() {
            this.src = 'https://via.placeholder.com/120x120/666/ffffff?text=Clan';
        };
    }
}

document.addEventListener('DOMContentLoaded', loadKekkei);
