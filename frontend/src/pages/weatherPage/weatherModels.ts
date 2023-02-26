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
    isVisible: boolean;
    opacity?: number;
}

export class ChartDimensions {
    constructor({ windowWidth = 0, windowHeight = 0 }) {
        this.width = windowWidth;
        this.height = 0.6 * windowHeight;
    }
    width: number;
    height: number;
}

export class Filters {
    constructor({
        typeActivite = "all",
        politiquesPubliques = "all",
        directeurProjet = "all",
        besoinsLab = "all",
        referentsProjet = "all",
        mode = "edition",
    }) {
        this.typeActivite = typeActivite;
        this.politiquesPubliques = politiquesPubliques;
        this.directeurProjet = directeurProjet;
        this.besoinsLab = besoinsLab;
        this.referentsProjet = referentsProjet;
        this.mode = mode;
    }
    typeActivite: string;
    politiquesPubliques: string;
    directeurProjet: string;
    besoinsLab: string;
    referentsProjet: string;
    mode: string;
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
        console.log("projectsAtThisDate", projectsAtThisDate);
        return projectsAtThisDate;
    }
}

export enum MenuOptions {
    filter = "FILTRER",
    export = "EXPORTER",
    mode = "MODE",
}
