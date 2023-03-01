import { Projet } from "./models";

const mockProjets: Projet[] = [
    {
        id: "1",
        notion_url: "https://www.example.com",
        projet: "Project X",
        icon: { type: "emoji", value: "😎" },
        type_activite: { text: "Research", color: "blue" },
        objet: "To investigate the effects of a new drug",
        etat: { text: "In progress", color: "green" },
        etape: [
            { text: "Design experiment", color: "blue" },
            { text: "Conduct study", color: "blue" },
            { text: "Analyze data", color: "blue" },
        ],
        etape_precise: null,
        meteo: "☀️",
        meteo_precise: 0.8,
        meteo_commentaire: "Sunny with a chance of clouds",
        politiques_publiques: [
            { text: "Regulation 1", color: "blue" },
            { text: "Regulation 2", color: "green" },
            { text: "Regulation 3", color: "red" },
        ],
        directeur_projet: [
            { id: "a1", name: "John Smith", avatar_url: "https://www.example.com/avatar1.jpg" },
            { id: "a2", name: "Jane Doe", avatar_url: "https://www.example.com/avatar2.jpg" },
        ],
        chef_de_projet_ou_referent: [
            { id: "b1", name: "Bob Johnson", avatar_url: "https://www.example.com/avatar3.jpg" },
            { id: "b2", name: "Samantha Williams", avatar_url: "https://www.example.com/avatar4.jpg" },
        ],
        direction_metier: [
            { text: "Marketing", color: "blue" },
            { text: "Sales", color: "blue" },
        ],
        periode_principale: { start: new Date("2022-01-01"), end: new Date("2022-12-31") },
        periode_preparatoire: { start: new Date("2021-09-01"), end: new Date("2021-12-31") },
        charge_erasme: 100,
        besoins_lab: [
            { text: "Lab equipment 1", color: "blue" },
            { text: "Lab equipment 2", color: "blue" },
        ],
        budget_global: 1000,
    },
    {
        id: "2",
        notion_url: "https://www.example.com",
        projet: "Project X",
        icon: { type: "emoji", value: "😎" },
        type_activite: { text: "Research", color: "blue" },
        objet: "To investigate the effects of a new drug",
        etat: { text: "In progress", color: "green" },
        etape: [
            { text: "Design experiment", color: "blue" },
            { text: "Conduct study", color: "blue" },
            { text: "Analyze data", color: "blue" },
        ],
        etape_precise: null,
        meteo: "⛅️",
        meteo_precise: 0.8,
        meteo_commentaire: "Sunny with a chance of clouds",
        politiques_publiques: [
            { text: "Regulation 1", color: "blue" },
            { text: "Regulation 2", color: "green" },
            { text: "Regulation 3", color: "red" },
        ],
        directeur_projet: [
            { id: "a1", name: "John Smith", avatar_url: "https://www.example.com/avatar1.jpg" },
            { id: "a2", name: "Jane Doe", avatar_url: "https://www.example.com/avatar2.jpg" },
        ],
        chef_de_projet_ou_referent: [
            { id: "b1", name: "Bob Johnson", avatar_url: "https://www.example.com/avatar3.jpg" },
            { id: "b2", name: "Samantha Williams", avatar_url: "https://www.example.com/avatar4.jpg" },
        ],
        direction_metier: [
            { text: "Marketing", color: "blue" },
            { text: "Sales", color: "blue" },
        ],
        periode_principale: { start: new Date("2022-01-01"), end: new Date("2022-12-31") },
        periode_preparatoire: { start: new Date("2021-09-01"), end: new Date("2021-12-31") },
        charge_erasme: 100,
        besoins_lab: [
            { text: "Lab equipment 1", color: "blue" },
            { text: "Lab equipment 2", color: "blue" },
        ],
        budget_global: 1000,
    },
    {
        id: "3",
        notion_url: "https://www.example.com",
        projet: "Project X",
        icon: { type: "emoji", value: "😎" },
        type_activite: { text: "Research", color: "blue" },
        objet: "To investigate the effects of a new drug",
        etat: { text: "In progress", color: "green" },
        etape: [
            { text: "Design experiment", color: "blue" },
            { text: "Conduct study", color: "blue" },
            { text: "Analyze data", color: "blue" },
        ],
        etape_precise: null,
        meteo: "🌧",
        meteo_precise: 0.8,
        meteo_commentaire: "Sunny with a chance of clouds",
        politiques_publiques: [
            { text: "Regulation 1", color: "blue" },
            { text: "Regulation 2", color: "green" },
            { text: "Regulation 3", color: "red" },
        ],
        directeur_projet: [
            { id: "a1", name: "John Smith", avatar_url: "https://www.example.com/avatar1.jpg" },
            { id: "a2", name: "Jane Doe", avatar_url: "https://www.example.com/avatar2.jpg" },
        ],
        chef_de_projet_ou_referent: [
            { id: "b1", name: "Bob Johnson", avatar_url: "https://www.example.com/avatar3.jpg" },
            { id: "b2", name: "Samantha Williams", avatar_url: "https://www.example.com/avatar4.jpg" },
        ],
        direction_metier: [
            { text: "Marketing", color: "blue" },
            { text: "Sales", color: "blue" },
        ],
        periode_principale: { start: new Date("2022-01-01"), end: new Date("2022-12-31") },
        periode_preparatoire: { start: new Date("2021-09-01"), end: new Date("2021-12-31") },
        charge_erasme: 100,
        besoins_lab: [
            { text: "Lab equipment 1", color: "blue" },
            { text: "Lab equipment 2", color: "blue" },
        ],
        budget_global: 1000,
    },
];

export default mockProjets;
