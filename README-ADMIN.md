# Site Naruto RP - Yoyodata

## 🎯 Description

Site web pour une communauté de roleplay Naruto permettant de consulter et gérer une base de données de personnages, clans et capacités spéciales (Kekkei Genkai).

## 🏗️ Structure du Projet

### Fichiers Principaux
- **`index.html`** : Page d'accueil avec navigation entre shinobis, clans et kekkei genkai
- **`admin.html`** : Interface d'administration sécurisée
- **`script.js`** : Logique JavaScript principale du site
- **`admin.js`** : Fonctionnalités d'administration
- **`admin-data.js`** : Base de données des personnages, clans et kekkei genkai
- **`styles.css`** : Styles CSS complets
- **`sw.js`** : Service Worker pour la mise en cache

### Serveur de Développement
- **`server.js`** : Serveur Express.js simple
- **`start-server.bat`** : Script de démarrage Windows

## 🚀 Installation et Démarrage

### Méthode 1 : Serveur Node.js
```bash
npm install
npm start
```

### Méthode 2 : Script Windows
Double-cliquez sur `start-server.bat`

Le site sera accessible sur `http://localhost:8000`

## 🔐 Administration

1. Accédez à `http://localhost:8000/admin.html`
2. Entrez le code d'accès : **1234**
3. Gérez les shinobis, clans et kekkei genkai

## 📋 Gestion des Shinobis

### Liste des Shinobis
- Affichage de tous les shinobis avec image, nom, rang, village et clan
- Boutons "Modifier" et "Supprimer" pour chaque personnage

### Formulaire d'ajout/modification
Champs disponibles :
- **Informations de base** : Nom, nom de fichier, titre, rang, village, clan
- **Image** : Nom du fichier image (ex: `nom_personnage.jpg`)
- **Description** : Description courte du personnage

## 🏰 Gestion des Clans

### Liste des Clans
- Affichage de tous les clans avec image, nom, village et kekkei genkai
- Boutons "Modifier" et "Supprimer" pour chaque clan

### Formulaire d'ajout/modification
Champs disponibles :
- **Informations de base** : Nom, nom de fichier, titre, village
- **Description** : Description du clan
- **Historique** : Histoire et origines du clan
- **Image** : Nom du fichier image (ex: `nom_clan.png`)
- **Kekkei Genkai** : Capacités spéciales du clan
- **Techniques** : Techniques caractéristiques du clan
- **Membres** : Membres notables du clan
- **Symbole et couleurs** : Identité visuelle du clan
- **Capacités spéciales** : Pouvoirs uniques du clan

## ✨ Gestion des Kekkei Genkai

### Liste des Kekkei Genkai
- Affichage de tous les kekkei genkai avec type, clan et rareté
- Boutons "Modifier" et "Supprimer" pour chaque capacité

### Formulaire d'ajout/modification
Champs disponibles :
- **Informations de base** : Nom, type, clan, rareté
- **Description** : Description détaillée de la capacité
- **Image** : Nom du fichier image (ex: `nom_kekkei.png`)
- **Capacités** : Pouvoirs offerts par le kekkei genkai
- **Évolution** : Stades d'évolution de la capacité
- **Utilisateurs** : Personnages possédant cette capacité
- **Activation** : Conditions d'activation
- **Forces et faiblesses** : Avantages et inconvénients

## 🎨 Interface

### Design
- Interface moderne et responsive
- Thème sombre avec accents dorés
- Animations et transitions fluides
- Compatible mobile et desktop

### Navigation
- **Panel principal** : Vue d'ensemble avec accès aux gestionnaires
- **Gestionnaires** : Interface dédiée à chaque type de contenu
- **Formulaires** : Modales pour ajouter/modifier les éléments
- **Bouton retour** : Retour facile au panel principal

## 📱 Responsive

L'interface s'adapte automatiquement :
- **Desktop** : Affichage en grille avec formulaires côte à côte
- **Tablet** : Adaptation des layouts et tailles
- **Mobile** : Interface optimisée pour petits écrans

## 🔧 Utilisation

### Ajouter un élément
1. Cliquez sur le bouton "Ajouter un [Type]"
2. Remplissez le formulaire
3. Cliquez sur "Enregistrer"

### Modifier un élément
1. Cliquez sur "Modifier" dans la liste
2. Le formulaire se remplit avec les données existantes
3. Modifiez les champs souhaités
4. Cliquez sur "Enregistrer"

### Supprimer un élément
1. Cliquez sur "Supprimer" dans la liste
2. Confirmez la suppression
3. L'élément est supprimé définitivement

## 📁 Structure des fichiers

- `admin.html` : Interface principale
- `admin.js` : Logique JavaScript
- `admin-data.js` : Données des éléments
- `styles.css` : Styles CSS (section administration)

## 🚨 Sécurité

- Code d'accès requis pour l'administration
- Session persistante jusqu'à déconnexion
- Protection basique contre l'inspection du code

## 💡 Conseils

- Sauvegardez régulièrement vos données
- Vérifiez les noms de fichiers d'images
- Utilisez des virgules pour séparer les listes
- Testez sur différents appareils

---

**Note** : Cette interface est en cours de développement. N'hésitez pas à signaler les bugs ou à suggérer des améliorations !

