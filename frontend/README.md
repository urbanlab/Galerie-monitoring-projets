# React Monitoring Projets FRONT

Ce projet est une interface web développée avec React pour faire l'interface entre l'utilisateur et l'API.

Le README principal du projet est disponible [ici](../README.md).

## Table des matières

-   [Vocabulaire](#vocabulaire)
    -   [Conventions de nommage](#conventions-de-nommage)
    -   [Arborescence](#arborescence)
-   [Description des pages](#description-des-pages)
    -   [Page de connexion](#page-de-connexion)
    -   [Dashboard](#dashboard)
    -   [Page de détails d'un projet](#page-de-détails-dun-projet)
    -   [Page liste des projets](#page-liste-des-projets)
    -   [Page Méteo / Avancement](#page-météo-avancement)
    -   [Page circle Charts](#page-circle-charts)
-   [Installation](#installation)

## Vocabulaire

### Conventions de nommage

Pour la cohérence du code, il est important de respecter les conventions suivantes :

-   `snake_case` pour les noms des fichiers et des dossiers.
-   `camelCase` pour les noms de variables,de fonctions et des pages.
-   `PascaleCase` pour les noms des fichiers de composants et les noms de composants.

### Arborescence

L'arborescence du frontend est la suivante :

<pre>
frontend
├── public                      dossier de stockage des fichiers statiques
├── src                         
│   ├── components              dossier de stockage des composants
│   │  └── Component1.tsx       
│   ├── pages                   dossier de stockage des pages
│   │  ├── page1                dossier de stockage de la page page1
│   │  │  ├── components        dossier de stockage des composants de la page page1
│   │  │  ├── page1.tsx         fichier de stockage de la page page1
│   │  │  └── styles.ts/.css    fichier de stockage des styles de la page page1
│   │  └── page2                
│   │     ├── components        
│   │     ├── page2.tsx         
│   │     └── styles.ts/.css    
│   ├── utils                   dossier de stockage des fonctions utilitaires
│   │  └── utils1.ts
│   ├── App.tsx                 fichier de stockage du composant App
│   ├── index.tsx               fichier de stockage du composant index
│   ├── mockData.ts             fichier de stockage des données de test
│   ├── models.ts               fichier de stockage des modèles de données
│   ├── services.ts             fichier de stockage des fonctions de services
│   └── styles.ts/.css          fichier de stockage des styles globaux
├── .dockerignore               fichier de configuration de docker
├── .env                        fichier de configuration des variables d'environnement (non présent sur le repo)
├── Dockerfile                  fichier de configuration de docker
├── package.json                fichier de configuration des dépendances
├── README.md                   fichier de description du projet
└── tsconfig.json               fichier de configuration de typescript
</pre>

## Description des pages

### Page de connexion

La page de connexion permet à l'utilisateur de se connecter à l'application. L'utilisateur est redirigé vers la page de connexion s'il n'est pas connecté.

### Dashboard

La page dashboard est la page d'accueil de l'application. Elle permet à l'utilisateur de visualiser les informations globales sur le catalogue projet.
Elle est divisée en 4 sections :

-   Meteo
-   Statut des projets
-   Avancement des projets par étape
-   Budjet des projets

### Page de détails d'un projet

La page de détails d'un projet permet à l'utilisateur de visualiser les informations détaillées sur un projet grâce à un modal qui s'ouvre au clic et qui recouvre la page.

### Page liste des projets

La page liste des projets permet à l'utilisateur de visualiser la liste des projets.

### Page Méteo / Avancement

La page Méteo / Avancement permet à l'utilisateur de visualiser les informations sur la météo et l'avancement des projets. Elle permet aussi me déplacer les projets sur les deux axes (Météo et Avancement).

### Page circle Charts

La page circle Charts permet à l'utilisateur de visualiser les informations sur les projets grâce à des visualisations circulaires.

## Installation

Pour installer le projet, il faut suivre les étapes suivantes :

1. Accédez au dossier `frontend` avec `cd frontend` depuis la racine du projet
2. Installez les dépendances avec `npm install` ou `yarn install`
3. Configurez vos informations d'API Notion dans le fichier `.env` à la racine du frontend en se référent a la section [Variables d'environnement](#variables-d'environnement) ci-dessous
4. Lancez l'application avec `npm start` ou `yarn start`

### Variables d'environnement

Créez un fichier `.env` à la racine du dossier `frontend` et ajoutez les variables suivantes :

```bash
REACT_APP_LOCAL_API_URL = http://localhost:8000
```

Remplacez `http://localhost:8000` par l'URL de l'API FastAPI que vous souhaitez utiliser.
