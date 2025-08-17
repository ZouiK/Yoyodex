// Variables globales
let allCharacters = [];
let allClans = [];
let currentVillage = 'all';
let currentTab = 'characters';
let searchTerm = '';
let currentKekkeiSort = 'alphabetical';

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du site...');
    
    initializeCharacters();
    initializeClans();
    setupEventListeners();
    setupAnimations();
    applyFixedGridLayout();
    preloadCriticalImages();
    
    // Gestion des paramètres URL
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'clans') {
        switchTab('clans');
    } else if (tabParam === 'kekkei') {
        switchTab('kekkei');
    } else {
        initializeVillageMenu();
        showAlphabeticalMode();
        updateCharactersDisplay();
    }
});

// Préchargement des images critiques
function preloadCriticalImages() {
    const criticalImages = [
        'img/shinobis.webp',
        'img/kekkei_genkai.webp',
        'img/clans.webp',
        'img/konoha.webp',
        'img/suna.webp',
        'img/oto.webp',
        'img/nukenin.webp',
        'img/solve logo.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    console.log('🖼️ Images critiques préchargées');
}

// Initialisation du menu des villages
function initializeVillageMenu() {
    document.querySelectorAll('.village-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const allOption = document.querySelector('[data-village="all"]');
    if (allOption) {
        allOption.classList.add('selected');
    }
    
    const villageText = document.querySelector('.village-text');
    if (villageText) {
        villageText.textContent = 'TOUS LES SHINOBIS';
    }
}

// Application du layout fixe
function applyFixedGridLayout() {
    const villageGrids = document.querySelectorAll('.characters-grid');
    villageGrids.forEach(grid => {
        grid.classList.add('fixed-grid');
    });
    
    const alphabeticalGrid = document.getElementById('alphabeticalGrid');
    if (alphabeticalGrid) {
        alphabeticalGrid.classList.add('fixed-grid');
    }
}

// Initialisation des personnages
function initializeCharacters() {
    allCharacters = [];
    
    const charactersData = [
        {
            name: "Wallace Uchiha",
            dataName: "wallace_uchiha",
            title: "Inventeur",
            description: "Inventeur génial et amateur de fromage, toujours prêt pour une nouvelle aventure.",
            village: "konoha",
            clan: "uchiha"
        },
        {
            name: "Gromit Uzumaki",
            dataName: "gromit_uzumaki",
            title: "Chien Intelligent",
            description: "Chien fidèle et intelligent, partenaire inséparable de Wallace dans toutes ses inventions.",
            village: "konoha",
            clan: "uzumaki"
        },
        {
            name: "Hutch Fūma",
            dataName: "hutch",
            title: "Maître des Vents",
            description: "Shinobi du clan Fūma d'Otogakure, expert en techniques de vent et armes de jet.",
            village: "oto",
            clan: "fuma"
        }
    ];
    
    charactersData.forEach(charData => {
        const character = {
            element: null,
            name: charData.name.toLowerCase(),
            displayName: charData.name,
            title: charData.title,
            description: charData.description,
            image: '',
            village: charData.village,
            clan: charData.clan,
            dataName: charData.dataName
        };
        allCharacters.push(character);
    });
    
    console.log('👥 Personnages initialisés:', allCharacters.length);
}

// Initialisation des clans
function initializeClans() {
    allClans = [];
    
    const clansData = [
        {
            name: "Clan Uchiha",
            dataName: "uchiha",
            title: "Les descendants du Sage",
            description: "Clan légendaire réputé pour son Sharingan et sa maîtrise des techniques de feu.",
            village: "konoha",
            clan: "uchiha"
        },
        {
            name: "Clan Senju",
            dataName: "senju",
            title: "Les héritiers de la Volonté du Feu",
            description: "Clan fondateur de Konoha, maîtres de toutes les natures de chakra.",
            village: "konoha",
            clan: "senju"
        },
        {
            name: "Clan Hyūga",
            dataName: "hyuga",
            title: "Les gardiens du Byakugan",
            description: "Clan noble protégeant le secret du Byakugan et maîtrisant l'art du Jūken.",
            village: "konoha",
            clan: "hyuga"
        },
        {
            name: "Clan Uzumaki",
            dataName: "uzumaki",
            title: "Les maîtres des sceaux",
            description: "Clan réputé pour ses techniques de sceaux et sa spirale caractéristique.",
            village: "konoha",
            clan: "uzumaki"
        },
        {
            name: "Clan Fūma",
            dataName: "fuma",
            title: "Les maîtres des vents",
            description: "Clan d'Otogakure spécialisé dans les techniques de vent et les armes de jet.",
            village: "oto",
            clan: "fuma"
        }
    ];
    
    clansData.forEach(clanData => {
        const clan = {
            element: null,
            name: clanData.name.toLowerCase(),
            displayName: clanData.name,
            title: clanData.title,
            description: clanData.description,
            image: '',
            clan: clanData.clan,
            village: clanData.village,
            dataName: clanData.dataName
        };
        allClans.push(clan);
    });
    
    console.log('🏛️ Clans initialisés:', allClans.length);
}

// Chargement des images des personnages
function loadCharacterImage(characterName, dataName, imgElement, character) {
    const normalizeName = (name) => {
        return name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '')
            .trim();
    };
    
    const baseName = dataName || normalizeName(characterName);
    const extensions = ['png', 'jpg', 'jpeg', 'webp'];
    
    function tryNextExtension(index) {
        if (index >= extensions.length) {
            const placeholderUrl = `https://via.placeholder.com/280x320/1a1f2e/c8aa6e?text=${encodeURIComponent(characterName)}`;
            imgElement.src = placeholderUrl;
            character.image = placeholderUrl;
            return;
        }
        
        const imagePath = `img/${baseName}.${extensions[index]}`;
        const testImg = new Image();
        
        testImg.onload = function() {
            imgElement.src = imagePath;
            imgElement.alt = characterName;
            character.image = imagePath;
        };
        
        testImg.onerror = function() {
            tryNextExtension(index + 1);
        };
        
        testImg.src = imagePath;
    }
    
    tryNextExtension(0);
}

// Configuration des événements
function setupEventListeners() {
    // Recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
    }
    
    const searchSection = document.querySelector('.search-section');
    if (searchSection) {
    searchSection.addEventListener('click', function(e) {
        if (e.target !== searchInput) {
            searchInput.focus();
        }
    });
    }
    
    // Menu des villages
    const villageTrigger = document.getElementById('villageTrigger');
    const villageDropdown = document.getElementById('villageDropdown');
    const villageOptions = document.querySelectorAll('.village-option');
    
    if (villageTrigger) {
        villageTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleVillageDropdown();
        });
    }
    
    villageOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const villageType = this.getAttribute('data-village');
            selectVillageOption(villageType);
        });
    });
    
    // Fermeture du menu au clic extérieur
    document.addEventListener('click', function(e) {
        if (villageDropdown && !villageDropdown.contains(e.target)) {
            closeVillageDropdown();
        }
    });
    
    // Fermeture avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVillageDropdown();
        }
    });
    
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Clic sur les cartes
    document.addEventListener('click', function(e) {
        if (e.target.closest('.character-card') || 
            e.target.closest('.alphabetical-character-card') || 
            e.target.closest('.clans-alphabetical-character-card')) {
            const card = e.target.closest('.character-card') || 
                        e.target.closest('.alphabetical-character-card');
            handleCharacterClick(card);
        }
    });

    // Logo pour retour à l'accueil
    const navBrand = document.getElementById('navBrand');
    if (navBrand) {
        navBrand.addEventListener('click', function() {
            switchTab('characters');
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.value = '';
                searchTerm = '';
            }
            currentVillage = 'all';
            const villageText = document.querySelector('.village-text');
            if (villageText) {
                villageText.textContent = 'TOUS LES SHINOBIS';
            }
            document.querySelectorAll('.village-option').forEach(option => {
                option.classList.remove('selected');
            });
            const allOption = document.querySelector('[data-village="all"]');
            if (allOption) {
                allOption.classList.add('selected');
            }
            updateCharactersDisplay();
        });
    }
    
    // Menu de tri kekkei genkai
    const kekkeiSortTrigger = document.getElementById('kekkeiSortTrigger');
    const kekkeiSortOptions = document.querySelectorAll('#kekkeiSortMenu .village-option');
    
    if (kekkeiSortTrigger) {
        kekkeiSortTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleKekkeiSortDropdown();
        });
    }
    
    kekkeiSortOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const sortType = this.getAttribute('data-sort');
            selectKekkeiSortOption(sortType);
        });
    });
    
    document.addEventListener('click', function(e) {
        const kekkeiSortDropdown = document.getElementById('kekkeiSortDropdown');
        if (kekkeiSortDropdown && !kekkeiSortDropdown.contains(e.target)) {
            closeKekkeiSortDropdown();
        }
    });
}

// Gestion de la recherche
function handleSearch(e) {
    searchTerm = e.target.value.toLowerCase();
    
    if (currentTab === 'characters') {
        updateCharactersDisplay();
    } else if (currentTab === 'clans') {
        updateClansDisplay();
    } else if (currentTab === 'kekkei') {
        // Pas encore implémenté
    }
}

// Gestion du menu des villages
function toggleVillageDropdown() {
    const villageDropdown = document.getElementById('villageDropdown');
    const villageTrigger = document.getElementById('villageTrigger');
    
    if (villageDropdown.classList.contains('active')) {
        closeVillageDropdown();
    } else {
        openVillageDropdown();
    }
}

function openVillageDropdown() {
    const villageDropdown = document.getElementById('villageDropdown');
    const villageTrigger = document.getElementById('villageTrigger');
    
    villageDropdown.classList.add('active');
    villageTrigger.classList.add('active');
}

function closeVillageDropdown() {
    const villageDropdown = document.getElementById('villageDropdown');
    const villageTrigger = document.getElementById('villageTrigger');
    
    villageDropdown.classList.remove('active');
    villageTrigger.classList.remove('active');
}

function selectVillageOption(villageType) {
    document.querySelectorAll('.village-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    const selectedOption = document.querySelector(`[data-village="${villageType}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
    }
    
    const villageText = document.querySelector('.village-text');
    if (villageType === 'all') {
        if (currentTab === 'characters') {
            if (villageText) villageText.textContent = 'TOUS LES SHINOBIS';
        } else if (currentTab === 'clans') {
            if (villageText) villageText.textContent = 'TOUS LES CLANS';
        }
    } else {
        const villageTypeText = document.querySelector(`[data-village="${villageType}"] .village-option-text`);
        if (villageText && villageTypeText) {
            villageText.textContent = villageTypeText.textContent;
        }
    }
    
    currentVillage = villageType;
    closeVillageDropdown();
    
    if (currentTab === 'characters') {
        updateCharactersDisplay();
    } else if (currentTab === 'clans') {
        updateClansDisplay();
    }
}

// Changement d'onglet
function switchTab(tab) {
    console.log('🔄 Changement d\'onglet vers:', tab);
    
    // Mise à jour de la navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-tab="${tab}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Mise à jour de l'URL
    const url = new URL(window.location);
    if (tab === 'characters') {
        url.searchParams.delete('tab');
    } else {
        url.searchParams.set('tab', tab);
    }
    window.history.pushState({}, '', url);
    
    // Mise à jour du placeholder de recherche
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
    if (tab === 'characters') {
        searchInput.placeholder = 'TROUVER UN SHINOBI';
    } else if (tab === 'clans') {
        searchInput.placeholder = 'TROUVER UN CLAN';
        } else if (tab === 'kekkei') {
            searchInput.placeholder = 'TROUVER UN KEKKEI GENKAI';
        }
    }

    // Gestion des menus
    const villageDropdown = document.getElementById('villageDropdown');
    const villageText = document.querySelector('.village-text');
    const kekkeiSortDropdown = document.getElementById('kekkeiSortDropdown');
    
    if (tab === 'characters') {
        if (villageDropdown) villageDropdown.style.display = 'block';
        if (villageText) villageText.textContent = 'TOUS LES SHINOBIS';
        currentVillage = 'all';
        document.querySelectorAll('.village-option').forEach(option => {
            option.classList.remove('selected');
        });
        const allOption = document.querySelector('[data-village="all"]');
        if (allOption) allOption.classList.add('selected');
        if (kekkeiSortDropdown) kekkeiSortDropdown.style.display = 'none';
        showNukeninOption();
    } else if (tab === 'clans') {
        if (villageDropdown) villageDropdown.style.display = 'block';
        if (villageText) villageText.textContent = 'TOUS LES CLANS';
        currentVillage = 'all';
        document.querySelectorAll('.village-option').forEach(option => {
            option.classList.remove('selected');
        });
        const allOption = document.querySelector('[data-village="all"]');
        if (allOption) allOption.classList.add('selected');
        if (kekkeiSortDropdown) kekkeiSortDropdown.style.display = 'none';
        hideNukeninOption();
    } else if (tab === 'kekkei') {
        if (villageDropdown) villageDropdown.style.display = 'none';
        if (kekkeiSortDropdown) kekkeiSortDropdown.style.display = 'block';
    }

    // Masquage de tous les modes
    document.getElementById('charactersMode').style.display = 'none';
    document.getElementById('alphabeticalMode').style.display = 'none';
    document.getElementById('clansMode').style.display = 'none';
    document.getElementById('clansAlphabeticalMode').style.display = 'none';
    document.getElementById('kekkeiMode').style.display = 'none';
    
    // Affichage du mode approprié
    if (tab === 'characters') {
        currentTab = 'characters';
        showAlphabeticalMode();
        updateCharactersDisplay();
    } else if (tab === 'clans') {
        currentTab = 'clans';
        showClansAlphabeticalMode();
        updateClansDisplay();
    } else if (tab === 'kekkei') {
        currentTab = 'kekkei';
        const kekkeiMode = document.getElementById('kekkeiMode');
        if (kekkeiMode) {
            kekkeiMode.style.display = 'block';
        }
    }
}

// Affichage du mode alphabétique des clans
function showClansAlphabeticalMode() {
    document.getElementById('charactersMode').style.display = 'none';
    document.getElementById('alphabeticalMode').style.display = 'none';
    document.getElementById('clansMode').style.display = 'none';
    document.getElementById('kekkeiMode').style.display = 'none';
    
    const clansAlphabeticalMode = document.getElementById('clansAlphabeticalMode');
    if (clansAlphabeticalMode) {
        clansAlphabeticalMode.style.display = 'block';
    }
    
    if (!document.getElementById('clansAlphabeticalGrid') || 
        document.getElementById('clansAlphabeticalGrid').children.length === 0) {
        createClansAlphabeticalGrid();
    }
    
    const clansAlphabeticalGrid = document.getElementById('clansAlphabeticalGrid');
    if (clansAlphabeticalGrid) {
        clansAlphabeticalGrid.classList.add('fixed-grid');
    }
}

// Affichage du mode alphabétique des personnages
function showAlphabeticalMode() {
    document.getElementById('charactersMode').style.display = 'none';
    document.getElementById('clansMode').style.display = 'none';
    document.getElementById('clansAlphabeticalMode').style.display = 'none';
    document.getElementById('kekkeiMode').style.display = 'none';
    
    const alphabeticalMode = document.getElementById('alphabeticalMode');
    if (alphabeticalMode) {
        alphabeticalMode.style.display = 'block';
    }
    
    if (document.getElementById('alphabeticalGrid').children.length === 0) {
        createAlphabeticalGrid();
    }
    
    const alphabeticalGrid = document.getElementById('alphabeticalGrid');
    if (alphabeticalGrid) {
        alphabeticalGrid.classList.add('fixed-grid');
    }
}

// Création de la grille alphabétique des personnages
function createAlphabeticalGrid(characters = null) {
    const alphabeticalGrid = document.getElementById('alphabeticalGrid');
    if (!alphabeticalGrid) {
        console.error('alphabeticalGrid non trouvé');
        return;
    }
    
    alphabeticalGrid.innerHTML = '';
    
    const charactersToShow = characters || allCharacters;
    const sortedCharacters = [...charactersToShow].sort((a, b) => 
        a.displayName.localeCompare(b.displayName, 'fr')
    );
    
    sortedCharacters.forEach(character => {
        const card = createAlphabeticalCard(character);
        alphabeticalGrid.appendChild(card);
    });
    
    console.log('📋 Grille alphabétique créée avec', sortedCharacters.length, 'personnages');
}

// Création d'une carte alphabétique
function createAlphabeticalCard(character) {
    const card = document.createElement('div');
    card.className = 'alphabetical-character-card';
    card.setAttribute('data-name', character.dataName);
    card.setAttribute('data-village', character.village);
    
    const tempImageSrc = `https://via.placeholder.com/200x220/1a1f2e/c8aa6e?text=${encodeURIComponent(character.displayName)}`;
    
    card.innerHTML = `
        <div class="alphabetical-character-image">
            <img src="${tempImageSrc}" alt="${character.displayName}">
        </div>
        <div class="alphabetical-character-info">
            <h3>${character.displayName}</h3>
            <p class="character-title">${character.title}</p>
        </div>
    `;
    
    const imgElement = card.querySelector('img');
    if (imgElement) {
        loadCharacterImage(character.displayName, character.dataName, imgElement, character);
    }
    
    return card;
}

// Mise à jour de l'affichage des personnages
function updateCharactersDisplay() {
    const filteredCharacters = allCharacters.filter(character => {
        const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             character.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (character.clan && character.clan.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (currentVillage === 'all') {
            return matchesSearch;
        } else if (currentVillage === 'konoha') {
            return matchesSearch && character.village === 'konoha';
        } else if (currentVillage === 'suna') {
            return matchesSearch && character.village === 'suna';
                } else if (currentVillage === 'oto') {
            return matchesSearch && character.village === 'oto';
        } else if (currentVillage === 'nukenin') {
            return matchesSearch && character.village === 'nukenin';
        }
        
        return matchesSearch;
    });
    
    filteredCharacters.sort((a, b) => a.displayName.localeCompare(b.displayName));
    
    updateCharactersSectionTitle();
    createAlphabeticalGrid(filteredCharacters);
    
    console.log('👥 Personnages affichés:', filteredCharacters.length);
}

// Mise à jour du titre de section des personnages
function updateCharactersSectionTitle() {
    const sectionTitle = document.querySelector('#alphabeticalMode .hero-title');
    const heroSection = document.querySelector('#alphabeticalMode .hero');
    
    if (sectionTitle && heroSection) {
        if (currentVillage === 'all') {
            sectionTitle.textContent = 'SHINOBIS';
            heroSection.setAttribute('data-title', 'SHINOBIS');
            setHeroBackgroundWithFallback(heroSection, 'shinobis');
        } else if (currentVillage === 'konoha') {
            sectionTitle.textContent = 'KONOHA';
            heroSection.setAttribute('data-title', 'KONOHA');
            setHeroBackgroundWithFallback(heroSection, 'konoha');
        } else if (currentVillage === 'suna') {
            sectionTitle.textContent = 'SUNA';
            heroSection.setAttribute('data-title', 'SUNAGAKURE');
            setHeroBackgroundWithFallback(heroSection, 'suna');
                } else if (currentVillage === 'oto') {
            sectionTitle.textContent = 'OTO';
            heroSection.setAttribute('data-title', 'OTOGAKURE');
            setHeroBackgroundWithFallback(heroSection, 'oto');
        } else if (currentVillage === 'nukenin') {
            sectionTitle.textContent = 'NUKENIN';
            heroSection.setAttribute('data-title', 'NUKENIN');
            setHeroBackgroundWithFallback(heroSection, 'nukenin');
        }
    }
}

// Définition de l'arrière-plan du hero avec fallback
function setHeroBackgroundWithFallback(heroElement, imageName) {
    const formats = ['gif', 'png', 'jpg', 'jpeg', 'webp'];
    let currentFormatIndex = 0;
    
    function tryNextFormat() {
        if (currentFormatIndex >= formats.length) {
            heroElement.style.backgroundImage = 'none';
            return;
        }
        
        const format = formats[currentFormatIndex];
        const imageUrl = `img/${imageName}.${format}`;
        const img = new Image();
        
        img.onload = function() {
            heroElement.style.backgroundImage = `url('${imageUrl}')`;
        };
        
        img.onerror = function() {
            currentFormatIndex++;
            tryNextFormat();
        };
        
        img.src = imageUrl;
    }
    
    tryNextFormat();
}

// Mise à jour de l'affichage des clans
function updateClansDisplay() {
    const filteredClans = allClans.filter(clan => {
        const matchesSearch = clan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             clan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             clan.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (currentVillage === 'all') {
            return matchesSearch;
        } else if (currentVillage === 'konoha') {
            return matchesSearch && clan.village === 'konoha';
        } else if (currentVillage === 'suna') {
            return matchesSearch && clan.village === 'suna';
                } else if (currentVillage === 'oto') {
            return matchesSearch && clan.village === 'oto';
        }
        
        return matchesSearch;
    });
    
    filteredClans.sort((a, b) => a.name.localeCompare(b.name));
    
    updateClansSectionTitle();
    createClansAlphabeticalGrid(filteredClans);
    
    console.log('🏛️ Clans affichés:', filteredClans.length);
}

// Mise à jour du titre de section des clans
function updateClansSectionTitle() {
    const sectionTitle = document.querySelector('#clansAlphabeticalMode .hero-title');
    const heroSection = document.querySelector('#clansAlphabeticalMode .hero');
    
    if (sectionTitle && heroSection) {
        if (currentVillage === 'all') {
            sectionTitle.textContent = 'CLANS';
            heroSection.setAttribute('data-title', 'CLANS');
            setHeroBackgroundWithFallback(heroSection, 'clans');
        } else if (currentVillage === 'konoha') {
            sectionTitle.textContent = 'CLANS DE KONOHA';
            heroSection.setAttribute('data-title', 'KONOHA');
            setHeroBackgroundWithFallback(heroSection, 'konoha');
        } else if (currentVillage === 'suna') {
            sectionTitle.textContent = 'CLANS DE SUNA';
            heroSection.setAttribute('data-title', 'SUNAGAKURE');
            setHeroBackgroundWithFallback(heroSection, 'suna');
                } else if (currentVillage === 'oto') {
            sectionTitle.textContent = 'CLANS D\'OTO';
            heroSection.setAttribute('data-title', 'OTOGAKURE');
            setHeroBackgroundWithFallback(heroSection, 'oto');
        }
    }
}

// Création de la grille alphabétique des clans
function createClansAlphabeticalGrid(clans = null) {
    const alphabeticalGrid = document.getElementById('clansAlphabeticalGrid');
    if (!alphabeticalGrid) {
        console.error('clansAlphabeticalGrid non trouvé');
        return;
    }
    
    alphabeticalGrid.innerHTML = '';
    
    const clansToShow = clans || allClans;
    const sortedClans = [...clansToShow].sort((a, b) => 
        a.displayName.localeCompare(b.displayName, 'fr')
    );
    
    sortedClans.forEach(clan => {
        const card = createClansAlphabeticalCard(clan);
        alphabeticalGrid.appendChild(card);
    });
    
    console.log('🏛️ Grille alphabétique des clans créée avec', sortedClans.length, 'clans');
}

// Création d'une carte alphabétique de clan
function createClansAlphabeticalCard(clan) {
    const card = document.createElement('div');
    card.className = 'alphabetical-character-card clans-alphabetical-character-card';
    card.setAttribute('data-name', clan.dataName);
    card.setAttribute('data-clan', clan.clan);
    card.setAttribute('data-village', clan.village);
    
    const tempImageSrc = `https://via.placeholder.com/200x220/1a1f2e/c8aa6e?text=${encodeURIComponent(clan.displayName)}`;
    
    card.innerHTML = `
        <div class="alphabetical-character-image">
            <img src="${tempImageSrc}" alt="${clan.displayName}">
        </div>
        <div class="alphabetical-character-info">
            <h3>${clan.displayName}</h3>
            <p class="character-title">${clan.title}</p>
        </div>
    `;
    
    const imgElement = card.querySelector('img');
    if (imgElement) {
        loadCharacterImage(clan.displayName, clan.dataName, imgElement, clan);
    }
    
    return card;
}

// Gestion du clic sur une carte
function handleCharacterClick(card) {
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = '';
    }, 150);
    
    const characterName = card.querySelector('h3').textContent;
    const dataName = card.getAttribute('data-name');
    
    console.log(`${currentTab === 'clans' ? 'Clan' : 'Personnage'} cliqué: ${characterName}`);
    
    if (currentTab === 'clans') {
        window.location.href = `clan-detail.html?clan=${dataName}`;
    } else {
        window.location.href = `character-detail.html?character=${dataName}`;
    }
}

// Configuration des animations
function setupAnimations() {
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

    // Animations au survol
    characterCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Gestion du menu de tri kekkei genkai
function toggleKekkeiSortDropdown() {
    const dropdown = document.getElementById('kekkeiSortDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function closeKekkeiSortDropdown() {
    const dropdown = document.getElementById('kekkeiSortDropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

function selectKekkeiSortOption(sortType) {
    currentKekkeiSort = sortType;
    
    const sortText = document.querySelector('#kekkeiSortTrigger .village-text');
    if (sortType === 'alphabetical') {
        if (sortText) sortText.textContent = 'TRIER PAR A-Z';
    } else if (sortType === 'rarity') {
        if (sortText) sortText.textContent = 'TRIER PAR RARETÉ';
    }
    
    closeKekkeiSortDropdown();
    console.log(`Tri kekkei genkai par: ${sortType}`);
}

// Gestion de l'option Nukenin
function showNukeninOption() {
    const nukeninOption = document.querySelector('[data-village="nukenin"]');
    if (nukeninOption) {
        nukeninOption.style.display = 'flex';
    }
}

function hideNukeninOption() {
    const nukeninOption = document.querySelector('[data-village="nukenin"]');
    if (nukeninOption) {
        nukeninOption.style.display = 'none';
    }
}

// Configuration du modal de contact
function setupContactModal() {
    const contactLink = document.getElementById('contactLink');
    const contactModal = document.getElementById('contactModal');
    const contactClose = document.querySelector('.contact-close');
    
    if (contactLink && contactModal) {
        contactLink.addEventListener('click', function(e) {
            e.preventDefault();
            contactModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
        
        if (contactClose) {
            contactClose.addEventListener('click', function() {
                contactModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        contactModal.addEventListener('click', function(e) {
            if (e.target === contactModal) {
                contactModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && contactModal.style.display === 'block') {
                contactModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Initialisation finale
document.addEventListener('DOMContentLoaded', function() {
    setupContactModal();
    
    if (currentTab === 'characters') {
        showAlphabeticalMode();
        updateCharactersDisplay();
    }
    
    console.log('🎉 Site initialisé avec succès !');
});