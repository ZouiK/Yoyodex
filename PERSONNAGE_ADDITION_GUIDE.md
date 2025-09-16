# GUIDE COMPLET POUR AJOUTER UN PERSONNAGE AU SITE NARUTO RP

## 📋 INTRODUCTION
Ce guide explique étape par étape comment ajouter un nouveau personnage au site Naruto RP. Suivez précisément ces instructions pour éviter toutes les erreurs courantes.

## 🗂️ STRUCTURE DU SITE
Le site utilise 2 fichiers principaux pour gérer les personnages :
- `script.js` : Données principales pour l'affichage des cartes et le filtrage
- `character-detail.js` : Données détaillées pour la fiche d'information du personnage

## 📝 ÉTAPE 1: AJOUTER LE PERSONNAGE DANS `script.js`

### 1.1 Localiser la section `charactersData`
Cherchez ce bloc de code dans `script.js` :
```javascript
const charactersData = [
    {
        name: "Wallace Uchiha",
        dataName: "wallace_uchiha",
        title: "Hokage",
        description: "Inventeur génial et amateur de fromage...",
        village: "konoha",
        clan: "uchiha"
    },
    // ... autres personnages
];
```

### 1.2 Ajouter le nouveau personnage
Ajoutez votre personnage AVANT la fermeture du tableau `];` :

```javascript
{
    name: "Nom Complet du Personnage",
    dataName: "nom_en_minuscule_avec_underscores",
    title: "Grade Exact",
    description: "Description brève pour la carte",
    village: "village_code",
    clan: "clan_code" ou null,
    customTitle: "Titre Personnalisé" (optionnel)
},
```

### 1.3 Champs obligatoires et leurs règles :
- **`name`** : Nom complet du personnage (string)
  - ✅ Correct : `"Stann Bibiche"`
  - ❌ Incorrect : `Stann Bibiche` (sans guillemets)

- **`dataName`** : Identifiant unique en minuscules avec underscores
  - ✅ Correct : `"stann_bibiche"`
  - ❌ Incorrect : `"Stann-Bibiche"`, `"stann bibiche"`

- **`title`** : Grade EXACTEMENT comme dans les hiérarchies
  - ✅ Correct : `"Genin Confirmé"`
  - ❌ Incorrect : `"genin confirmé"`, `"Genin confirmé"`

- **`description`** : Description courte (1-2 phrases)
  - ✅ Correct : `"Shinobi de Sunagakure, spécialiste de l'art culinaire."`
  - ❌ Incorrect : Description trop longue ou vide

- **`village`** : Code du village en minuscules
  - ✅ Correct : `"suna"`, `"konoha"`, `"oto"`
  - ❌ Incorrect : `"Sunagakure"`, `"SUNA"`

- **`clan`** : Code du clan en minuscules ou `null` si aucun clan
  - ✅ Correct : `"uchiha"`, `"fuma"`, `null`
  - ❌ Incorrect : `"Uchiha"`, `"aucun"`, `undefined`

- **`customTitle`** (optionnel) : Titre affiché sous le nom à la place du grade
  - ✅ Correct : `"Curry Master"`
  - ❌ Incorrect : Ne pas mettre si non nécessaire

### 1.4 Hiérarchies de grades disponibles :
**Konoha** : `Hokage`, `Conseiller du Hokage`, `Sanin Légendaire`, `Commandant Jonin`, `Jonin`, `Tokubetsu Jonin`, `Chunin Confirmé`, `Chunin`, `Tokubetsu Chunin`, `Genin Confirmé`, `Genin`, `Apprenti Genin`

**Suna** : `Kazekage`, `Conseiller du Kazekage`, `Sanin Légendaire`, `Commandant Jonin`, `Jonin`, `Tokubetsu Jonin`, `Chunin Confirmé`, `Chunin`, `Tokubetsu Chunin`, `Genin Confirmé`, `Genin`, `Apprenti Genin`

**Oto** : `Maestro`, `Virtuose`, `Soliste`, `La`, `Sol`, `Fa`, `Mi`, `Re`, `Do`

## 📝 ÉTAPE 2: AJOUTER LE PERSONNAGE DANS `character-detail.js`

### 2.1 Localiser la section `charactersData`
Cherchez ce bloc de code dans `character-detail.js` :
```javascript
const charactersData = {
    wallace_uchiha: {
        key:'wallace_uchiha',
        name: 'Wallace Uchiha',
        quote: '« Une invention par jour éloigne l\'ennui pour toujours ! »',
        village: 'Konohagakure',
        grade: 'Hokage',
        // ... autres champs
    },
    // ... autres personnages
};
```

### 2.2 Ajouter le nouveau personnage
Ajoutez votre personnage AVANT la fermeture de l'objet `};` :

```javascript
stann_bibiche: {
    key:'stann_bibiche',
    name: 'Stann Bibiche',
    quote: '« Citation du personnage »', (optionnel)
    village: 'Sunagakure',
    grade: 'Genin Confirmé',
    specialty: 'Spécialité du personnage',
    relations: 'Relations du personnage',
    kekkei: 'Kekkei Genkai ou ???',
    clan: 'Nom du clan ou Aucun',
    clanLink: 'clan-detail.html?clan=code_clan' (optionnel)
    bio: `Biographie complète du personnage sur plusieurs lignes...`, (optionnel)
    portrait: 'img/nom_fichier.webp', (optionnel)
    emblem: 'img/solve_logo.png'
},
```

### 2.3 Champs obligatoires et leurs règles :
- **`key`** : Même que `dataName` dans script.js
  - ✅ Correct : `'stann_bibiche'`
  - ❌ Incorrect : `'Stann_Bibiche'`, clé différente de script.js

- **`name`** : Nom complet du personnage
  - ✅ Correct : `'Stann Bibiche'`
  - ❌ Incorrect : Nom différent de script.js

- **`village`** : Nom complet du village
  - ✅ Correct : `'Sunagakure'`, `'Konohagakure'`, `'Otogakure'`
  - ❌ Incorrect : `'suna'`, `'SUNAGAKURE'`

- **`grade`** : Grade EXACTEMENT comme dans script.js
  - ✅ Correct : `'Genin Confirmé'`
  - ❌ Incorrect : `'Genin confirmé'`, grade différent de script.js

- **`specialty`** : Spécialité du personnage
  - ✅ Correct : `'Art culinaire et curry'`
  - ❌ Incorrect : Champ vide

- **`relations`** : Relations du personnage
  - ✅ Correct : `'Aucun'`, `'Wallace Uchiha (partenaire)'`
  - ❌ Incorrect : Champ vide

- **`kekkei`** : Kekkei Genkai ou `'???'` si inconnu
  - ✅ Correct : `'Sharingan'`, `'???'`
  - ❌ Incorrect : Champ vide

- **`clan`** : Nom complet du clan ou `'Aucun'`
  - ✅ Correct : `'Uchiha'`, `'Fūma'`, `'Aucun'`
  - ❌ Incorrect : `'uchiha'`, `'null'`

### 2.4 Champs optionnels :
- **`quote`** : Citation entre guillemets avec guillemets français
  - ✅ Correct : `'« Une invention par jour éloigne l\'ennui pour toujours ! »'`
  - ❌ Incorrect : `'Citation sans guillemets'`, omission des `\` avant les `'`

- **`clanLink`** : Lien vers la page du clan si applicable
  - ✅ Correct : `'clan-detail.html?clan=uchiha'`
  - ❌ Incorrect : Lien incorrect si le clan n'existe pas

- **`bio`** : Biographie complète avec backticks
  - ✅ Correct : `` `Biographie sur plusieurs lignes...` ``
  - ❌ Incorrect : `'Biographie sur une ligne'`, omission des backticks

- **`portrait`** : Chemin vers l'image du personnage
  - ✅ Correct : `'img/stann_bibiche.webp'`
  - ❌ Incorrect : Chemin vers une image inexistante
  - ⚠️  Si vous ne spécifiez pas ce champ, un placeholder sera généré automatiquement

- **`emblem`** : Chemin vers l'emblème
  - ✅ Correct : `'img/solve_logo.png'`
  - ❌ Incorrect : Chemin vers une image inexistante

## ⚠️ ERREURS FRÉQUENTES À ÉVITER

### 1. Incohérence entre les fichiers
❌ **ERREUR** : `dataName` différent dans script.js et `key` dans character-detail.js
```javascript
// script.js
dataName: "stann_bibiche",

// character-detail.js
stann_bibiche_different: {  // ❌ DOIT être identique à dataName
```

✅ **CORRECTION** :
```javascript
// script.js
dataName: "stann_bibiche",

// character-detail.js
stann_bibiche: {  // ✅ Identique à dataName
```

### 2. Grades incorrects
❌ **ERREUR** : Grade qui n'existe pas dans les hiérarchies
```javascript
title: "Genin Confirmé",  // ❌ N'existe pas
```

✅ **CORRECTION** : Vérifiez les hiérarchies disponibles
```javascript
title: "Genin Confirmé",  // ✅ Existe bien
```

### 3. Capitalisation incorrecte
❌ **ERREUR** : Mauvaise capitalisation des grades
```javascript
title: "genin confirmé",  // ❌ Tout en minuscules
title: "GENIN CONFIRMÉ",  // ❌ Tout en majuscules
```

✅ **CORRECTION** : Première lettre majuscule seulement
```javascript
title: "Genin Confirmé",  // ✅ Capitalisation correcte
```

### 4. Oubli de champs obligatoires
❌ **ERREUR** : Champs manquants dans character-detail.js
```javascript
stann_bibiche: {
    name: 'Stann Bibiche',
    grade: 'Genin Confirmé',
    // ❌ Manque: key, village, specialty, relations, kekkei, clan
},
```

✅ **CORRECTION** : Tous les champs obligatoires
```javascript
stann_bibiche: {
    key:'stann_bibiche',
    name: 'Stann Bibiche',
    village: 'Sunagakure',
    grade: 'Genin Confirmé',
    specialty: 'Art culinaire et curry',
    relations: 'Aucun',
    kekkei: '???',
    clan: 'Aucun',
},
```

### 5. Erreurs de syntaxe
❌ **ERREUR** : Virgule manquante ou en trop
```javascript
{
    name: "Stann Bibiche",
    dataName: "stann_bibiche"
    title: "Genin Confirmé",  // ❌ Virgule manquante après dataName
},
{
    name: "Autre Personnage",
    dataName: "autre_personnage",
    title: "Jonin",
},  // ❌ Virgule en trop pour le dernier élément
```

✅ **CORRECTION** :
```javascript
{
    name: "Stann Bibiche",
    dataName: "stann_bibiche",  // ✅ Virgule présente
    title: "Genin Confirmé",
},
{
    name: "Autre Personnage",
    dataName: "autre_personnage",
    title: "Jonin"
}  // ✅ Pas de virgule pour le dernier élément
```

### 6. Images inexistantes
❌ **ERREUR** : Spécifier une image qui n'existe pas
```javascript
portrait: 'img/stann_bibiche.webp',  // ❌ Fichier n'existe pas
```

✅ **CORRECTION** : Ne pas spécifier le champ portrait pour utiliser le placeholder automatique
```javascript
// ✅ Pas de champ portrait = placeholder automatique
```

### 7. Erreurs de guillemets dans les citations
❌ **ERREUR** : Mauvais format de citation
```javascript
quote: '"Citation sans guillemets français"',  // ❌ Mauvais format
quote: '« Citation avec guillemet simple dans le texte' »,  // ❌ Guillemet non échappé
```

✅ **CORRECTION** :
```javascript
quote: '« Citation avec guillemet simple échappé : l\'aventure »',  // ✅ \ avant les '
```

## 🧪 VÉRIFICATION FINALE

Après avoir ajouté votre personnage, vérifiez :

1. **Consistance des données** :
   - `dataName` dans script.js == `key` dans character-detail.js
   - `name` identique dans les deux fichiers
   - `title` dans script.js == `grade` dans character-detail.js

2. **Syntaxe JavaScript** :
   - Toutes les virgules sont présentes aux bons endroits
   - Pas de virgule pour le dernier élément
   - Toutes les chaînes sont entre guillemets

3. **Fonctionnalité** :
   - Le personnage apparaît dans le bon village
   - Le personnage apparaît dans la bonne section de grade
   - La fiche d'information s'affiche correctement
   - L'image s'affiche (placeholder si non spécifiée)

4. **Affichage** :
   - Le nom s'affiche correctement dans les cartes
   - Le customTitle s'affiche sous le nom si spécifié
   - Tous les champs de la fiche d'info sont remplis

## 🚀 EXEMPLE COMPLET

### Personnage avec toutes les options :
```javascript
// script.js
{
    name: "Stann Bibiche",
    dataName: "stann_bibiche",
    title: "Genin Confirmé",
    description: "Shinobi de Sunagakure, spécialiste de l'art culinaire et du curry.",
    village: "suna",
    clan: null,
    customTitle: "Curry Master"
},

// character-detail.js
stann_bibiche: {
    key:'stann_bibiche',
    name: 'Stann Bibiche',
    quote: '« Le curry est l'âme du shinobi ! »',
    village: 'Sunagakure',
    grade: 'Genin Confirmé',
    specialty: 'Art culinaire et curry',
    relations: 'Aucun',
    kekkei: '???',
    clan: 'Aucun',
    clanLink: null,
    bio: `Stann Bibiche est un shinobi de Sunagakure qui a trouvé sa voie dans l'art culinaire. 
    Spécialiste du curry, il utilise ses talents pour nourrir les troupes et booster le moral 
    des ninjas en mission. Sa maîtrise des épices est légendaire dans tout le désert.`,
    portrait: 'img/stann_bibiche.webp',
    emblem: 'img/solve_logo.png'
},
```

### Personnage minimal (sans citation, bio, image) :
```javascript
// script.js
{
    name: "Stann Bibiche",
    dataName: "stann_bibiche",
    title: "Genin Confirmé",
    description: "Shinobi de Sunagakure, spécialiste de l'art culinaire et du curry.",
    village: "suna",
    clan: null
},

// character-detail.js
stann_bibiche: {
    key:'stann_bibiche',
    name: 'Stann Bibiche',
    village: 'Sunagakure',
    grade: 'Genin Confirmé',
    specialty: 'Art culinaire et curry',
    relations: 'Aucun',
    kekkei: '???',
    clan: 'Aucun',
    emblem: 'img/solve_logo.png'
},
```

En suivant ce guide à la lettre, vous éviterez 99% des erreurs courantes et votre personnage s'affichera parfaitement !
