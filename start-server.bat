@echo off
echo ========================================
echo    SERVEUR DE DEVELOPPEMENT YOYODATA
echo ========================================
echo.
echo Demarrage du serveur HTTP sur le port 8000...
echo.
echo Fichiers disponibles :
echo - Interface Admin : http://localhost:8000/admin.html
echo - Demonstration : http://localhost:8000/demo-admin.html
echo - Test Simple : http://localhost:8000/test-simple.html
echo - Site Principal : http://localhost:8000/index.html
echo.
echo Code d'acces admin : 1234
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo ========================================
echo.
python -m http.server 8000
pause
