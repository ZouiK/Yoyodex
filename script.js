// Variables globales
let allCharacters = [];
let allClans = [];
let allKekkeiGenkai = [];
let currentVillage = 'all';
let currentTab = 'characters';
let searchTerm = '';
let currentKekkeiSort = 'alphabetical';

// Fonctions utilitaires pour le chargement et les erreurs
function showLoadingSpinner() {
    const existingSpinner = document.getElementById('loadingSpinner');
    if (existingSpinner) return;
    
    const spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(26, 26, 26, 0.8); display: flex; justify-content: center; align-items: center; z-index: 9999;">
            <div style="color: #c8aa6e; font-size: 18px; text-align: center;">
                <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 10px;"></i>
                <div>Chargement des données...</div>
            </div>
        </div>
    `;
    document.body.appendChild(spinner);
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.remove();
    }
}

function showErrorMessage(message) {
    const existingError = document.getElementById('errorMessage');
    if (existingError) existingError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'errorMessage';
    errorDiv.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #d32f2f; color: white; padding: 15px 20px; border-radius: 5px; z-index: 10000; max-width: 300px;">
            <i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>
            ${message}
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; float: right; cursor: pointer; font-size: 16px; margin-left: 10px;">&times;</button>
        </div>
    `;
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Initialisation du site...');
    
    // Afficher le spinner de chargement
    showLoadingSpinner();
    
    try {
        await Promise.all([
            initializeCharacters(),
            initializeClans(),
            initializeKekkeiGenkai()
        ]);
        
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
    } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        showErrorMessage('Erreur lors du chargement des données. Veuillez rafraîchir la page.');
    } finally {
        hideLoadingSpinner();
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

// Initialisation des personnages depuis l'API
async function initializeCharacters() {
    try {
        const response = await fetch('/api/ninjas?limit=100');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allCharacters = [];
        
        if (data.items && Array.isArray(data.items)) {
            data.items.forEach(ninja => {
                const character = {
                    id: ninja.id,
                    element: null,
                    name: ninja.name.toLowerCase(),
                    displayName: ninja.name,
                    title: ninja.grade || '',
                    description: ninja.description || '',
                    image: ninja.image_url || '',
                    village: ninja.village,
                    clan: ninja.clan_id || '',
                    dataName: ninja.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
                    rank: ninja.grade || ''
                };
                allCharacters.push(character);
            });
        }
        
        console.log('👥 Personnages initialisés depuis l\'API:', allCharacters.length);
    } catch (error) {
      console.error('Erreur lors du chargement des personnages:', error);
      // Fallback vers les données locales si disponibles
      if (typeof SHINOBI_DATA !== 'undefined') {
            SHINOBI_DATA.forEach(charData => {
                const character = {
                    element: null,
                    name: charData.name.toLowerCase(),
                    displayName: charData.name,
                    title: charData.title,
                    description: charData.description,
                    image: charData.image || '',
                    village: charData.village,
                    clan: charData.clan,
                    dataName: charData.dataName,
                    rank: charData.rank
                };
                allCharacters.push(character);
            });
            console.log('👥 Personnages initialisés depuis les données locales:', allCharacters.length);
      }
    }
}

// Initialisation des clans depuis l'API
async function initializeClans() {
    try {
        const response = await fetch('/api/clans?limit=100');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allClans = [];
        
        if (data.items && Array.isArray(data.items)) {
            data.items.forEach(clan => {
                const clanObj = {
                    id: clan.id,
                    element: null,
                    name: clan.name.toLowerCase(),
                    displayName: clan.name,
                    title: clan.name,
                    description: clan.description || '',
                    image: clan.image_url || '',
                    village: clan.village_origin || 'konoha',
                    kekkeiGenkai: '',
                    dataName: clan.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
                    history: clan.description || '',
                    techniques: [],
                    members: []
                };
                allClans.push(clanObj);
            });
        }
        
        console.log('🏛️ Clans initialisés depuis l\'API:', allClans.length);
    } catch (error) {
      console.error('Erreur lors du chargement des clans:', error);
      // Fallback vers les données locales si disponibles
      if (typeof CLAN_DATA !== 'undefined') {
            CLAN_DATA.forEach(clanData => {
                const clan = {
                    element: null,
                    name: clanData.name.toLowerCase(),
                    displayName: clanData.name,
                    title: clanData.title,
                    description: clanData.description,
                    image: clanData.image || '',
                    village: clanData.village,
                    kekkeiGenkai: Array.isArray(clanData.kekkeiGenkai) ? clanData.kekkeiGenkai.join(', ') : clanData.kekkeiGenkai,
                    dataName: clanData.dataName,
                    history: clanData.history,
                    techniques: clanData.techniques,
                    members: clanData.members
                };
                allClans.push(clan);
            });
            console.log('🏛️ Clans initialisés depuis les données locales:', allClans.length);
      }
    }
}

// Initialisation des Kekkei Genkai depuis l'API
async function initializeKekkeiGenkai() {
    try {
        const response = await fetch('/api/kekkei?limit=100');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allKekkeiGenkai = [];
        
        if (data.items && Array.isArray(data.items)) {
            data.items.forEach(kekkei => {
                const kekkeiObj = {
                    id: kekkei.id,
                    element: null,
                    name: kekkei.name.toLowerCase(),
                    displayName: kekkei.name,
                    description: kekkei.description || '',
                    type: 'Kekkei Genkai',
                    clan: '',
                    image: kekkei.image_url || '',
                    rarity: kekkei.rarete || 'Commun',
                    activation: '',
                    abilities: '',
                    users: [],
                    weaknesses: '',
                    strengths: ''
                };
                allKekkeiGenkai.push(kekkeiObj);
            });
        }
        
        console.log('👁️ Kekkei Genkai initialisés depuis l\'API:', allKekkeiGenkai.length);
    } catch (error) {
      console.error('Erreur lors du chargement des Kekkei Genkai:', error);
      // Fallback vers les données locales si disponibles
      if (typeof KEKKEI_GENKAI_DATA !== 'undefined') {
            KEKKEI_GENKAI_DATA.forEach(kekkeiData => {
                const kekkei = {
                    element: null,
                    name: kekkeiData.name.toLowerCase(),
                    displayName: kekkeiData.name,
                    description: kekkeiData.description,
                    type: kekkeiData.type,
                    clan: kekkeiData.clan,
                    image: kekkeiData.image || '',
                    rarity: kekkeiData.rarity,
                    activation: kekkeiData.activation,
                    abilities: kekkeiData.abilities,
                    users: kekkeiData.users,
                    weaknesses: kekkeiData.weaknesses,
                    strengths: kekkeiData.strengths
                };
                allKekkeiGenkai.push(kekkei);
            });
            console.log('👁️ Kekkei Genkai initialisés depuis les données locales:', allKekkeiGenkai.length);
      }
    }
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
        // Gestion des cartes de clans
        if (e.target.closest('.clans-alphabetical-character-card')) {
            const card = e.target.closest('.clans-alphabetical-character-card');
            handleClanClick(card);
        }
        // Gestion des cartes de personnages
        else if (e.target.closest('.character-card') || 
                 e.target.closest('.alphabetical-character-card')) {
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
    searchTerm = e.target.value.trim();
    
    if (currentTab === 'characters') {
        updateCharactersDisplay();
    } else if (currentTab === 'clans') {
        updateClansDisplay();
    } else if (currentTab === 'kekkei') {
        updateKekkeiGenkaiDisplay();
    }
    
    console.log('🔍 Recherche:', searchTerm);
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
        const heroElement = document.querySelector('#kekkeiMode .hero');
        if (heroElement) {
            setHeroBackgroundWithFallback(heroElement, 'kekkei_genkai');
        }
        updateKekkeiGenkaiDisplay();
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
    card.className = 'character-card';
    card.dataset.character = character.dataName;
    card.dataset.village = character.village;
    card.style.cursor = 'pointer';
    
    card.innerHTML = `
        <div class="character-image">
            <img src="" alt="${character.displayName}" loading="lazy">
        </div>
        <div class="character-info">
            <h3>${character.displayName}</h3>
            <span class="character-title">${character.title}</span>
        </div>
    `;
    
    // Charger l'image du personnage
    const imgElement = card.querySelector('img');
    if (imgElement) {
        loadCharacterImage(character.displayName, character.dataName, imgElement, character);
    }
    
    // Ajouter l'événement de clic pour afficher les détails
    card.addEventListener('click', function() {
        handleCharacterClick(card);
    });
    
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
    card.setAttribute('data-clan', clan.dataName);
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

// Gestion du clic sur une carte de personnage
function handleCharacterClick(card) {
    const characterName = card.dataset.character;
    const characterData = allCharacters.find(char => char.dataName === characterName);
    
    if (characterData) {
        // Rediriger vers la page de détail du personnage
        window.location.href = `character-detail.html?character=${characterName}`;
    } else {
        console.warn('Données du personnage non trouvées:', characterName);
        alert(`Informations sur ${characterName} bientôt disponibles !`);
    }
}

// Gestion du clic sur une carte de clan
function handleClanClick(card) {
    const clanName = card.dataset.clan;
    const clanData = allClans.find(clan => clan.dataName === clanName);
    
    if (clanData) {
        // Rediriger vers la page de détail du clan
        window.location.href = `clan-detail.html?clan=${clanName}`;
    } else {
        console.warn('Données du clan non trouvées:', clanName);
        alert(`Informations sur ${clanName} bientôt disponibles !`);
    }
}



// Configuration des animations (effet d'apparition supprimé)
function setupAnimations() {
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
    updateKekkeiGenkaiDisplay();
    console.log(`Tri kekkei genkai par: ${sortType}`);
}

// Mise à jour de l'affichage des Kekkei Genkai
function updateKekkeiGenkaiDisplay() {
    let filteredKekkei = [...allKekkeiGenkai];
    
    // Filtrage par recherche
    if (searchTerm) {
        filteredKekkei = filteredKekkei.filter(kekkei => 
            kekkei.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kekkei.clan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            kekkei.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Tri
    if (currentKekkeiSort === 'alphabetical') {
        filteredKekkei.sort((a, b) => a.displayName.localeCompare(b.displayName));
    } else if (currentKekkeiSort === 'rarity') {
        const rarityOrder = { 'Légendaire': 0, 'Rare': 1, 'Commun': 2 };
        filteredKekkei.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);
    }
    
    createKekkeiGenkaiGrid(filteredKekkei);
}

// Création de la grille des Kekkei Genkai
function createKekkeiGenkaiGrid(kekkeiList = null) {
    const grid = document.getElementById('kekkeiAlphabeticalGrid');
    if (!grid) return;
    
    const kekkeiToShow = kekkeiList || allKekkeiGenkai;
    
    if (kekkeiToShow.length === 0) {
        grid.innerHTML = `
            <div class="empty-section">
                <div class="empty-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>Aucun résultat</h3>
                <p>Aucun Kekkei Genkai ne correspond à votre recherche.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = kekkeiToShow.map(kekkei => createKekkeiGenkaiCard(kekkei)).join('');
    
    // Ajouter les event listeners pour les clics
    grid.querySelectorAll('.clans-alphabetical-character-card').forEach(card => {
        card.addEventListener('click', () => handleKekkeiGenkaiClick(card));
    });
}

// Création d'une carte de Kekkei Genkai
function createKekkeiGenkaiCard(kekkei) {
    return `
        <div class="clans-alphabetical-character-card" data-kekkei="${kekkei.name}">
            <div class="alphabetical-character-image">
                <img src="img/kekkei_genkai/${kekkei.image}" alt="${kekkei.displayName}" loading="lazy" 
                     onerror="this.src='img/kekkei_genkai/default.png'; this.onerror=null;">
            </div>
            <div class="alphabetical-character-info">
                <h3>${kekkei.displayName}</h3>
                <div class="character-title">${kekkei.type} - ${kekkei.clan}</div>
            </div>
        </div>
    `;
}

// Gestion du clic sur une carte de Kekkei Genkai
function handleKekkeiGenkaiClick(card) {
    const kekkeiName = card.dataset.kekkei;
    const kekkeiData = allKekkeiGenkai.find(kekkei => kekkei.name === kekkeiName);
    
    if (kekkeiData) {
        // Rediriger vers la page de détail du Kekkei Genkai
        window.location.href = `kekkei-detail.html?kekkei=${encodeURIComponent(kekkeiName)}`;
    } else {
        console.warn('Données du Kekkei Genkai non trouvées:', kekkeiName);
        alert(`Informations sur ${kekkeiName} bientôt disponibles !`);
    }
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

// Configuration du modal de contact au chargement
document.addEventListener('DOMContentLoaded', function() {
    setupContactModal();
    console.log('🎉 Site initialisé avec succès !');
});