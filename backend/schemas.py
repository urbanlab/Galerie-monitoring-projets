from datetime import date
from typing import Dict, List

from pydantic import BaseModel


class Credentials(BaseModel):
    """Identifiant pour l'authentification."""

    password: str


class Token(BaseModel):
    """Token d'accès pour assurer l'authentification."""

    access_token: str
    token_type: str = "bearer"


class User(BaseModel):
    """Utilisateur de l'application."""

    id: int
    pwd_hash: str


class colored_text(Dict):
    """Texte avec une couleur"""

    text: str
    color: str


class people(Dict):
    """Personne avec un nom, un id et une url d'avatar"""

    id: str
    name: str
    avatar_url: str | None


class periode(Dict):
    """Periode avec une date de début et une date de fin eventuelle"""

    start: date
    end: date | None


class icon(Dict):
    """Icone avec un type et une valeur"""

    type: str = "emoji" or "file" or "external"
    value: str


class Projet(BaseModel):
    """Projet avec toutes les informations nécessaires qui arrive de Notion"""

    id: str
    notion_url: str
    projet: str | None
    icon: icon | None
    type_activite: colored_text | None
    objet: str | None
    etat: colored_text | None
    etape: List[colored_text]
    etape_precise: float | None
    meteo: str | None
    meteo_precise: float | None
    meteo_commentaire: str
    politiques_publiques: List[colored_text]
    directeur_projet: List[people]
    chef_de_projet_ou_referent: List[people]
    direction_metier: List[colored_text]
    periode_principale: periode | None
    periode_preparatoire: periode | None
    charge_erasme: int | None
    besoins_lab: List[colored_text]
    budget_global: int | None


class Raw_Notion_Page(Dict):
    """Page brute de Notion"""

    object: str
    id: str
    created_time: str
    last_edited_time: str
    parent: Dict
    archived: bool
    properties: Dict
    url: str


class Columns(BaseModel):
    """Colonnes importantes de la base de données Notion"""

    types_activite: List[colored_text] | None
    etats: List[colored_text] | None
    etapes: List[colored_text] | None
    meteos: List[str] | None
    politiques_publiques: List[colored_text] | None
    directions_metier: List[colored_text] | None
    besoins_lab: List[colored_text] | None


class Project_History(BaseModel):
    """Historique d'un projet sur la météo et l'étape précise"""

    project_id: str
    date: str
    etape_precise: float
    meteo_precise: float
