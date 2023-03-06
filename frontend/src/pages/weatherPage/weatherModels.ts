import { ProjectHistoryItem, Projet } from "../../models";


export interface DragElement {
    xNorm: number; //position x normalisée (entre 0 et 1) de l'élément
    yNorm: number; //position y normalisée (entre 0 et 1) de l'élément
    xStart?: number; //position x de départ de l'élément
    yStart?: number; //position y de départ de l'élément
    offsetX?: number; //offset x de l'élément par rapport à la souris
    offsetY?: number; //offset y de l'élément par rapport à la souris
    project: Projet; //projet associé à l'élément
    active?: boolean; //indique si l'élément est actif (sélectionné)
    opacity?: number; //opacité de l'élément (pour l'animation + filtres)
}

export class Filters {
    constructor({
        typeActivite = [] as string[],
        politiquesPubliques = [] as string[],
        etat = [] as string[],
        directeurOuReferentsProjet = [] as string[],
        mode = MenuMode.EDITION as string,
    }) {
        this.typeActivite = typeActivite;
        this.politiquesPubliques = politiquesPubliques;
        this.etat = etat;
        this.directeurOuReferentsProjet = directeurOuReferentsProjet;
        this.mode = mode;
    }
    typeActivite: string[]; // liste des types d'activité à afficher (si vide, affiche toutes les activités)
    politiquesPubliques: string[]; // liste des politiques publiques à afficher (si vide, affiche toutes les politiques publiques)
    directeurOuReferentsProjet: string[]; // liste des directeurs ou référents de projet à afficher (si vide, affiche tous les directeurs et référents de projet)
    etat: string[]; // liste des états à afficher (si vide, affiche tous les états)
    mode: string; // mode d'affichage (filtres ou options)

    isProjectVisible = (project: Projet) => {
        // retourne true si le projet est visible avec les filtres actuels, false sinon
        let isVisible = true;

        if (
            this.directeurOuReferentsProjet.length > 0 &&
            (project.chef_de_projet_ou_referent.concat(project.directeur_projet))
                .map((referent) => referent.name)
                .filter(x => this.directeurOuReferentsProjet.indexOf(x) !== -1)
                .length === 0
        ) {
            isVisible = false;
        }
        if (
            this.politiquesPubliques.length > 0 &&
            project.politiques_publiques
                ?.map((politique_publique) => politique_publique.text)
                .filter(x => this.politiquesPubliques.indexOf(x) !== -1)
                .length === 0
        ) {
            isVisible = false;
        }
        if (this.typeActivite.length > 0 &&
            (project.type_activite?.text == null ||
                project.type_activite?.text != null &&
                this.typeActivite.indexOf(project.type_activite.text) === -1)
        ) {
            isVisible = false;
        }
        if (
            this.etat.length > 0 &&
            (project.etat?.text == null ||
                project.etat?.text != null &&
                this.etat.indexOf(project.etat.text) === -1)
        ) {
            isVisible = false;
        }
        return isVisible
    }
}

export class AllProjectsHistory {
    //classe qui contient l'historique de tous les projets + méthodes pour récupérer les données de l'historique
    constructor(data: ProjectHistoryItem[] = []) {
        this.fullHistory = data;
        this.listOfDates = this.getListOfDates(data);
    }
    fullHistory: ProjectHistoryItem[];
    listOfDates: string[];

    getProjectHistoryById(id: string, date?: string) {
        //retourne l'historique d'un projet à une date donnée (si date non spécifiée, retourne l'historique complet du projet)
        var projectHistory = this.fullHistory.filter((projectHistory) => projectHistory.project_id === id);
        if (date) {
            projectHistory = projectHistory.filter(
                (projectHistory) => new Date(projectHistory.date).getTime() <= new Date(date).getTime(),
            );
        }
        return projectHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    getHistoryByDate(date: string) {
        //retourne l'historique de tous les projets à une date donnée
        return this.fullHistory.filter((projectHistory) => projectHistory.date === date);
    }

    getMaxDate() {
        //retourne la date la plus récente de l'historique
        if (this.listOfDates.length == 0) {
            //date du jour si historique vide
            return new Date().toISOString().slice(0, 10);
        }
        return this.listOfDates[this.listOfDates.length - 1];
    }

    getMinDate() {
        //retourne la date la plus ancienne de l'historique
        if (this.listOfDates.length == 0) {
            //date du jour si historique vide
            return new Date().toISOString().slice(0, 10);
        }
        return this.listOfDates[0];
    }

    getListOfDates(data: ProjectHistoryItem[]) {
        //retourne la liste des dates de l'historique
        var distinctDates: string[] = [];
        for (var item of data) {
            if (!distinctDates.includes(item.date)) {
                distinctDates.push(item.date);
            }
        }
        return distinctDates;
    }

    getListOfProjectsAtThisDate(projects: Projet[], date: string) {
        //retourne la liste des projets avec les données de l'historique à la date donnée
        var projectsAtThisDate: Projet[] = [];
        for (var project of projects) {
            var projectHistory = this.getProjectHistoryById(project.id, date);
            if (projectHistory.length > 0) {
                var lastProjectData = projectHistory[projectHistory.length - 1];
                projectsAtThisDate.push({
                    ...project,
                    etape_precise: lastProjectData.etape_precise,
                    meteo_precise: lastProjectData.meteo_precise,
                });
            }
        }
        return projectsAtThisDate;
    }
}

export enum MenuOptions {
    //options du menu
    FILTER = "FILTRES",
    OPTIONS = "OPTIONS",

}

export enum MenuMode {
    //mode d'affichage du graphe
    EDITION = "EDITION",
    EVOLUTION = "EVOLUTION",
}
