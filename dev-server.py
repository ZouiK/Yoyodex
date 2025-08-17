#!/usr/bin/env python3
import http.server
import socketserver
import os
import webbrowser
from urllib.parse import urlparse

PORT = 8000

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Désactiver le cache pour tous les fichiers
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        # Log personnalisé
        print(f"🌐 {self.address_string()} - {format % args}")

if __name__ == "__main__":
    # Changer vers le dossier du script
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
        print(f"🚀 Serveur de développement démarré sur http://localhost:{PORT}")
        print(f"📁 Dossier racine: {os.getcwd()}")
        print(f"🔄 Rechargez la page pour voir les changements")
        print(f"💡 Conseil: Utilisez Ctrl+F5 pour forcer le rechargement si nécessaire")
        print(f"🛑 Appuyez sur Ctrl+C pour arrêter le serveur")
        
        # Ouvrir automatiquement le navigateur
        webbrowser.open(f'http://localhost:{PORT}')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Serveur arrêté")
            httpd.shutdown()
