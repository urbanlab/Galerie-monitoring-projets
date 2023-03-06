# WeatherPage
le fichier WeatherPage.tsx contient le componenent WeatherPage, qui est la page qui contient tous les éléments relatifs au graphe de la météo:
- WeatherChart, le composant du graphe
- WeatherMenu, le composant contenant la barre de menu (avec les filtres et les options)
- TimeSlider, le composant contenant le slider temporel en mode évolution

### Les props:

- `onShowDetails`: fonction qui ouvre le popup de la fiche projet
- `allProjects`: Une liste avec tous les projets de la bdd notion.
- `setAllProjects`: La fonction pour modifier allProjects.
- `refresh`: un nombre utilisé pour refresh le graphe avec un useEffect quand les projets sont chargés (pas très clean comme option j'avoue).
- `filters`: un objet contenant les différents filtres appliqués, ainsi que le mode de vue de la page météo (évolution ou édition).
- `setFilters`: La fonction pour update les filtres.
- `columns`: Un objet contenant les options possibles des colonnes de notion (par ex pour météo, contient la liste des 3 météos possibles).


### Modèles utilisés:
- Columns: Un objet contenant les options possibles des colonnes de notion (par ex pour météo, contient la liste des 3 météos possibles).
- Projet: Un objet représentant un projet avec toutes ses infos.
- Filters: Classe pour les filtres.
- AllProjectsHistory: Un objet qui gère l'historique de tous les projets.
- DragElement: Un objet représentant les éléments que l'on peut bouger sur le graphe
- MenuMode: enum contenant le mode d'affichage (édition ou évolution).
- MenuOptions: enum contenant la page du menu (filtres ou options)
- ProjectHistoryItem: un objet contenant les infos d'un projet (étape et météo) à une date.

### Modules importés
- useEffect, useRef, useState from "react": used to manage component state.
- privateQuery from "../../services": used to query the backend API.
- exportAsPNG, exportAsSVG from "../../utils/export": exporte le graphe en PNG ou SVG.
- AnimateElements from "./components": fonctions utilisées pour les animation des éléments (quand on update l'affichage des projets, la fonction startAnimation est appelée.)
- TimeSlider, WeatherChart, WeatherMenu composants de la page.
- styles from "./WeatherStyle": styles pour les éléments de la page.


### Fonctions
- `updateProject(projectId: string)`: Met un projet à jour en backend (avec PrivateQuery) et en frontend (avec setAllProjects) + met à jour l'historique avec updateProjectHistory. Cette fonction est appelée dans saveProject
- `getAllProjectsHistory()`: récupère l'historique de tous les projets en bdd notion
- `saveProject(projectId: string, etapePrecise: number, meteoPrecise: number)`: fonction qui est appelée lorsque l'on déplace un projet dans le graphe. effectue une requête pour enregistrer la modification dans l'historique (BDD SQL), puis appelle updateProject pour mettre à jour le projet
- `updateProjectHistory(project: Projet)`: met un jour l'historique des projet en front end  
- `handleExportWeather(type: string)`: exporte en svg ou png
- `startAnimation: (startElements: DragElement[], endElements: DragElement[], duration?: number)`: prend en argument la liste des éléments initiale, finale et la durée de la transition, puis effectue la transition en faisant se déplacer les projets sur le graphe, ou apparaitre/ disparaitre avec un fade si un projet n'apparait que dans une seule liste d'éléments (start et end). fonction appelée dans les 2 useEffect qui s'occupe de mettre à jour les éléments

### Fonctionnement des filtres
Il y a 2 useEffect, qui servent à update l'affichage des éléments (un pour le mode édition, un pour le mode évolution). Les paramètres 
``` 
useEffect(() => {
        if (filters.mode == MenuMode.EDITION) {
            var newElements: DragElement[] = [];
            for (var project of chartProjects) {
                if (filters.isProjectVisible(project)) {
                    newElements.push({
                        xNorm: project.etape_precise ?? 0,
                        yNorm: 1 - (project.meteo_precise ?? 1),
                        xStart: 0,
                        yStart: 0,
                        offsetX: 0,
                        offsetY: 0,
                        active: false,
                        project: project,
                    });
                }
            }
            startAnimation(elements, newElements, 150);
        }
    }, [refresh, filters]);
```

Les paramètres `[refresh, filters]` indique que la fonction est appelée à chaque fois que l'un des paramètres change (ici refresh ou filters). 
Lorsque l'on applique un nouveau filtre (dans WeatherMenu), filters est mis à jour et ce useEffect s'exécute.
Pour chaque projet, on regarde s'il est "visible" (ie filtré ou non) avec `filters.isProjectVisible(project)`. Si oui on l'ajoute on créé un nouvel élément DragElement que l'on initialise avec ses coordonnées et on l'ajoute dans la liste d'éléments à afficher.
Enfin on appelle startAnimation qui va effectuer la transition lorsque applique les filtres. (joue avec le paramètre 'opacity' de DragElement)

# WeatherChart

Ce composant sert à afficher le graphe. La mise en page (dimensions et position du graphe) est un peu chaotique

### Props:
- `columns: Columns | undefined;` (cf WeatherPage)
- `setElements: (elements: DragElement[]) => void;` (cf WeatherPage)
- `elements: DragElement[];` (cf WeatherPage)
- `onShowDetails: (projectId: string) => void;` (cf WeatherPage)
- `saveProject: (projectId: string, etapePrecise: number, meteoPrecise: number) => void;` (cf WeatherPage: appelée quand on déplace un projet )
- `mode: string;` (MenuMode.EDITION ou MenuMode.EVOLUTION)
- `menuRef: React.MutableRefObject<any>;` ne sert que pour obtenir la hauteur du menu
- `sliderRef: React.MutableRefObject<any>;` ne sert que pour obtenir la hauteur du slider 
- `showAllLabels: boolean;` booléen pour afficher ou non tous les labels
- `elementsScale: number;` facteur d'échelle des icones (entre x0.5 et x2)

### States
- `chartDimensions` : Un état qui stocke les dimensions du diagramme. (largeur et hauteur). les dimensions doivent être fixées pour le svg, donc ces dimensions sont calculées manuellements pour que la mise en page soit pas trop mal

### Fonctions
- `buildChart(chartDimensions: { width: number, height: number })`: fonction qui prend en argument les dimensions voulues et qui créer le graphe en utilisant d3.js
- `handleResize()`: fonction appelée à chaque fois que l'on resize la fenêtre. Les dimensions du graphes sont automatiquement recalculées en fonctions des dimensions de la fenêtre, et le graphe se met à jour.

### Fonctions pour gérer le déplacement des éléments
- `handlePointerDown(index1: number, e: React.PointerEvent<SVGElement>)`: première fonction appelée, lorsqu'on clique sur un point (souris enfoncée). Initialise le déplacement en mettant un offsetX et Y à l'élément (coordonnées du clique à l'intérieur de la bbox de l'élement), et met active à true pour signifier que l'élément est près à être déplacé.
- `handlePointerMove(e: React.PointerEvent<SVGElement>)`: fonction appelée lorsque l'on est en train de déplacer un élément. si l'élément est en active == true, alors on le déplace à l'endroit ou se trouve la souris et on met à jour la liste des éléments.
- `handlePointerUp(e: React.PointerEvent<SVGElement>)`: fonction appelée quand on relache le clique: remet active = false.


# ProjectItem

Composant qui affiche un éléments sur le graphe (avec son icone, label etc)

### Props:
- `item: DragElement;` contient les infos de l'élément (coordonnées x et y en poucentage des dimensions du graphe, les infos du projet etc)
- `index: number;` index dans la liste pour donner une clef à l'élement et éviter un warning dans la console
- `chartDimensions: { width: number, height: number };` dimensions du graphe pour calculer les coordonner x et y
- `onShowDetails: (projectId: string) => void;` fonction pour afficher les infos du projet quand on double clique dessus
- `handlePointerDown: (index1: number, e: React.PointerEvent<SVGElement>) => void;` fonction appelée quand on clique sur un élément
- `showAllLabels: boolean;`
- `elementsScale: number;`

### Variables
- `radius`: taille de l'élement (moitié des dimensions de la box). la taille du texte, des icones ou image dépendent de cette valeur
- `xCoord`, `yCoord`: coordonnées de l'élement dans le repère du svg
- `labelWidth`: largeur maximale du cadre contenant le nom du projet
- 

### States
- `[showLabel, setShowLabel]`: affiche ou non le label.

### Fonctions
- `buildLogo()`: fonction qui retourne le logo du projet (met une icone, image ou emoji dans un div au bonnes dimensions)
-  `onMouseEnter()` et `onMouseLeave()`: appelée pour afficher/ faire disparaitre le label d'un élément.

### Composants
- icones créé avec `buildLogo()`
- `toolTip`: affiche un cadre avec les coordonnées du projet quand on le déplace. 
- `label`: Contient le nom du projet
- `Fade`: composant custom qui sert à effectuer une fade transition lorsque le tooltip et le label apparaissent ou disparaissent
-`foreignObject`: sert à placer les composants qu'on veut (par ex div, p,...)dans un svg


# Problèmes actuels et idées pour les résoudre
- Il y a des améliorations au niveau de la gestion des états (liste de projets notamment).
Lorsque l'on déplace un projet, on effectue une requête pour modifier en backend (dans la bdd notion et sqlite pour l'historique) puis on effectue la même modif en front dans les variables d'états avec les useState. Cependant, changements d'états étant asynchrones, il y a des problèmes lorsque l'on modifie trop vite 2 projets à la suite (il faut refresh la page pour corriger le pb).
le problème vient du fait que la fonction `saveProject` est appelée une deuxième fois, avant que la liste de tous les projets `allProject` soit mise à jour lors du premier appel. C'est un problème avec le système de hook de React.
Je pense qu'avec un gestionnaire d'état redux, le problème peut être corrigé. Il faudrait mettre tous les listes d'états que l'on compte garder (liste de projets, historique des projets) à la racine du projets, puis les faire passer en props dans les différents composants. 

- Les modifications faites par différentes personnes ne sont pas affichées en temps réel sur l'écran de tout le monde. (Il faut refresh pour voir les modifs). Il faudrait utiliser un websocket pour ouvrir un canal de communication entre le client et le serveur.