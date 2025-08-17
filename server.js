const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 8000;

// Servir les fichiers statiques
app.use(express.static(__dirname));

// Proxy des requêtes API vers le backend Next.js (port 3000)
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    // Optionnel: log utile en dev
    logLevel: 'warn',
}));

// Proxy de compatibilité: certaines anciennes parties du front peuvent appeler sans le préfixe /api
const legacyPaths = ['/ninjas', '/ninjas/**', '/clans', '/clans/**', '/kekkei', '/kekkei/**'];
app.use(legacyPaths, createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    logLevel: 'warn',
    pathRewrite: (path, req) => {
        // Réécrit /ninjas -> /api/ninjas, etc.
        if (path.startsWith('/ninjas')) return path.replace(/^\/ninjas/, '/api/ninjas');
        if (path.startsWith('/clans')) return path.replace(/^\/clans/, '/api/clans');
        if (path.startsWith('/kekkei')) return path.replace(/^\/kekkei/, '/api/kekkei');
        return path;
    },
    onError(err, req, res) {
        console.error('Proxy error:', err.message, 'for', req.method, req.originalUrl);
        if (!res.headersSent) {
            res.status(502).send(`Proxy error: ${err.message}`);
        }
    }
}));

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
