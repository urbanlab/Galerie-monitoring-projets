export interface ColoredText {
    text: string;
    color: string;
}

export interface People {
    id: string;
    name: string;
    avatar_url: string | null;
}

export interface Periode {
    start: Date;
    end: Date | null;
}

export interface Icon {
    type: string;
    value: string;
}

export interface Projet {
    id: string;
    notion_url: string;
    projet: string | null;
    icon: Icon | null;
    type_activite: ColoredText | null;
    objet: string | null;
    etat: ColoredText | null;
    etape: ColoredText[];
    etape_precise: number | null;
    meteo: string | null;
    meteo_precise: number | null;
    politiques_publiques: ColoredText[];
    directeur_projet: People[];
    chef_de_projet_ou_referent: People[];
    direction_metier: ColoredText[];
    periode_principale: Periode | null;
    periode_preparatoire: Periode | null;
    charge_erasme: number | null;
    besoins_lab: ColoredText[];
    budget_global: number | null;
}

export interface Columns {
    types_activite: ColoredText[];
    etats: ColoredText[];
    etapes: ColoredText[];
    meteos: string[];
    politiques_publiques: ColoredText[];
    directions_metier: ColoredText[];
    besoins_lab: ColoredText[];
}

export interface ProjectHistory {
    project_id: string;
    date: string;
    etape_precise: number;
    meteo_precise: number;
}
