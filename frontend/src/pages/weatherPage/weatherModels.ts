import { ProjectHistoryItem, Projet } from "../../models";

export interface DragElement {
    xNorm: number;
    yNorm: number;
    xStart?: number; //valeur avant déplacement pour comparer s'il le projet à bougé ou non
    yStart?: number;
    offsetX?: number;
    offsetY?: number;
    color?: string;
    project: Projet;
    active?: boolean;
    opacity?: number;
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
    typeActivite: string[];
    politiquesPubliques: string[];
    directeurOuReferentsProjet: string[];
    etat: string[];
    mode: string;

    isProjectVisible = (project: Projet) => {
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
    constructor(data: ProjectHistoryItem[] = []) {
        this.fullHistory = data;
        this.listOfDates = this.getListOfDates(data);
    }
    fullHistory: ProjectHistoryItem[];
    listOfDates: string[];

    getProjectHistoryById(id: string, date?: string) {
        var projectHistory = this.fullHistory.filter((projectHistory) => projectHistory.project_id === id);
        if (date) {
            return projectHistory.filter(
                (projectHistory) => new Date(projectHistory.date).getTime() <= new Date(date).getTime(),
            );
        }
        return projectHistory;
    }

    getHistoryByDate(date: string) {
        return this.fullHistory.filter((projectHistory) => projectHistory.date === date);
    }

    getMaxDate() {
        if (this.listOfDates.length == 0) {
            //date du jour si historique vide
            return new Date().toISOString().slice(0, 10);
        }
        return this.listOfDates[this.listOfDates.length - 1];
    }

    getMinDate() {
        if (this.listOfDates.length == 0) {
            //date du jour si historique vide
            return new Date().toISOString().slice(0, 10);
        }
        return this.listOfDates[0];
    }

    getListOfDates(data: ProjectHistoryItem[]) {
        var distinctDates: string[] = [];
        for (var item of data) {
            if (!distinctDates.includes(item.date)) {
                distinctDates.push(item.date);
            }
        }
        return distinctDates;
    }

    getListOfProjectsAtThisDate(projects: Projet[], date: string) {
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
    FILTER = "FILTRES",
    OPTIONS = "OPTIONS",

}

export enum MenuMode {
    EDITION = "EDITION",
    EVOLUTION = "EVOLUTION",
}
