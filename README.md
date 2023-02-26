# ERASME | Galerie monitoring projets

Mise en forme des données du catalogue projet ERASME présent sur Notion, l'objectif est de fournir des visualisations de données qui permettent d'avoir une vue d'ensemble des projets.

## Table des matières

- [Présentation du projet](#présentation-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
  * [Sans Docker](#sans-docker)
  * [Avec Docker](#avec-docker)
  * [Variables d'environnement](#variables-d'environnement)
    + [Pour le back-end](#pour-le-back-end)
    + [Pour le front-end](#pour-le-front-end)
- [Utilisation pour le développement](#utilisation-pour-le-développement)
- [Utilisation pour la production](#utilisation-pour-la-production)
  * [Build des images Docker pour publication](#build-des-images-docker-pour-publication)
  * [Lancement des conteneurs Docker](#lancement-des-conteneurs-docker)
- [Détails fonctionnels](#détails-fonctionnels)
- [Contributeurs](#contributeurs)
- [Licence](#licence)

## Présentation du projet

Dans le cadre de la collaboration entre le Centrale Digital Lab et ERASME, ce projet est initialement développé sur sur 7 semaines par 3 étudiants du CDL.

Ce projet est une application web développée en utilisant React en Typescript pour la partie front-end, et FastAPI en Python pour la partie back-end. L'API Python est reliée à une base de données Notion, à partir de laquelle elle récupère des informations pour les afficher sur le front-end.

## Technologies utilisées

- [React](https://reactjs.org/) Pour le front-end, nous utilisons React en Typescript. React est un framework JavaScript qui permet de créer des applications web dynamiques et interactives. Il est basé sur le principe de composants, qui permettent de créer des éléments réutilisables et modulaires.
- [Typescript](https://www.typescriptlang.org/) est un langage de programmation qui est un sur-ensemble de JavaScript. Il permet d'ajouter des types statiques à JavaScript, ce qui permet de détecter plus facilement les erreurs de programmation.
- [FastAPI](https://fastapi.tiangolo.com/) pour le back-end, c'est un framework Python moderne et rapide pour créer des API. Il est basé sur des standards ouverts comme OpenAPI et JSON Schema, et est conçu pour être facile à utiliser et à apprendre.
- [Notion](https://developers.notion.com/) est une application de gestion de notes et de projets. Nous utilisons l'API Notion pour récupérer les données de la base de données des projets ERASME.

Des outils supplémentaires sont utilisés pour le développement, comme [Docker](https://www.docker.com/) pour le déploiement, [Docker Compose](https://docs.docker.com/compose/) pour la gestion des conteneurs.


## Installation

### Sans Docker
1. Clonez ce dépôt avec `git clone https://github.com/urbanlab/Galerie-monitoring-projets.git`
2. Accédez au dossier du projet avec `cd Galerie-monitoring-projets`
3. Pour le back-end :
    - Créez un environnement virtuel avec `python -m venv venv`
    - Activez l'environnement virtuel avec `source venv/bin/activate` ou `venv\Scripts\activate.bat` sous Windows
    - Installez les dépendances avec `pip install -r requirements.txt`
    - Configurez vos informations d'API Notion dans le fichier `.env` à la racine du backend en se référent a la section [Variables d'environnement](#variables-d'environnement)
    - Lancez le serveur avec `uvicorn main:app --reload`
    - Sous Windows, ces étapes peuvent être effectuées en utilisant le script `run.bat`, sauf la configuration des variables d'environnement evidemment
4. Pour le front-end :
    - Accédez au dossier `frontend` avec `cd frontend` depuis la racine du projet
    - Installez les dépendances avec `npm install` ou `yarn install`
    - Configurez vos informations d'API Notion dans le fichier `.env` à la racine du frontend en se référent a la section [Variables d'environnement](#variables-d'environnement)
    - Lancez l'application avec `npm start` ou `yarn start`

### Avec Docker
1. Clonez ce dépôt avec `git clone https://github.com/urbanlab/Galerie-monitoring-projets.git`
2. Accédez au dossier du projet avec `cd Galerie-monitoring-projets`
3. QUID DES VARIABLES D'ENVIRONNEMENTS ??
4. Lancez le serveur avec `docker-compose up --build`
5. Accédez à l'application à l'adresse http://localhost:3000 dans votre navigateur


### Variables d'environnement
Le projet utilise des variables d'environnement pour stocker les informations sensibles telles que les clés d'API. Vous devez configurer ces variables avant de lancer l'application.

#### Pour le back-end
Créez un fichier `.env` à la racine du dossier `backend` et ajoutez les variables suivantes :
    
```bash
NOTION_API_URL = https://api.notion.com/v1
DATABASE_ID = notion_database_id
API_TOKEN = notion_secret_token

JWT_SECRET_KEY = secret_key
```

Remplacez `notion_database_id` par l'ID de la base de données Notion que vous souhaitez utiliser, et `notion_secret_token` par la clé d'API Notion que vous avez générée. Vous pouvez trouver ces informations dans la documentation de l'API Notion. Remplacez `secret_key` par une clé secrète de votre choix.

#### Pour le front-end
Créez un fichier `.env` à la racine du dossier `frontend` et ajoutez les variables suivantes :

```bash
REACT_APP_LOCAL_API_URL = http://localhost:8000
```

Remplacez `http://localhost:8000` par l'URL de l'API FastAPI que vous souhaitez utiliser.

## Utilisation pour le développement

1. Configurez vos informations d'API Notion dans le fichier `.env` à la racine du projet (voir la section [Installation](#installation)
2. Lancez le back-end en exécutant `uvicorn main:app --reload` dans le terminal au niveau du dossier `backend`
3. Lancez le front-end en exécutant `npm start` ou `yarn start` dans un autre terminal au niveau du dossier `frontend`
4. Accédez à l'application à l'adresse http://localhost:3000 ou l'adresse choisie pour le front-end dans votre navigateur

## Utilisation pour la production
### Build des images Docker pour publication

Il faut modifier le docker-compose.yml pour que les images soient publiées sur le docker hub de l'urban lab. Pour cela, il faut modifier les lignes suivantes : 

```bash
    image: bapttheo/monitoring-projet-back
    image: bapttheo/monitoring-projet-front
```
Avec les nom qui correspondent à votre docker hub.

1. Penser à bien retirer les .env des dossiers backend et frontend
2. VARIABLES D'ENVIRONNEEMNTS ??
3. Lancer la commande `docker-compose build` dans le dossier du projet
4. Lancer la commande `docker-compose push` dans le dossier du projet

### Lancement des conteneurs Docker
1. Lancer la commande `docker-compose up -d` dans le dossier du projet


## Détails fonctionnels
Des détails sur les fonctionnements respectifs du back-end et du front-end sont disponibles dans les README de chacun des dossiers :
- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)

## Contributions

Le projet est initialement développé par 3 étudiants du Centrale Digital Lab :
- Théophile POIRIER (tpoirier.341@gmail.com)
- Timothée BARY (timothee.barry1@ecl20.ec-lyon.fr)
- Farouk NASRY (farouk.nasri@auditeur.ec-lyon.fr)

Si vous souhaitez contribuer à ce projet, n'hésitez pas à contacter l'un des développeurs ci-dessus pour discuter de vos idées et voir comment vous pouvez aider. Les contributions sont les bienvenues, que ce soit pour signaler des problèmes, suggérer des améliorations, ou soumettre des modifications de code.

## Licence

Ce projet est sous licence [MIT](https://opensource.org/licenses/MIT). Copyright (c) 2023 urbanLAB.
Voir le fichier [LICENSE](LISENCE) pour plus d'informations.