import { ProjectHistory, Projet } from "../../models";

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
        typeActivite = "all",
        politiquesPubliques = "all",
        etat = "all",
        directeurOuReferentsProjet = "all",
        mode = MenuMode.EDITION as string,
    }) {
        this.typeActivite = typeActivite;
        this.politiquesPubliques = politiquesPubliques;
        this.etat = etat;
        this.directeurOuReferentsProjet = directeurOuReferentsProjet;
        this.mode = mode;
    }
    typeActivite: string;
    politiquesPubliques: string;
    directeurOuReferentsProjet: string;
    etat: string;
    mode: string;

    isProjectVisible = (project: Projet) => {
        let isVisible = true;

        if (
            this.directeurOuReferentsProjet !== "all" &&
            !(project.chef_de_projet_ou_referent
                ?.map((referent) => referent.name)
                .includes(this.directeurOuReferentsProjet)
                || project.directeur_projet
                    ?.map((directeur) => directeur.name)
                    .includes(this.directeurOuReferentsProjet))
        ) {
            isVisible = false;
        }
        if (
            this.politiquesPubliques !== "all" &&
            !project.politiques_publiques
                ?.map((politique_publique) => politique_publique.text)
                .includes(this.politiquesPubliques)
        ) {
            isVisible = false;
        }
        if (this.typeActivite !== "all" && project.type_activite?.text !== this.typeActivite) {
            isVisible = false;
        }
        if (
            this.etat !== "all" && project.etat?.text !== this.etat) {
            isVisible = false;
        }
        return isVisible
    }
}

export class AllProjectsHistory {
    constructor(data: ProjectHistory[] = []) {
        this.fullHistory = data;
        this.listOfDates = this.getListOfDates(data);
    }
    fullHistory: ProjectHistory[];
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

    getListOfDates(data: ProjectHistory[]) {
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
    FILTER = "FILTRER",
    EXPORT = "EXPORTER",
    MODE = "MODE",
}

export enum MenuMode {
    EDITION = "EDITION",
    EVOLUTION = "EVOLUTION",
}
