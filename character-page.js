// Données des personnages
const charactersData = {
    'wallace': {
        name: 'Wallace',
        title: 'Inventeur',
        village: 'Village Caché de la Feuille',
        image: 'img/wallace.jpg',
        tags: ['Inventeur', 'Génie', 'Fromage'],
        stats: {
            strength: 4,
            agility: 3,
            intelligence: 9,
            chakra: 2,
            technique: 8,
            experience: 7
        },
        history: [
            'Inventeur de génie originaire du Village Caché de la Feuille, Wallace est connu pour ses créations mécaniques révolutionnaires. Son amour du fromage et sa curiosité naturelle l\'ont souvent mené dans des aventures extraordinaires.',
            'Avec son fidèle compagnon Gromit, il a résolu de nombreux mystères et sauvé le village à plusieurs reprises. Ses inventions, bien que parfois chaotiques, ont toujours un but noble et démontrent son génie créatif exceptionnel.'
        ],
        techniques: [
            {
                name: 'Invention Mécanique',
                description: 'Capacité à créer des machines complexes en un temps record, souvent avec des matériaux de récupération.',
                icon: 'fas fa-cogs'
            },
            {
                name: 'Résolution de Problèmes',
                description: 'Analyse rapide des situations et élaboration de solutions créatives face aux défis les plus complexes.',
                icon: 'fas fa-lightbulb'
            },
            {
                name: 'Persévérance',
                description: 'Ne renonce jamais face aux défis les plus difficiles, même quand ses inventions ne fonctionnent pas comme prévu.',
                icon: 'fas fa-heart'
            }
        ]
    },
    'gromit': {
        name: 'Gromit',
        title: 'Chien Intelligent',
        village: 'Village Caché de la Feuille',
        image: 'img/gromit.jpg',
        tags: ['Chien', 'Intelligent', 'Loyal'],
        stats: {
            strength: 6,
            agility: 8,
            intelligence: 7,
            chakra: 3,
            technique: 5,
            experience: 6
        },
        history: [
            'Chien intelligent et loyal, Gromit est le partenaire inséparable de Wallace. Doté d\'une intelligence exceptionnelle et d\'une capacité d\'analyse remarquable, il est souvent le cerveau derrière les opérations de sauvetage.',
            'Sa patience et sa sagesse en font un allié précieux dans les moments difficiles. Bien qu\'il ne parle pas, sa communication silencieuse avec Wallace est parfaite.'
        ],
        techniques: [
            {
                name: 'Communication Silencieuse',
                description: 'Peut transmettre des informations complexes sans parler, grâce à une communication non-verbale parfaite.',
                icon: 'fas fa-comments'
            },
            {
                name: 'Analyse Tactique',
                description: 'Évalue rapidement les forces et faiblesses de ses adversaires, permettant des stratégies efficaces.',
                icon: 'fas fa-chess'
            },
            {
                name: 'Loyauté Absolue',
                description: 'Protège ses alliés jusqu\'au bout, peu importe les circonstances et les dangers encourus.',
                icon: 'fas fa-shield-alt'
            }
        ]
    }
};

// Fonction pour charger les données du personnage
function loadCharacterData() {
    // Récupérer le nom du personnage depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const characterName = urlParams.get('character') || 'wallace';
    
    const character = charactersData[characterName];
    if (!character) {
        console.error('Personnage non trouvé:', characterName);
        return;
    }
    
    // Mettre à jour le titre de la page
    document.title = `${character.name} - Yoyodex`;
    
    // Mettre à jour l'image
    const characterImage = document.getElementById('characterImage');
    if (characterImage) {
        characterImage.src = character.image;
        characterImage.alt = character.name;
    }
    
    // Mettre à jour les informations principales
    document.getElementById('characterName').textContent = character.name;
    document.getElementById('characterTitle').textContent = character.title;
    document.getElementById('characterVillage').textContent = character.village;
    
    // Mettre à jour les tags
    const tagsContainer = document.querySelector('.character-tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = character.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
    }
    
    // Mettre à jour les statistiques
    updateStats(character.stats);
    
    // Mettre à jour l'histoire
    updateHistory(character.history);
    
    // Mettre à jour les techniques
    updateTechniques(character.techniques);
}

// Fonction pour mettre à jour les statistiques
function updateStats(stats) {
    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return;
    
    const statNames = {
        strength: 'Force',
        agility: 'Agilité',
        intelligence: 'Intelligence',
        chakra: 'Chakra',
        technique: 'Technique',
        experience: 'Expérience'
    };
    
    statsGrid.innerHTML = Object.entries(stats).map(([key, value]) => `
        <div class="stat-item">
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${value * 10}%"></div>
            </div>
            <div class="stat-info">
                <span class="stat-name">${statNames[key]}</span>
                <span class="stat-value">${value}/10</span>
            </div>
        </div>
    `).join('');
}

// Fonction pour mettre à jour l'histoire
function updateHistory(history) {
    const sectionContent = document.querySelector('.section-content');
    if (!sectionContent) return;
    
    sectionContent.innerHTML = history.map(paragraph => 
        `<p>${paragraph}</p>`
    ).join('');
}

// Fonction pour mettre à jour les techniques
function updateTechniques(techniques) {
    const techniquesGrid = document.querySelector('.techniques-grid');
    if (!techniquesGrid) return;
    
    techniquesGrid.innerHTML = techniques.map(technique => `
        <div class="technique-card">
            <div class="technique-icon">
                <i class="${technique.icon}"></i>
            </div>
            <h3>${technique.name}</h3>
            <p>${technique.description}</p>
        </div>
    `).join('');
}

// Animation des barres de statistiques
function animateStats() {
    const statFills = document.querySelectorAll('.stat-fill');
    statFills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = width;
        }, 500);
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadCharacterData();
    
    // Animer les statistiques après un délai
    setTimeout(animateStats, 1000);
    
    // Animation au scroll pour les sections
    const sections = document.querySelectorAll('.character-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });
}); 