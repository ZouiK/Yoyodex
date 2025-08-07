// Variables globales
let allCharacters = [];
let allClans = [];
let currentSort = 'village';
let currentTab = 'characters';
let searchTerm = '';

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeCharacters();
    initializeClans();
    setupEventListeners();
    setupAnimations();
    applyFixedGridLayout();
    
    // Initialiser les options de tri pour l'onglet par défaut (characters)
    initializeSortOptions();
});

// Initialiser les options de tri au démarrage
function initializeSortOptions() {
    const rarityOption = document.querySelector('[data-sort="rarity"]');
    const villageOption = document.querySelector('[data-sort="village"]');
    const alphabeticalOption = document.querySelector('[data-sort="alphabetical"]');
    
    // Au démarrage, on est sur l'onglet "characters" par défaut
    // Donc on masque l'option de rareté et on affiche village et alphabétique
    if (rarityOption) rarityOption.style.display = 'none';
    if (villageOption) villageOption.style.display = 'block';
    if (alphabeticalOption) alphabeticalOption.style.display = 'block';
    
    // S'assurer que l'option village est sélectionnée par défaut
    document.querySelectorAll('.sort-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector('[data-sort="village"]').classList.add('selected');
    
    // Mettre à jour le texte affiché
    const sortText = document.querySelector('.sort-text');
    if (sortText) {
        sortText.textContent = 'TRIER PAR : VILLAGE';
    }
}

// Appliquer la mise en page avec grille fixe
function applyFixedGridLayout() {
    // Appliquer aux grilles de villages et clans
    const villageGrids = document.querySelectorAll('.characters-grid');
    villageGrids.forEach(grid => {
        grid.classList.add('fixed-grid');
    });
    
    // Appliquer à la grille alphabétique
    const alphabeticalGrid = document.getElementById('alphabeticalGrid');
    if (alphabeticalGrid) {
        alphabeticalGrid.classList.add('fixed-grid');
    }
}

// Initialiser la liste des personnages
function initializeCharacters() {
    // Réinitialiser le tableau des personnages
    allCharacters = [];
    
    // Sélectionner les cartes de personnages (possèdent data-village mais ne sont pas des cartes de clan)
    const characterCards = document.querySelectorAll('.character-card[data-village]:not(.clan-card)');
    
    characterCards.forEach(card => {
        const characterName = card.querySelector('h3').textContent;
        const dataName = card.getAttribute('data-name');
        
        const character = {
            element: card,
            name: characterName.toLowerCase(),
            displayName: characterName,
            title: card.querySelector('.character-title').textContent,
            description: card.querySelector('.character-description').textContent,
            image: '', // Sera mis à jour automatiquement
            village: card.getAttribute('data-village'),
            clan: card.getAttribute('data-clan') || null,
            dataName: dataName
        };
        
        // Charger automatiquement l'image avec fallback
        const imgElement = card.querySelector('img');
        if (imgElement) {
            loadCharacterImage(characterName, dataName, imgElement, character);
        }
        
        allCharacters.push(character);
    });
}

// Initialiser la liste des clans
function initializeClans() {
    // Réinitialiser le tableau des clans
    allClans = [];
    
    // Sélectionner seulement les cartes de clans (elles possèdent l'attribut data-clan ET la classe clan-card)
    const clanCards = document.querySelectorAll('.character-card[data-clan].clan-card');
    
    clanCards.forEach(card => {
        const clanName = card.querySelector('h3').textContent;
        const dataName = card.getAttribute('data-name');
        const village = card.getAttribute('data-village') || 'unknown';
        
        const clan = {
            element: card,
            name: clanName.toLowerCase(),
            displayName: clanName,
            title: card.querySelector('.character-title').textContent,
            description: card.querySelector('.character-description').textContent,
            image: '', // Sera mis à jour automatiquement
            clan: card.getAttribute('data-clan'),
            village: village,
            dataName: dataName
        };
        
        // Charger automatiquement l'image avec fallback
        const imgElement = card.querySelector('img');
        if (imgElement) {
            loadCharacterImage(clanName, dataName, imgElement, clan);
        }
        
        allClans.push(clan);
    });
}

// Fonction améliorée pour charger automatiquement les images
function loadCharacterImage(characterName, dataName, imgElement, character) {
    // Normaliser le nom en supprimant les accents et caractères spéciaux
    const normalizeName = (name) => {
        return name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
            .replace(/\s+/g, '_') // Remplacer les espaces par des underscores
            .replace(/[^a-z0-9_]/g, '') // Garder seulement lettres, chiffres et underscores
            .trim();
    };
    
    const baseName = dataName || normalizeName(characterName);
    const extensions = ['png', 'jpg', 'jpeg', 'webp'];
    
    // Essayer chaque extension dans l'ordre
    function tryNextExtension(index) {
        if (index >= extensions.length) {
            // Aucune image trouvée, utiliser un placeholder
            const placeholderUrl = `https://via.placeholder.com/300x400/666666/ffffff?text=${encodeURIComponent(characterName)}`;
            imgElement.src = placeholderUrl;
            character.image = placeholderUrl;
            return;
        }
        
        const imagePath = `img/${baseName}.${extensions[index]}`;
        const testImg = new Image();
        
        testImg.onload = function() {
            // Image trouvée !
            imgElement.src = imagePath;
            imgElement.alt = characterName;
            character.image = imagePath;
        };
        
        testImg.onerror = function() {
            // Essayer l'extension suivante
            tryNextExtension(index + 1);
        };
        
        testImg.src = imagePath;
    }
    
    // Commencer avec la première extension
    tryNextExtension(0);
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // Améliorer l'interaction avec la zone de recherche
    const searchSection = document.querySelector('.search-section');
    searchSection.addEventListener('click', function(e) {
        if (e.target !== searchInput) {
            searchInput.focus();
        }
    });
    
    // Nouveau menu déroulant de tri
    const sortTrigger = document.getElementById('sortTrigger');
    const sortDropdown = document.getElementById('sortDropdown');
    const sortOptions = document.querySelectorAll('.sort-option');
    
    // Ouvrir/fermer le menu déroulant
    sortTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleSortDropdown();
    });
    
    // Gérer les clics sur les options
    sortOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const sortType = this.getAttribute('data-sort');
            selectSortOption(sortType);
        });
    });
    
    // Fermer le menu en cliquant ailleurs
    document.addEventListener('click', function(e) {
        if (!sortDropdown.contains(e.target)) {
            closeSortDropdown();
        }
    });
    
    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeSortDropdown();
        }
    });
    
    // Navigation par onglets
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Clic sur les cartes de personnages et clans
    document.addEventListener('click', function(e) {
        if (e.target.closest('.character-card') || e.target.closest('.alphabetical-character-card') || e.target.closest('.clans-alphabetical-character-card')) {
            const card = e.target.closest('.character-card') || e.target.closest('.alphabetical-character-card');
            handleCharacterClick(card);
        }
    });
}

// Gérer la recherche
function handleSearch(e) {
    searchTerm = e.target.value.toLowerCase();
    if (currentTab === 'characters') {
        filterAndDisplayCharacters();
    } else if (currentTab === 'clans') {
        filterAndDisplayClans();
    } else if (tab === 'kekkei') {
        currentTab = 'kekkei';
        if (document.getElementById('kekkeiMode')) {
            document.getElementById('kekkeiMode').style.display = 'block';
        }
        document.getElementById('charactersMode').style.display = 'none';
        document.getElementById('alphabeticalMode').style.display = 'none';
        document.getElementById('clansMode').style.display = 'none';
        const clansAlphabeticalMode2 = document.getElementById('clansAlphabeticalMode');
        if (clansAlphabeticalMode2) clansAlphabeticalMode2.style.display = 'none';
        const searchInput2 = document.getElementById('searchInput');
        if (searchInput2) searchInput2.placeholder = 'TROUVER UN KEKKEI GENKAI';
        const villageOption = document.querySelector('[data-sort="village"]');
        if (villageOption) villageOption.style.display = 'none';
        document.querySelector('[data-sort="alphabetical"]').style.display = 'block';
        document.querySelector('[data-sort="rarity"]').style.display = 'block';
        selectSortOption('alphabetical');
    }
}

// Fonctions pour le menu déroulant
function toggleSortDropdown() {
    const sortDropdown = document.getElementById('sortDropdown');
    const sortTrigger = document.getElementById('sortTrigger');
    
    if (sortDropdown.classList.contains('active')) {
        closeSortDropdown();
    } else {
        openSortDropdown();
    }
}

function openSortDropdown() {
    const sortDropdown = document.getElementById('sortDropdown');
    const sortTrigger = document.getElementById('sortTrigger');
    
    sortDropdown.classList.add('active');
    sortTrigger.classList.add('active');
}

function closeSortDropdown() {
    const sortDropdown = document.getElementById('sortDropdown');
    const sortTrigger = document.getElementById('sortTrigger');
    
    sortDropdown.classList.remove('active');
    sortTrigger.classList.remove('active');
}

function selectSortOption(sortType) {
    // Mettre à jour l'option sélectionnée
    document.querySelectorAll('.sort-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[data-sort="${sortType}"]`).classList.add('selected');
    
    // Mettre à jour le texte affiché
    const sortText = document.querySelector('.sort-text');
    const sortLabels = {
        'village': 'VILLAGE',
        'alphabetical': 'A-Z',
        'rarity': 'RARETÉ'
    };
    sortText.textContent = `TRIER PAR : ${sortLabels[sortType]}`;
    
    // Mettre à jour le tri actuel
    currentSort = sortType;
    
    // Fermer le menu
    closeSortDropdown();
    
    // Appliquer le tri
    if (currentTab === 'characters') {
        // Pour les personnages, seules les options village et alphabétique sont autorisées
        if (currentSort === 'village') {
            showVillageMode();
        } else if (currentSort === 'alphabetical') {
            showAlphabeticalMode();
        } else if (currentSort === 'rarity') {
            // Si par erreur on essaie de trier par rareté, revenir au tri par village
            currentSort = 'village';
            selectSortOption('village');
            return;
        }
        filterAndDisplayCharacters();
    } else if (currentTab === 'clans') {
        if (currentSort === 'village') {
            showClansVillageMode();
        } else if (currentSort === 'alphabetical') {
            showClansAlphabeticalMode();
        } else if (currentSort === 'rarity') {
            // Si par erreur on essaie de trier par rareté, revenir au tri par village
            currentSort = 'village';
            selectSortOption('village');
            return;
        }
        filterAndDisplayClans();
    } else if (currentTab === 'kekkei') {
        // Pour kekkei genkai, gérer le tri par rareté
        if (document.getElementById('kekkeiMode')) {
            document.getElementById('kekkeiMode').style.display = 'block';
        }
        document.getElementById('charactersMode').style.display = 'none';
        document.getElementById('alphabeticalMode').style.display = 'none';
        document.getElementById('clansMode').style.display = 'none';
        const clansAlphabeticalMode2 = document.getElementById('clansAlphabeticalMode');
        if (clansAlphabeticalMode2) clansAlphabeticalMode2.style.display = 'none';
        const searchInput2 = document.getElementById('searchInput');
        if (searchInput2) searchInput2.placeholder = 'TROUVER UN KEKKEI GENKAI';
        // Le tri par rareté sera géré spécifiquement pour kekkei genkai
    }
}

// Fonction pour changer d'onglet
function switchTab(tab) {
    // Mettre à jour l'onglet actif
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Mettre à jour le placeholder de recherche
    const searchInput = document.getElementById('searchInput');
    if (tab === 'characters') {
        searchInput.placeholder = 'TROUVER UN PERSONNAGE';
    } else if (tab === 'clans') {
        searchInput.placeholder = 'TROUVER UN CLAN';
    }

    // Ajuster le menu de tri selon l'onglet
    const rarityOption = document.querySelector('[data-sort="rarity"]');
    const villageOption = document.querySelector('[data-sort="village"]');
    const alphabeticalOption = document.querySelector('[data-sort="alphabetical"]');
    
    if (tab === 'characters') {
        // Pour les personnages : afficher village et alphabétique, masquer rareté
        if (rarityOption) rarityOption.style.display = 'none';
        if (villageOption) villageOption.style.display = 'block';
        if (alphabeticalOption) alphabeticalOption.style.display = 'block';
        // Si on était sur rareté, revenir au tri par village
        if (currentSort === 'rarity') {
            currentSort = 'village';
            // Mettre à jour l'affichage sans appeler selectSortOption pour éviter la récursion
            document.querySelectorAll('.sort-option').forEach(option => {
                option.classList.remove('selected');
            });
            document.querySelector('[data-sort="village"]').classList.add('selected');
            const sortText = document.querySelector('.sort-text');
            sortText.textContent = 'TRIER PAR : VILLAGE';
        }
    } else if (tab === 'clans') {
        // Pour les clans : afficher village et alphabétique, masquer rareté
        if (rarityOption) rarityOption.style.display = 'none';
        if (villageOption) villageOption.style.display = 'block';
        if (alphabeticalOption) alphabeticalOption.style.display = 'block';
        // Si on était sur rareté, revenir au tri par village
        if (currentSort === 'rarity') {
            currentSort = 'village';
            // Mettre à jour l'affichage sans appeler selectSortOption pour éviter la récursion
            document.querySelectorAll('.sort-option').forEach(option => {
                option.classList.remove('selected');
            });
            document.querySelector('[data-sort="village"]').classList.add('selected');
            const sortText = document.querySelector('.sort-text');
            sortText.textContent = 'TRIER PAR : VILLAGE';
        }
    } else if (tab === 'kekkei') {
        // Pour kekkei genkai : afficher alphabétique et rareté, masquer village
        if (rarityOption) rarityOption.style.display = 'block';
        if (villageOption) villageOption.style.display = 'none';
        if (alphabeticalOption) alphabeticalOption.style.display = 'block';
    }

    // Masquer tous les modes
    document.getElementById('charactersMode').style.display = 'none';
    document.getElementById('alphabeticalMode').style.display = 'none';
    document.getElementById('clansMode').style.display = 'none';
    const kekkeiMode = document.getElementById('kekkeiMode');
    if (kekkeiMode) kekkeiMode.style.display = 'none';
    
    // Masquer le mode alphabétique des clans s'il existe
    const clansAlphabeticalMode = document.getElementById('clansAlphabeticalMode');
    if (clansAlphabeticalMode) {
        clansAlphabeticalMode.style.display = 'none';
    }
    
    // Afficher le mode approprié
    if (tab === 'characters') {
        currentTab = 'characters';
        if (currentSort === 'village') {
            showVillageMode();
        } else {
            showAlphabeticalMode();
        }
        filterAndDisplayCharacters();
    } else if (tab === 'clans') {
        currentTab = 'clans';
        if (currentSort === 'village') {
            showClansVillageMode();
        } else {
            showClansAlphabeticalMode();
        }
        filterAndDisplayClans();
    } else if (tab === 'kekkei') {
        currentTab = 'kekkei';
        if (document.getElementById('kekkeiMode')) {
            document.getElementById('kekkeiMode').style.display = 'block';
        }
        document.getElementById('charactersMode').style.display = 'none';
        document.getElementById('alphabeticalMode').style.display = 'none';
        document.getElementById('clansMode').style.display = 'none';
        const clansAlphabeticalMode2 = document.getElementById('clansAlphabeticalMode');
        if (clansAlphabeticalMode2) clansAlphabeticalMode2.style.display = 'none';
        const searchInput2 = document.getElementById('searchInput');
        if (searchInput2) searchInput2.placeholder = 'TROUVER UN KEKKEI GENKAI';
        const villageOption = document.querySelector('[data-sort="village"]');
        if (villageOption) villageOption.style.display = 'none';
        document.querySelector('[data-sort="alphabetical"]').style.display = 'block';
        document.querySelector('[data-sort="rarity"]').style.display = 'block';
        selectSortOption('alphabetical');
    }
}

// Afficher le mode village
function showVillageMode() {
    document.getElementById('charactersMode').style.display = 'block';
    document.getElementById('alphabeticalMode').style.display = 'none';
    
    // Masquer complètement le mode clans
    document.getElementById('clansMode').style.display = 'none';
    
    // Masquer le mode alphabétique des clans s'il existe
    const clansAlphabeticalMode = document.getElementById('clansAlphabeticalMode');
    if (clansAlphabeticalMode) {
        clansAlphabeticalMode.style.display = 'none';
    }
}

// Afficher le mode alphabétique
function showAlphabeticalMode() {
    document.getElementById('charactersMode').style.display = 'none';
    document.getElementById('alphabeticalMode').style.display = 'block';
    
    // Masquer complètement le mode clans
    document.getElementById('clansMode').style.display = 'none';
    
    // Masquer le mode alphabétique des clans s'il existe
    const clansAlphabeticalMode = document.getElementById('clansAlphabeticalMode');
    if (clansAlphabeticalMode) {
        clansAlphabeticalMode.style.display = 'none';
    }
    
    // Créer la grille alphabétique si elle n'existe pas encore
    if (document.getElementById('alphabeticalGrid').children.length === 0) {
        createAlphabeticalGrid();
    }
    
    // Appliquer la classe fixed-grid
    const alphabeticalGrid = document.getElementById('alphabeticalGrid');
    if (alphabeticalGrid) {
        alphabeticalGrid.classList.add('fixed-grid');
    }
}

// Afficher le mode village pour les clans
function showClansVillageMode() {
    document.getElementById('clansMode').style.display = 'block';
    
    // Masquer complètement les modes personnages
    document.getElementById('charactersMode').style.display = 'none';
    document.getElementById('alphabeticalMode').style.display = 'none';
    
    // Masquer le mode alphabétique des clans s'il existe
    const clansAlphabeticalMode = document.getElementById('clansAlphabeticalMode');
    if (clansAlphabeticalMode) {
        clansAlphabeticalMode.style.display = 'none';
    }
}

// Afficher le mode alphabétique pour les clans
function showClansAlphabeticalMode() {
    // Masquer le mode alphabétique des personnages
    document.getElementById('alphabeticalMode').style.display = 'none';
    
    // Créer la grille alphabétique si elle n'existe pas encore
    if (!document.getElementById('clansAlphabeticalGrid')) {
        createClansAlphabeticalGrid();
    } else {
        // Afficher le mode alphabétique existant
        document.getElementById('clansAlphabeticalMode').style.display = 'block';
        document.getElementById('clansMode').style.display = 'none';
    }
}

// Créer la grille alphabétique
function createAlphabeticalGrid() {
    const alphabeticalGrid = document.getElementById('alphabeticalGrid');
    alphabeticalGrid.innerHTML = '';
    
    // Trier les personnages par ordre alphabétique
    const sortedCharacters = [...allCharacters].sort((a, b) => 
        a.displayName.localeCompare(b.displayName, 'fr')
    );
    
    sortedCharacters.forEach(character => {
        const card = createAlphabeticalCard(character);
        alphabeticalGrid.appendChild(card);
    });
}

// Créer une carte pour le mode alphabétique
function createAlphabeticalCard(character) {
    const card = document.createElement('div');
    card.className = 'alphabetical-character-card';
    card.setAttribute('data-name', character.dataName);
    card.setAttribute('data-village', character.village);
    
    // Utiliser un placeholder temporaire, l'image sera mise à jour après
    const tempImageSrc = `https://via.placeholder.com/300x400/666666/ffffff?text=${encodeURIComponent(character.displayName)}`;
    
    card.innerHTML = `
        <div class="alphabetical-character-image">
            <img src="${tempImageSrc}" alt="${character.displayName}">
        </div>
        <div class="alphabetical-character-info">
            <h3>${character.displayName}</h3>
            <p class="character-title">${character.title}</p>
        </div>
    `;
    
    // Mettre à jour l'image avec le système automatique
    const imgElement = card.querySelector('img');
    if (imgElement) {
        loadCharacterImage(character.displayName, character.dataName, imgElement, character);
    }
    
    return card;
}

// Filtrer et afficher les personnages
function filterAndDisplayCharacters() {
    if (currentSort === 'village') {
        filterVillageMode();
    } else {
        filterAlphabeticalMode();
    }
}

// Filtrer et afficher les clans
function filterAndDisplayClans() {
    if (currentSort === 'village') {
        filterClansVillageMode();
    } else {
        filterClansAlphabeticalMode();
    }
}

// Filtrer en mode village
function filterVillageMode() {
    allCharacters.forEach(character => {
        const matchesSearch = character.name.includes(searchTerm) || 
                             character.title.toLowerCase().includes(searchTerm) ||
                             character.description.toLowerCase().includes(searchTerm);
        
        if (matchesSearch) {
            character.element.style.display = 'block';
            character.element.classList.remove('hidden');
            character.element.classList.add('visible');
        } else {
            character.element.style.display = 'none';
            character.element.classList.add('hidden');
            character.element.classList.remove('visible');
        }
    });
    
    // Masquer les cartes de clans dans le mode personnages
    const clanCards = document.querySelectorAll('.clan-card');
    clanCards.forEach(card => {
        card.style.display = 'none';
    });
    
    // Masquer les sections vides (seulement pour les personnages)
    const villageSections = document.querySelectorAll('#charactersMode .village-section');
    villageSections.forEach(section => {
        const visibleCards = section.querySelectorAll('.character-card[data-village].visible');
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

// Filtrer en mode alphabétique
function filterAlphabeticalMode() {
    // Sélectionner seulement les cartes de personnages (exclure les cartes de clans)
    const alphabeticalCards = document.querySelectorAll('.alphabetical-character-card:not(.clans-alphabetical-character-card)');
    
    alphabeticalCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const title = card.querySelector('.character-title').textContent.toLowerCase();
        
        const matchesSearch = name.includes(searchTerm) || title.includes(searchTerm);
        
        if (matchesSearch) {
            card.style.display = 'block';
            card.classList.remove('hidden');
            card.classList.add('visible');
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
            card.classList.remove('visible');
        }
    });
    
    // S'assurer que les cartes de clans sont masquées dans le mode personnages
    const clanCards = document.querySelectorAll('.clans-alphabetical-character-card');
    clanCards.forEach(card => {
        card.style.display = 'none';
    });
}

// Filtrer en mode village pour les clans
function filterClansVillageMode() {
    allClans.forEach(clan => {
        const matchesSearch = clan.name.includes(searchTerm) || 
                             clan.title.toLowerCase().includes(searchTerm) ||
                             clan.description.toLowerCase().includes(searchTerm);
        
        if (matchesSearch) {
            clan.element.style.display = 'block';
            clan.element.classList.remove('hidden');
            clan.element.classList.add('visible');
        } else {
            clan.element.style.display = 'none';
            clan.element.classList.add('hidden');
            clan.element.classList.remove('visible');
        }
    });
    
    // Masquer les cartes de personnages dans le mode clans
    const characterCards = document.querySelectorAll('.character-card:not(.clan-card)');
    characterCards.forEach(card => {
        card.style.display = 'none';
    });
    
    // Masquer les sections vides (seulement pour les clans)
    const clanSections = document.querySelectorAll('#clansMode .village-section');
    clanSections.forEach(section => {
        const visibleCards = section.querySelectorAll('.character-card[data-clan].visible');
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
}

// Filtrer en mode alphabétique pour les clans
function filterClansAlphabeticalMode() {
    // Créer une grille alphabétique pour les clans si elle n'existe pas
    if (!document.getElementById('clansAlphabeticalGrid')) {
        createClansAlphabeticalGrid();
    }
    
    const alphabeticalCards = document.querySelectorAll('.clans-alphabetical-character-card');
    
    alphabeticalCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const title = card.querySelector('.character-title').textContent.toLowerCase();
        
        const matchesSearch = name.includes(searchTerm) || title.includes(searchTerm);
        
        if (matchesSearch) {
            card.style.display = 'block';
            card.classList.remove('hidden');
            card.classList.add('visible');
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
            card.classList.remove('visible');
        }
    });
}

// Créer la grille alphabétique pour les clans
function createClansAlphabeticalGrid() {
    // Masquer le mode village des clans
    document.getElementById('clansMode').style.display = 'none';
    
    // Créer ou afficher la grille alphabétique des clans
    let clansAlphabeticalMode = document.getElementById('clansAlphabeticalMode');
    if (!clansAlphabeticalMode) {
        clansAlphabeticalMode = document.createElement('div');
        clansAlphabeticalMode.id = 'clansAlphabeticalMode';
        clansAlphabeticalMode.className = 'content-mode';
        
        // Créer la section hero pour les clans
        const heroSection = document.createElement('section');
        heroSection.className = 'hero';
        heroSection.innerHTML = `
            <div class="hero-content">
                <div class="hero-icon">
                    <img src="img/solve logo.png" alt="Rubik's Cube" class="hero-logo">
                </div>
                <h1 class="hero-title">CLANS</h1>
                <div class="hero-lines">
                    <div class="line left-line"></div>
                    <div class="line right-line"></div>
                </div>
            </div>
        `;
        
        // Créer la grille alphabétique
        const alphabeticalGrid = document.createElement('div');
        alphabeticalGrid.id = 'clansAlphabeticalGrid';
        alphabeticalGrid.className = 'alphabetical-grid fixed-grid';
        
        clansAlphabeticalMode.appendChild(heroSection);
        clansAlphabeticalMode.appendChild(alphabeticalGrid);
        
        // Insérer après le mode clans existant
        const clansMode = document.getElementById('clansMode');
        clansMode.parentNode.insertBefore(clansAlphabeticalMode, clansMode.nextSibling);
    }
    
    clansAlphabeticalMode.style.display = 'block';
    
    const alphabeticalGrid = document.getElementById('clansAlphabeticalGrid');
    alphabeticalGrid.innerHTML = '';
    
    // Trier les clans par ordre alphabétique
    const sortedClans = [...allClans].sort((a, b) => 
        a.displayName.localeCompare(b.displayName, 'fr')
    );
    
    sortedClans.forEach(clan => {
        const card = createClansAlphabeticalCard(clan);
        alphabeticalGrid.appendChild(card);
    });
}

// Créer une carte pour le mode alphabétique des clans
function createClansAlphabeticalCard(clan) {
    const card = document.createElement('div');
    card.className = 'alphabetical-character-card clans-alphabetical-character-card';
    card.setAttribute('data-name', clan.dataName);
    card.setAttribute('data-clan', clan.clan);
    card.setAttribute('data-village', clan.village);
    
    // Utiliser un placeholder temporaire, l'image sera mise à jour après
    const tempImageSrc = `https://via.placeholder.com/300x400/666666/ffffff?text=${encodeURIComponent(clan.displayName)}`;
    
    card.innerHTML = `
        <div class="alphabetical-character-image">
            <img src="${tempImageSrc}" alt="${clan.displayName}">
        </div>
        <div class="alphabetical-character-info">
            <h3>${clan.displayName}</h3>
            <p class="character-title">${clan.title}</p>
        </div>
    `;
    
    // Mettre à jour l'image avec le système automatique
    const imgElement = card.querySelector('img');
    if (imgElement) {
        loadCharacterImage(clan.displayName, clan.dataName, imgElement, clan);
    }
    
    return card;
}

// Gérer le clic sur un personnage ou clan
function handleCharacterClick(card) {
    // Effet visuel au clic
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = '';
    }, 150);
    
    // Récupérer les informations du personnage/clan
    const characterName = card.querySelector('h3').textContent;
    const dataName = card.getAttribute('data-name');
    
    console.log(`${currentTab === 'clans' ? 'Clan' : 'Personnage'} cliqué : ${characterName}`);
    
    // Rediriger vers la page appropriée
    if (currentTab === 'clans') {
        // Pour les clans, rediriger vers la page de clan
        window.location.href = `clan-detail.html?clan=${dataName}`;
    } else {
        // Pour les personnages, rediriger vers la nouvelle page
        window.location.href = `character-detail.html?character=${dataName}`;
    }
}

// Configuration des animations
function setupAnimations() {
    // Animation au scroll pour les cartes de personnages
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer toutes les cartes de personnages (exclure les cartes de clans)
    const characterCards = document.querySelectorAll('.character-card:not(.clan-card)');
    characterCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Animation du header au scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Effet hover avancé pour les cartes
    characterCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });


}

// Fonction pour afficher une modal de personnage (style League of Legends)
function showCharacterModal(characterName) {
    // Trouver les informations du personnage
    const character = allCharacters.find(char => char.displayName === characterName);
    if (!character) return;
    
    // Créer la modal avec le design LoL
    const modal = document.createElement('div');
    modal.className = 'character-modal';
    
    // Déterminer le nom du village
    const villageNames = {
        'konoha': 'Village Caché de la Feuille',
        'suna': 'Village Caché du Sable',
        'oto': 'Village Caché du Son',
        'nukenin': 'Nukenin'
    };
    
    const villageName = villageNames[character.village] || character.village;
    
    // Générer des statistiques fictives pour le personnage
    const stats = generateCharacterStats(character);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <img src="${character.image}" alt="${character.displayName}" class="modal-background-image">
                <button class="modal-close">&times;</button>
                <div class="modal-header-content">
                    <div class="modal-character-image">
                        <img src="${character.image}" alt="${character.displayName}">
                    </div>
                    <div class="modal-character-info">
                        <p class="modal-character-title">${character.title}</p>
                        <span class="modal-character-village">${villageName}</span>
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h2 class="modal-section-title">Histoire</h2>
                    <div class="modal-section-content">
                        <p>${character.description}</p>
                        <p>${generateCharacterLore(character)}</p>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h2 class="modal-section-title">Statistiques</h2>
                    <div class="modal-stats">
                        <div class="modal-stat">
                            <div class="modal-stat-title">Force</div>
                            <div class="modal-stat-value">${stats.strength}/10</div>
                        </div>
                        <div class="modal-stat">
                            <div class="modal-stat-title">Agilité</div>
                            <div class="modal-stat-value">${stats.agility}/10</div>
                        </div>
                        <div class="modal-stat">
                            <div class="modal-stat-title">Intelligence</div>
                            <div class="modal-stat-value">${stats.intelligence}/10</div>
                        </div>
                        <div class="modal-stat">
                            <div class="modal-stat-title">Chakra</div>
                            <div class="modal-stat-value">${stats.chakra}/10</div>
                        </div>
                        <div class="modal-stat">
                            <div class="modal-stat-title">Technique</div>
                            <div class="modal-stat-value">${stats.technique}/10</div>
                        </div>
                        <div class="modal-stat">
                            <div class="modal-stat-title">Expérience</div>
                            <div class="modal-stat-value">${stats.experience}/10</div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h2 class="modal-section-title">Techniques Spéciales</h2>
                    <div class="modal-section-content">
                        <p>${generateSpecialTechniques(character)}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animation d'ouverture
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Fermer la modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.onclick = function() {
        closeModal(modal);
    };
    
    // Fermer en cliquant à l'extérieur
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    };
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal(modal);
        }
    });
}

// Fonction pour fermer la modal
function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => {
        if (modal.parentNode) {
            document.body.removeChild(modal);
        }
    }, 300);
}

// Fonction pour afficher une modal de clan (style League of Legends)
function showClanModal(clanName) {
    // Trouver les informations du clan
    const clan = allClans.find(c => c.displayName === clanName);
    if (!clan) return;
    
    // Créer la modal avec le design LoL
    const modal = document.createElement('div');
    modal.className = 'character-modal';
    
    // Déterminer le nom du clan
    const clanNames = {
        'uchiha': 'Clan Uchiha',
        'senju': 'Clan Senju',
        'hyuga': 'Clan Hyūga',
        'uzumaki': 'Clan Uzumaki'
    };
    
    const clanDisplayName = clanNames[clan.clan] || clan.clan;
    const stats = generateClanStats(clan);
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <img src="${clan.image}" alt="${clan.displayName}" class="modal-background-image">
                <button class="modal-close">&times;</button>
                <div class="modal-header-content">
                    <div class="modal-character-image">
                        <img src="${clan.image}" alt="${clan.displayName}">
                    </div>
                    <div class="modal-character-info">
                        <p class="modal-character-title">${clan.title}</p>
                        <span class="modal-character-village">${clanDisplayName}</span>
                    </div>
                </div>
            </div>
            <div class="modal-body">
                <div class="modal-section">
                    <h2 class="modal-section-title">Histoire</h2>
                    <div class="modal-section-content">
                        <p>${clan.description}</p>
                        <p>${generateClanLore(clan)}</p>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h2 class="modal-section-title">Statistiques</h2>
                    <div class="modal-stats">
                        <div class="modal-stat">
                            <div class="modal-stat-title">Pouvoir</div>
                            <div class="modal-stat-value">${stats.power}/10</div>
                        </div>
                        <div class="modal-stat">
                            <div class="modal-stat-title">Influence</div>
                            <div class="modal-stat-value">${stats.influence}/10</div>
                        </div>
                        <div class="modal-stat">
                            <div class="modal-stat-title">Ancienneté</div>
                            <div class="modal-stat-value">${stats.ancient}/10</div>
                        </div>
                        <div class="modal-stat">
                            <div class="modal-stat-title">Techniques</div>
                            <div class="modal-stat-value">${stats.techniques}/10</div>
                        </div>
                        <div class="modal-stat">
                            <div class="modal-stat-title">Membres</div>
                            <div class="modal-stat-value">${stats.members}/10</div>
                        </div>
                        <div class="modal-stat">
                            <div class="modal-stat-title">Prestige</div>
                            <div class="modal-stat-value">${stats.prestige}/10</div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-section">
                    <h2 class="modal-section-title">Techniques Spéciales</h2>
                    <div class="modal-section-content">
                        <p>${generateClanTechniques(clan)}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animation d'ouverture
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Fermer la modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.onclick = function() {
        closeModal(modal);
    };
    
    // Fermer en cliquant à l'extérieur
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    };
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal(modal);
        }
    });
}

// Générer des statistiques pour un personnage
function generateCharacterStats(character) {
    const baseStats = {
        'wallace': { strength: 4, agility: 3, intelligence: 9, chakra: 2, technique: 8, experience: 7 },
        'gromit': { strength: 6, agility: 8, intelligence: 7, chakra: 3, technique: 5, experience: 6 }
    };
    
    return baseStats[character.dataName] || {
        strength: Math.floor(Math.random() * 8) + 3,
        agility: Math.floor(Math.random() * 8) + 3,
        intelligence: Math.floor(Math.random() * 8) + 3,
        chakra: Math.floor(Math.random() * 8) + 3,
        technique: Math.floor(Math.random() * 8) + 3,
        experience: Math.floor(Math.random() * 8) + 3
    };
}

// Générer du lore pour un personnage
function generateCharacterLore(character) {
    const loreTemplates = {
        'wallace': "Inventeur de génie originaire du Village Caché de la Feuille, Wallace est connu pour ses créations mécaniques révolutionnaires. Son amour du fromage et sa curiosité naturelle l'ont souvent mené dans des aventures extraordinaires. Avec son fidèle compagnon Gromit, il a résolu de nombreux mystères et sauvé le village à plusieurs reprises.",
        'gromit': "Chien intelligent et loyal, Gromit est le partenaire inséparable de Wallace. Doté d'une intelligence exceptionnelle et d'une capacité d'analyse remarquable, il est souvent le cerveau derrière les opérations de sauvetage. Sa patience et sa sagesse en font un allié précieux dans les moments difficiles."
    };
    
    return loreTemplates[character.dataName] || 
           `${character.displayName} est un personnage mystérieux dont l'histoire reste encore à écrire. Originaire du ${character.village}, ses exploits et ses aventures font partie des légendes qui se transmettent de génération en génération.`;
}

// Générer des techniques spéciales
function generateSpecialTechniques(character) {
    const techniques = {
        'wallace': "• Invention Mécanique : Capacité à créer des machines complexes en un temps record\n• Résolution de Problèmes : Analyse rapide des situations et élaboration de solutions créatives\n• Persévérance : Ne renonce jamais face aux défis les plus difficiles",
        'gromit': "• Communication Silencieuse : Peut transmettre des informations complexes sans parler\n• Analyse Tactique : Évalue rapidement les forces et faiblesses de ses adversaires\n• Loyauté Absolue : Protège ses alliés jusqu'au bout, peu importe les circonstances"
    };
    
    return techniques[character.dataName] || 
           "• Technique Secrète : Développe des capacités uniques basées sur son expérience\n• Adaptation : S'adapte rapidement aux nouvelles situations de combat\n• Leadership : Inspire confiance et courage chez ses compagnons";
}

// Générer des statistiques pour un clan
function generateClanStats(clan) {
    const baseStats = {
        'uchiha': { power: 9, influence: 8, ancient: 10, techniques: 9, members: 6, prestige: 9 },
        'senju': { power: 8, influence: 9, ancient: 10, techniques: 8, members: 5, prestige: 10 },
        'hyuga': { power: 7, influence: 7, ancient: 8, techniques: 7, members: 8, prestige: 7 },
        'uzumaki': { power: 8, influence: 6, ancient: 9, techniques: 10, members: 4, prestige: 8 }
    };
    
    return baseStats[clan.clan] || {
        power: Math.floor(Math.random() * 8) + 3,
        influence: Math.floor(Math.random() * 8) + 3,
        ancient: Math.floor(Math.random() * 8) + 3,
        techniques: Math.floor(Math.random() * 8) + 3,
        members: Math.floor(Math.random() * 8) + 3,
        prestige: Math.floor(Math.random() * 8) + 3
    };
}

// Générer du lore pour un clan
function generateClanLore(clan) {
    const loreTemplates = {
        'uchiha': "Le Clan Uchiha est l'un des plus anciens et puissants clans de Konoha. Descendants directs du Sage des Six Chemins, ils sont réputés pour leur Sharingan et leur maîtrise du feu. Leur histoire est marquée par des conflits internes et des tragédies, mais leur héritage perdure à travers les générations.",
        'senju': "Le Clan Senju, fondé par Hashirama Senju, le Premier Hokage, est le clan qui a établi Konoha. Connus pour leur maîtrise de toutes les natures de chakra et leur esprit de coopération, ils ont toujours défendu la paix et l'harmonie entre les villages.",
        'hyuga': "Le Clan Hyūga est célèbre pour son Byakugan, un dōjutsu héréditaire qui leur confère une vision exceptionnelle. Divisés en branche principale et branche secondaire, ils protègent jalousement leurs secrets et techniques ancestrales.",
        'uzumaki': "Le Clan Uzumaki était réputé pour ses techniques de sceaux et sa spirale caractéristique. Bien que leur village ait été détruit, leur héritage survit à travers leurs descendants dispersés dans le monde ninja."
    };
    
    return loreTemplates[clan.clan] || 
           `${clan.displayName} est un clan mystérieux dont l'histoire remonte aux temps anciens. Leurs techniques et traditions se transmettent de génération en génération, préservant leur héritage unique dans le monde ninja.`;
}

// Générer des techniques spéciales pour un clan
function generateClanTechniques(clan) {
    const techniques = {
        'uchiha': "• Sharingan : Dōjutsu héréditaire permettant de copier les techniques et de voir le chakra\n• Katon : Maîtrise exceptionnelle des techniques de feu\n• Genjutsu : Capacité à créer des illusions puissantes",
        'senju': "• Mokuton : Technique de libération du bois, unique à ce clan\n• Ninjutsu : Maîtrise de toutes les natures de chakra\n• Médical : Techniques de guérison avancées",
        'hyuga': "• Byakugan : Vision à 360 degrés et capacité à voir le système de chakra\n• Jūken : Art martial spécialisé dans l'attaque des points de chakra\n• Kaiten : Technique de rotation défensive",
        'uzumaki': "• Fūinjutsu : Maîtrise exceptionnelle des techniques de sceaux\n• Chakra Chains : Chaînes de chakra pour capturer et immobiliser\n• Longévité : Résistance naturelle aux maladies et à la fatigue"
    };
    
    return techniques[clan.clan] || 
           "• Techniques Héréditaires : Développement de capacités uniques transmises par le sang\n• Traditions : Préservation des méthodes ancestrales de combat\n• Innovation : Adaptation constante des techniques aux nouvelles menaces";
}

// Fonction pour ajouter un bouton de retour en haut
function addBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #c8aa6e;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Afficher/masquer le bouton selon le scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Fonctionnalité de retour en haut
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Fonction pour gérer la modal de contact
function setupContactModal() {
    const contactLink = document.getElementById('contactLink');
    const contactModal = document.getElementById('contactModal');
    const contactClose = document.querySelector('.contact-close');
    
    if (contactLink && contactModal) {
        // Ouvrir la modal
        contactLink.addEventListener('click', function(e) {
            e.preventDefault();
            contactModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Empêcher le scroll
        });
        
        // Fermer la modal avec le bouton X
        if (contactClose) {
            contactClose.addEventListener('click', function() {
                contactModal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Réactiver le scroll
            });
        }
        
        // Fermer la modal en cliquant à l'extérieur
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                contactModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Fermer la modal avec la touche Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && contactModal.style.display === 'block') {
                contactModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Initialiser le bouton de retour en haut et la modal de contact
document.addEventListener('DOMContentLoaded', function() {
    addBackToTopButton();
    setupContactModal();
}); 