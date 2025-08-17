// Code d'accès administrateur (à changer selon vos besoins)
const ADMIN_CODE = "1234";

// Configuration API
const API_BASE_URL = '/api';

// Gestion Basic Auth côté client pour les opérations d'écriture
function getStoredAdminCreds() {
    const user = sessionStorage.getItem('ADMIN_USER') || '';
    const pass = sessionStorage.getItem('ADMIN_PASS') || '';
    return { user, pass };
}

function promptForAdminCreds() {
    const user = prompt('Nom d\'utilisateur admin (ADMIN_USER) :');
    const pass = prompt('Mot de passe admin (ADMIN_PASS) :');
    if (user && pass) {
        sessionStorage.setItem('ADMIN_USER', user);
        sessionStorage.setItem('ADMIN_PASS', pass);
        return { user, pass };
    }
    return { user: '', pass: '' };
}

function buildBasicAuthHeader() {
    let { user, pass } = getStoredAdminCreds();
    if (!user || !pass) {
        ({ user, pass } = promptForAdminCreds());
    }
    if (user && pass) {
        const token = btoa(`${user}:${pass}`);
        return `Basic ${token}`;
    }
    return '';
}

async function parseResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        try {
            return await response.json();
        } catch (_) {
            return null;
        }
    } else {
        try {
            const text = await response.text();
            return text;
        } catch (_) {
            return null;
        }
    }
}

// Fonctions utilitaires pour les requêtes API
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = (options.method || 'GET').toUpperCase();
    const isWrite = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    // Ajouter Basic Auth pour les écritures si manquant
    if (isWrite && !headers['Authorization'] && !headers['authorization']) {
        const auth = buildBasicAuthHeader();
        if (auth) headers['Authorization'] = auth;
    }

    const config = { ...options, method, headers };

    try {
        let response = await fetch(url, config);
        // Gestion du 401 pour réessayer une fois avec des nouveaux identifiants
        if (isWrite && response.status === 401) {
            // forcer repropmpt
            sessionStorage.removeItem('ADMIN_USER');
            sessionStorage.removeItem('ADMIN_PASS');
            const auth = buildBasicAuthHeader();
            if (auth) {
                config.headers['Authorization'] = auth;
                response = await fetch(url, config);
            }
        }

        const payload = await parseResponse(response);
        if (!response.ok) {
            const message = (payload && payload.error) || (typeof payload === 'string' ? payload : `HTTP error! status: ${response.status}`);
            throw new Error(message);
        }
        return payload;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

function showToast(message, type = 'success') {
    const existingToast = document.getElementById('toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: ${type === 'success' ? '#4caf50' : '#f44336'}; color: white; padding: 15px 20px; border-radius: 5px; z-index: 10000; max-width: 300px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}" style="margin-right: 10px;"></i>
            ${message}
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

// Éléments DOM
const loginSection = document.getElementById('loginSection');
const adminPanel = document.getElementById('adminPanel');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminCodeInput = document.getElementById('adminCode');
const errorMessage = document.getElementById('errorMessage');
const logoutBtn = document.getElementById('logoutBtn');

// Vérifier si l'utilisateur est déjà connecté
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isLoggedIn === 'true') {
        showAdminPanel();
    }
});

// Gestion de la soumission du formulaire de connexion
adminLoginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const enteredCode = adminCodeInput.value.trim();
    
    if (enteredCode === ADMIN_CODE) {
        // Code correct - connecter l'utilisateur
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        hideErrorMessage();
        adminCodeInput.value = '';
    } else {
        // Code incorrect - afficher l'erreur
        showErrorMessage();
        adminCodeInput.value = '';
        adminCodeInput.focus();
    }
});

// Gestion de la déconnexion
logoutBtn.addEventListener('click', function() {
    sessionStorage.removeItem('adminLoggedIn');
    showLoginSection();
});

// Fonctions d'affichage
function showAdminPanel() {
    loginSection.style.display = 'none';
    adminPanel.style.display = 'block';
}

function showLoginSection() {
    loginSection.style.display = 'block';
    adminPanel.style.display = 'none';
}

function showErrorMessage() {
    errorMessage.style.display = 'flex';
}

function hideErrorMessage() {
    errorMessage.style.display = 'none';
}

// Gestion des touches pour le formulaire
adminCodeInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        adminLoginForm.dispatchEvent(new Event('submit'));
    }
});

// Focus automatique sur le champ de code
adminCodeInput.focus();

// Protection contre l'inspection du code source (basique)
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    // Désactiver F12, Ctrl+Shift+I, Ctrl+U
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
    }
});

// ===== GESTIONNAIRES =====

// Variables globales pour la gestion
let currentEditingId = null;
let currentEditingType = null;

// ===== SYSTÈME DE POP-UPS DE CONFIRMATION =====

// Éléments du modal de confirmation
const confirmationModal = document.getElementById('confirmationModal');
const confirmationIcon = document.getElementById('confirmationIcon');
const confirmationTitle = document.getElementById('confirmationTitle');
const confirmationMessage = document.getElementById('confirmationMessage');
const confirmationConfirm = document.getElementById('confirmationConfirm');
const confirmationCancel = document.getElementById('confirmationCancel');

// Fonction pour afficher un pop-up de confirmation
function showConfirmation(options) {
    return new Promise((resolve) => {
        // Configuration du modal
        confirmationIcon.className = `confirmation-icon fas ${options.icon || 'fa-exclamation-triangle'} ${options.iconType || 'warning'}`;
        confirmationTitle.textContent = options.title || 'Confirmer l\'action';
        confirmationMessage.textContent = options.message || 'Êtes-vous sûr de vouloir effectuer cette action ?';
        
        // Configuration des boutons
        confirmationConfirm.innerHTML = `<i class="fas ${options.confirmIcon || 'fa-check'}"></i> ${options.confirmText || 'Confirmer'}`;
        confirmationCancel.innerHTML = `<i class="fas fa-times"></i> ${options.cancelText || 'Annuler'}`;
        
        // Affichage du modal
        confirmationModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Gestionnaires d'événements
        const handleConfirm = () => {
            hideConfirmation();
            resolve(true);
        };
        
        const handleCancel = () => {
            hideConfirmation();
            resolve(false);
        };
        
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleCancel();
            }
        };
        
        // Ajouter les event listeners
        confirmationConfirm.onclick = handleConfirm;
        confirmationCancel.onclick = handleCancel;
        document.addEventListener('keydown', handleEscape);
        
        // Nettoyer les event listeners après fermeture
        const cleanup = () => {
            confirmationConfirm.onclick = null;
            confirmationCancel.onclick = null;
            document.removeEventListener('keydown', handleEscape);
        };
        
        // Stocker la fonction de nettoyage
        confirmationModal.cleanup = cleanup;
    });
}

// Fonction pour masquer le pop-up de confirmation
function hideConfirmation() {
    confirmationModal.classList.remove('show');
    document.body.style.overflow = 'auto';
    
    // Nettoyer les event listeners
    if (confirmationModal.cleanup) {
        confirmationModal.cleanup();
        delete confirmationModal.cleanup;
    }
}

// Fonction pour afficher un pop-up de succès
function showSuccess(message, title = 'Succès') {
    return showConfirmation({
        title: title,
        message: message,
        icon: 'fa-check-circle',
        iconType: 'success',
        confirmText: 'OK',
        confirmIcon: 'fa-check'
    }).then(() => {
        // Ne pas afficher le bouton annuler pour les succès
        confirmationCancel.style.display = 'none';
        return true;
    });
}

// Fonction pour afficher un pop-up de suppression
function showDeleteConfirmation(itemName, itemType = 'élément') {
    return showConfirmation({
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer ${itemType} "${itemName}" ? Cette action est irréversible.`,
        icon: 'fa-trash-alt',
        iconType: 'warning',
        confirmText: 'Supprimer',
        confirmIcon: 'fa-trash-alt',
        cancelText: 'Annuler'
    });
}

// Clic en dehors du modal pour fermer
confirmationModal.addEventListener('click', (e) => {
    if (e.target === confirmationModal) {
        hideConfirmation();
        if (confirmationModal.cleanup) {
            confirmationModal.cleanup();
        }
    }
});

// Ouverture des gestionnaires
function openShinobiManager() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('shinobiManager').style.display = 'block';
    renderShinobiList();
}

function openClanManager() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('clanManager').style.display = 'block';
    renderClanList();
}

function openKekkeiManager() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('kekkeiManager').style.display = 'block';
    renderKekkeiList();
}

// Fermeture des gestionnaires
function closeShinobiManager() {
    document.getElementById('shinobiManager').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}

function closeClanManager() {
    document.getElementById('clanManager').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}

function closeKekkeiManager() {
    document.getElementById('kekkeiManager').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}

// ===== GESTION DES SHINOBI =====

async function renderShinobiList() {
    const container = document.getElementById('shinobiList');
    container.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Chargement...</div>';
    
    try {
        const data = await apiRequest('/ninjas?limit=100');
        container.innerHTML = '';
        
        if (data.items && data.items.length > 0) {
            data.items.forEach(shinobi => {
                const card = document.createElement('div');
                card.className = 'admin-item-card';
                card.innerHTML = `
                    <div class="admin-item-image">
                        <img src="${shinobi.image_url || `https://via.placeholder.com/80x80/1a1f2e/c8aa6e?text=${encodeURIComponent(shinobi.name.charAt(0))}`}" alt="${shinobi.name}" onerror="this.src='https://via.placeholder.com/80x80/1a1f2e/c8aa6e?text=${encodeURIComponent(shinobi.name.charAt(0))}'">
                    </div>
                    <div class="admin-item-info">
                        <h4>${shinobi.name}</h4>
                        <p><strong>Rang:</strong> ${shinobi.grade || 'N/A'}</p>
                        <p><strong>Village:</strong> ${shinobi.village}</p>
                        <p><strong>Description:</strong> ${shinobi.description || 'Aucune'}</p>
                    </div>
                    <div class="admin-item-actions">
                        <button class="admin-edit-btn" onclick="editShinobi('${shinobi.id}')">
                            <i class="fas fa-edit"></i>
                            Modifier
                        </button>
                        <button class="admin-delete-btn" onclick="deleteShinobi('${shinobi.id}')">
                            <i class="fas fa-trash"></i>
                            Supprimer
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Aucun shinobi trouvé</div>';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des shinobis:', error);
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44336;">Erreur lors du chargement des données</div>';
        showToast('Erreur lors du chargement des shinobis', 'error');
    }
}

async function openShinobiForm(shinobiId = null) {
    const form = document.getElementById('shinobiForm');
    const title = document.getElementById('shinobiFormTitle');
    
    if (shinobiId) {
        // Mode édition
        try {
            const shinobi = await apiRequest(`/ninjas/${shinobiId}`);
            currentEditingId = shinobiId;
            currentEditingType = 'shinobi';
            title.textContent = 'Modifier le Shinobi';
            populateShinobiForm(shinobi);
        } catch (error) {
            showToast('Erreur lors du chargement du shinobi', 'error');
            return;
        }
    } else {
        // Mode ajout
        currentEditingId = null;
        currentEditingType = null;
        title.textContent = 'Ajouter un Shinobi';
        clearShinobiForm();
    }
    
    form.style.display = 'block';
}

function closeShinobiForm() {
    document.getElementById('shinobiForm').style.display = 'none';
    currentEditingId = null;
    currentEditingType = null;
}

function populateShinobiForm(shinobi) {
    document.getElementById('shinobiName').value = shinobi.name || '';
    document.getElementById('shinobiTitle').value = shinobi.grade || '';
    document.getElementById('shinobiRank').value = shinobi.grade || '';
    document.getElementById('shinobiVillage').value = shinobi.village || '';
    document.getElementById('shinobiClan').value = shinobi.clan_id || '';
    document.getElementById('shinobiImage').value = shinobi.image_url || '';
    document.getElementById('shinobiDescription').value = shinobi.description || '';
}

function clearShinobiForm() {
    document.getElementById('shinobiFormElement').reset();
}

async function deleteShinobi(shinobiId) {
    try {
        const shinobi = await apiRequest(`/ninjas/${shinobiId}`);
        const confirmed = await showDeleteConfirmation(shinobi.name, 'le shinobi');
        if (confirmed) {
            await apiRequest(`/ninjas/${shinobiId}`, { method: 'DELETE' });
            renderShinobiList();
            showToast('Shinobi supprimé avec succès !');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showToast('Erreur lors de la suppression du shinobi', 'error');
    }
}

    function openClanForm(clanId = null) {
        const form = document.getElementById('clanForm');
        const title = document.getElementById('clanFormTitle');
        
        if (clanId) {
            // Mode édition
            const clan = CLAN_DATA.find(c => c.id === clanId);
            if (clan) {
                currentEditingId = clanId;
                currentEditingType = 'clan';
                title.textContent = 'Modifier le Clan';
                populateClanForm(clan);
            }
        } else {
            // Mode ajout
            currentEditingId = null;
            currentEditingType = null;
            title.textContent = 'Ajouter un Clan';
            clearClanForm();
        }
        
        form.style.display = 'block';
    }

    function closeClanForm() {
        document.getElementById('clanForm').style.display = 'none';
        currentEditingId = null;
        currentEditingType = null;
    }

// ===== GESTION DES CLANS =====

async function renderClanList() {
    const container = document.getElementById('clanList');
    container.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Chargement...</div>';
    
    try {
        const data = await apiRequest('/clans?limit=100');
        container.innerHTML = '';
        
        if (data.items && data.items.length > 0) {
            data.items.forEach(clan => {
                const card = document.createElement('div');
                card.className = 'admin-item-card';
                card.innerHTML = `
                    <div class="admin-item-image">
                        <img src="${clan.image_url || `https://via.placeholder.com/80x80/1a1f2e/c8aa6e?text=${encodeURIComponent(clan.name.charAt(0))}`}" alt="${clan.name}" onerror="this.src='https://via.placeholder.com/80x80/1a1f2e/c8aa6e?text=${encodeURIComponent(clan.name.charAt(0))}'">
                    </div>
                    <div class="admin-item-info">
                        <h4>${clan.name}</h4>
                        <p><strong>Village:</strong> ${clan.village_origin || 'N/A'}</p>
                        <p><strong>Description:</strong> ${clan.description || 'Aucune'}</p>
                    </div>
                    <div class="admin-item-actions">
                        <button class="admin-edit-btn" onclick="editClan('${clan.id}')">
                            <i class="fas fa-edit"></i>
                            Modifier
                        </button>
                        <button class="admin-delete-btn" onclick="deleteClan('${clan.id}')">
                            <i class="fas fa-trash"></i>
                            Supprimer
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Aucun clan trouvé</div>';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des clans:', error);
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44336;">Erreur lors du chargement des données</div>';
        showToast('Erreur lors du chargement des clans', 'error');
    }
}

async function openClanForm(clanId = null) {
    const form = document.getElementById('clanForm');
    const title = document.getElementById('clanFormTitle');
    
    if (clanId) {
        // Mode édition
        try {
            const clan = await apiRequest(`/clans/${clanId}`);
            currentEditingId = clanId;
            currentEditingType = 'clan';
            title.textContent = 'Modifier le Clan';
            populateClanForm(clan);
        } catch (error) {
            showToast('Erreur lors du chargement du clan', 'error');
            return;
        }
    } else {
        // Mode ajout
        currentEditingId = null;
        currentEditingType = null;
        title.textContent = 'Ajouter un Clan';
        clearClanForm();
    }
    
    form.style.display = 'block';
}

function closeClanForm() {
    document.getElementById('clanForm').style.display = 'none';
    currentEditingId = null;
    currentEditingType = null;
}

function populateClanForm(clan) {
    document.getElementById('clanName').value = clan.name || '';
    document.getElementById('clanTitle').value = clan.name || '';
    document.getElementById('clanVillage').value = clan.village_origin || '';
    document.getElementById('clanDescription').value = clan.description || '';
    document.getElementById('clanImage').value = clan.image_url || '';
}

function clearClanForm() {
    document.getElementById('clanFormElement').reset();
}

async function deleteClan(clanId) {
    try {
        const clan = await apiRequest(`/clans/${clanId}`);
        const confirmed = await showDeleteConfirmation(clan.name, 'le clan');
        if (confirmed) {
            await apiRequest(`/clans/${clanId}`, { method: 'DELETE' });
            renderClanList();
            showToast('Clan supprimé avec succès !');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showToast('Erreur lors de la suppression du clan', 'error');
    }
}

// ===== GESTION DES KEKKEI GENKAI =====

async function renderKekkeiList() {
    const container = document.getElementById('kekkeiList');
    container.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Chargement...</div>';
    
    try {
        const data = await apiRequest('/kekkei?limit=100');
        container.innerHTML = '';
        
        if (data.items && data.items.length > 0) {
            data.items.forEach(kekkei => {
                const card = document.createElement('div');
                card.className = 'admin-item-card';
                card.innerHTML = `
                    <div class="admin-item-image">
                        <img src="${kekkei.image_url || `https://via.placeholder.com/80x80/1a1f2e/c8aa6e?text=${encodeURIComponent(kekkei.name.charAt(0))}`}" alt="${kekkei.name}" onerror="this.src='https://via.placeholder.com/80x80/1a1f2e/c8aa6e?text=${encodeURIComponent(kekkei.name.charAt(0))}'">
                    </div>
                    <div class="admin-item-info">
                        <h4>${kekkei.name}</h4>
                        <p><strong>Rareté:</strong> ${kekkei.rarete || 'N/A'}</p>
                        <p><strong>Description:</strong> ${kekkei.description || 'Aucune'}</p>
                    </div>
                    <div class="admin-item-actions">
                        <button class="admin-edit-btn" onclick="editKekkei('${kekkei.id}')">
                            <i class="fas fa-edit"></i>
                            Modifier
                        </button>
                        <button class="admin-delete-btn" onclick="deleteKekkei('${kekkei.id}')">
                            <i class="fas fa-trash"></i>
                            Supprimer
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        } else {
            container.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">Aucun Kekkei Genkai trouvé</div>';
        }
    } catch (error) {
        console.error('Erreur lors du chargement des Kekkei Genkai:', error);
        container.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44336;">Erreur lors du chargement des données</div>';
        showToast('Erreur lors du chargement des Kekkei Genkai', 'error');
    }
}

async function openKekkeiForm(kekkeiId = null) {
    const form = document.getElementById('kekkeiForm');
    const title = document.getElementById('kekkeiFormTitle');
    
    if (kekkeiId) {
        // Mode édition
        try {
            const kekkei = await apiRequest(`/kekkei/${kekkeiId}`);
            currentEditingId = kekkeiId;
            currentEditingType = 'kekkei';
            title.textContent = 'Modifier le Kekkei Genkai';
            populateKekkeiForm(kekkei);
        } catch (error) {
            showToast('Erreur lors du chargement du Kekkei Genkai', 'error');
            return;
        }
    } else {
        // Mode ajout
        currentEditingId = null;
        currentEditingType = null;
        title.textContent = 'Ajouter un Kekkei Genkai';
        clearKekkeiForm();
    }
    
    form.style.display = 'block';
}

function closeKekkeiForm() {
    document.getElementById('kekkeiForm').style.display = 'none';
    currentEditingId = null;
    currentEditingType = null;
}

function populateKekkeiForm(kekkei) {
    document.getElementById('kekkeiName').value = kekkei.name || '';
    document.getElementById('kekkeiType').value = 'Kekkei Genkai';
    document.getElementById('kekkeiDescription').value = kekkei.description || '';
    document.getElementById('kekkeiClan').value = '';
    document.getElementById('kekkeiRarity').value = kekkei.rarete || '';
    document.getElementById('kekkeiImage').value = kekkei.image_url || '';
}

function clearKekkeiForm() {
    document.getElementById('kekkeiFormElement').reset();
}

async function deleteKekkei(kekkeiId) {
    try {
        const kekkei = await apiRequest(`/kekkei/${kekkeiId}`);
        const confirmed = await showDeleteConfirmation(kekkei.name, 'le Kekkei Genkai');
        if (confirmed) {
            await apiRequest(`/kekkei/${kekkeiId}`, { method: 'DELETE' });
            renderKekkeiList();
            showToast('Kekkei Genkai supprimé avec succès !');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        showToast('Erreur lors de la suppression du Kekkei Genkai', 'error');
    }
}

// ===== FONCTIONS D'ÉDITION =====

function editShinobi(shinobiId) {
    openShinobiForm(shinobiId);
}

function editClan(clanId) {
    openClanForm(clanId);
}

function editKekkei(kekkeiId) {
    openKekkeiForm(kekkeiId);
}

// ===== GESTION DES FORMULAIRES =====

// Gestion de la soumission du formulaire Shinobi
document.getElementById('shinobiFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const shinobiData = {
        name: formData.get('name'),
        grade: formData.get('rank'),
        village: formData.get('village'),
        clan_id: formData.get('clan') || null,
        kekkei_id: null,
        image_url: formData.get('image') || null,
        description: formData.get('description')
    };
    
    try {
        if (currentEditingId) {
            // Modification
            await apiRequest(`/ninjas/${currentEditingId}`, {
                method: 'PATCH',
                body: JSON.stringify(shinobiData)
            });
            showToast('Shinobi modifié avec succès !');
        } else {
            // Ajout
            await apiRequest('/ninjas', {
                method: 'POST',
                body: JSON.stringify(shinobiData)
            });
            showToast('Shinobi ajouté avec succès !');
        }
        
        closeShinobiForm();
        renderShinobiList();
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showToast(`Erreur lors de la sauvegarde: ${error.message}`, 'error');
    }
});

// Gestion de la soumission du formulaire Clan
document.getElementById('clanFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const clanData = {
        name: formData.get('name'),
        description: formData.get('description'),
        village_origin: formData.get('village'),
        image_url: formData.get('image') || null
    };
    
    try {
        if (currentEditingId) {
            // Modification
            await apiRequest(`/clans/${currentEditingId}`, {
                method: 'PATCH',
                body: JSON.stringify(clanData)
            });
            showToast('Clan modifié avec succès !');
        } else {
            // Ajout
            await apiRequest('/clans', {
                method: 'POST',
                body: JSON.stringify(clanData)
            });
            showToast('Clan ajouté avec succès !');
        }
        
        closeClanForm();
        renderClanList();
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showToast(`Erreur lors de la sauvegarde: ${error.message}`, 'error');
    }
});

// Gestion de la soumission du formulaire Kekkei Genkai
document.getElementById('kekkeiFormElement').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const kekkeiData = {
        name: formData.get('name'),
        rarete: formData.get('rarity'),
        description: formData.get('description'),
        image_url: formData.get('image') || null
    };
    
    try {
        if (currentEditingId) {
            // Modification
            await apiRequest(`/kekkei/${currentEditingId}`, {
                method: 'PATCH',
                body: JSON.stringify(kekkeiData)
            });
            showToast('Kekkei Genkai modifié avec succès !');
        } else {
            // Ajout
            await apiRequest('/kekkei', {
                method: 'POST',
                body: JSON.stringify(kekkeiData)
            });
            showToast('Kekkei Genkai ajouté avec succès !');
        }
        
        closeKekkeiForm();
        renderKekkeiList();
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        showToast(`Erreur lors de la sauvegarde: ${error.message}`, 'error');
    }
});
