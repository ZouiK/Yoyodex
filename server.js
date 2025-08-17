const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Servir les fichiers statiques
app.use(express.static(__dirname));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware pour ajouter les headers de cache-control
app.use((req, res, next) => {
    // Désactiver le cache pour les fichiers de développement
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur de développement démarré sur http://localhost:${PORT}`);
    console.log(`📁 Dossier racine: ${__dirname}`);
    console.log(`🔄 Rechargez la page pour voir les changements`);
    console.log(`💡 Conseil: Utilisez Ctrl+F5 pour forcer le rechargement si nécessaire`);
});
