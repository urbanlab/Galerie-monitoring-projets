import asyncio
from datetime import date

from fastapi import Body, Depends, FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from schemas import Columns, Credentials, Project_History, Projet, Token, User
from utils.auth import create_access_token, is_valid_user, verify_password
from utils.logger import logger
from utils.notion import APINotion
from utils.sqlite import LocalDatabase

app = FastAPI(
    title="Galerie Minitoring projet API",
    description="Simple APi to get data from notion database and send it to the front",
    version="0.5",
)

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Custom Notion API class instance
apiNotion = APINotion()

# SQLite db instance
local_database = LocalDatabase(db_path="./data/database.db")

# Projects variable, will be loaded at startup and updated when needed
# This variable is acting as a cache
projects: list[Projet] = []

# Columns variable, will be loaded at startup and updated when needed
columns: Columns = Columns()

# Erasme user for authentication
# You can change the password by using the following command:
erasme_user = User(
    id=1,
    pwd_hash="$2b$12$wzUMP3nXlpvzjUqXw0knWuIIpo.jQWaOXGDGrxPOwjPPKBbk5x27q",
)


@app.on_event("startup")
async def startup_event():
    """Au démarrage les données de la base de données Notion sont chargées en mémoire."""

    logger.info("Loading columns data and projects from Notion API into cache...")
    global columns
    global projects
    columns = await apiNotion.get_columns_data()
    order = [
        "Cadrage",
        "Idéation",
        "Conception-Design",
        "Production",
        "Expérimentation",
        "Modélisation - Evaluation",
        "Déploiement",
    ]
    # make sure the order of the steps is correct
    columns.etapes = sorted(columns.etapes, key=lambda x: order.index(x["text"]))
    projects = await apiNotion.get_all_projects()
    logger.info("Projects loaded into cache.")


@app.get("/")
def read_root():
    """Endpoint de test pour vérifier que l'API est bien en ligne."""
    return {"Hello": "World"}


############################
# USERS RELATIVE ENDPOINTS #
############################


@app.post(
    "/auth/login",
    status_code=200,
    tags=["Users"],
    response_model=Token,
)
async def login(credentials: Credentials):
    """Endpoint pour l'authentification"""

    logger.info(f"Tentative de connexion...")
    if verify_password(credentials.password, erasme_user.pwd_hash):
        logger.info(f"Tentaive de connexion réussie")
        access_token = create_access_token(erasme_user.id)
        return Token(access_token=access_token, token_type="bearer")
    else:
        raise HTTPException(status_code=401, detail="Bad Credentials")


#############################
# NOTION RELATIVE ENDPOINTS #
#############################


@app.get("/cached_projects", status_code=200, tags=["Notion"], response_model=list[Projet])
async def get_cached_projects():
    """Retourne la liste projets dans le cache

    Returns:
        list[schemas.Project]: liste des projets
    """
    logger.info("Request from front on /cached_projects to get all projects from cache...")
    global projects
    return projects


@app.get("/all_projects", status_code=200, tags=["Notion"], response_model=list[Projet])
async def get_all_projects():
    """Retourne la liste projets

    Returns:
        list[schemas.Project]: liste des projets
    """
    logger.info("Request from front on /all_projects to get all projects from Notion API...")
    global projects
    loop = asyncio.get_event_loop()
    coroutine = await loop.run_in_executor(None, apiNotion.get_all_projects)
    projects = await coroutine
    return projects


@app.get("/project/{project_id}", status_code=200, tags=["Notion"], response_model=Projet)
async def get_projects(project_id):
    """Retourne un projet en fonction de son id

    Returns:
        schemas.Project:  projet
    """
    logger.info(f"Request from front on /project to get the project {project_id} from Notion API...")

    loop = asyncio.get_event_loop()
    coroutine = await loop.run_in_executor(None, apiNotion.get_project, project_id)
    project: Projet = await coroutine
    return project


@app.get("/columns_data", status_code=200, tags=["Notion"], response_model=Columns)
async def get_columns_data():
    """Retourne les données des colonnes de la base de données (on n'effectue pas une nouvelle requête à l'API car ces données ne changent pas)"""
    global columns
    return columns


@app.get("/project_history/{project_id}", status_code=200, tags=["Notion"], response_model=list[Project_History])
async def get_project_history(project_id: str):
    """Donne l'historique d'un projet

    Args:
        project_id (str): ID du projet à mettre à jour

    Returns:
        list[Project_History]: historique du projet
    """
    logger.info(f"Request from front on /project_history...")
    loop = asyncio.get_event_loop()
    coroutine = await loop.run_in_executor(None, local_database.get_project_history, project_id)
    history: list[Project_History] = await coroutine
    return history


@app.get("/all_projects_history", status_code=200, tags=["Notion"], response_model=list[Project_History])
async def get_all_projects_history():
    """Donne l'historique de tous les projets enregistrés

    Args:
        project_id (str): ID du projet à mettre à jour

    Returns:
        list[Project_History]: historique du projet
    """
    logger.info(f"Request from front on /all_projects_history...")
    loop = asyncio.get_event_loop()
    coroutine = await loop.run_in_executor(None, local_database.get_all_projects_history)
    history: list[Project_History] = await coroutine
    return history


class Meteo(BaseModel):
    meteo_precise: float


@app.post("/update_meteo/{project_id}", tags=["Notion"], status_code=201, response_model=dict)
async def update_meteo(
    project_id: str,
    meteo: Meteo,
    valid_token: bool = Depends(is_valid_user),
):
    """Met à jour la météo précise d'un projet

    Args:
        project_id (str): ID du projet à mettre à jour
        meteo (Meteo): valeur de la météo précise

    Returns:
        dict: message de confirmation
    """
    logger.info(f"Request from front on /update_meteo to update project {project_id}...")
    loop = asyncio.get_event_loop()
    coroutine = await loop.run_in_executor(None, apiNotion.update_meteo, project_id, meteo.meteo_precise, projects)
    await coroutine
    return {"message": "Météo précise mise à jour"}


class Etape(BaseModel):
    etape_precise: float


@app.post("/update_etape/{project_id}", status_code=201, tags=["Notion"], response_model=dict)
async def update_etape(project_id: str, etape: Etape, valid_token: bool = Depends(is_valid_user)):
    """Met à jour l'étape précise d'un projet

    Args:
        project_id (str): ID du projet à mettre à jour
        etape (Etape): valeur de l'étape précise

    Returns:
        dict: message de confirmation
    """
    logger.info(f"Request from front on /update_etape to update project {project_id}...")
    loop = asyncio.get_event_loop()
    coroutine = await loop.run_in_executor(None, apiNotion.update_etape, project_id, etape.etape_precise, projects)
    await coroutine
    return {"message": "Etape précise mise à jour"}


class EtapeMeteo(BaseModel):
    etape_precise: float
    meteo_precise: float


@app.post("/update_etape_meteo/{project_id}", status_code=201, tags=["Notion"], response_model=dict)
async def update_etape_meteo(project_id: str, etape_meteo: EtapeMeteo, valid_token: bool = Depends(is_valid_user)):
    """Met à jour l'étape précise et la météo précise d'un projet

    Args:
        project_id (str): ID du projet à mettre à jour
        etape_meteo (EtapeMeteo): valeur de l'étape précise et de la météo précise

    Returns:
        dict: message de confirmation
    """
    logger.info(f"Request from front on /update_etape_meteo to update project {project_id}...")
    loop = asyncio.get_event_loop()
    coroutine = await loop.run_in_executor(
        None, apiNotion.update_etape_meteo, project_id, etape_meteo.etape_precise, etape_meteo.meteo_precise, projects
    )
    await coroutine

    # Ajout de l'historique dans la base de données locale
    coroutine = await loop.run_in_executor(
        None,
        local_database.insert_project_history,
        Project_History(
            project_id=project_id,
            etape_precise=etape_meteo.etape_precise,
            meteo_precise=etape_meteo.meteo_precise,
            date=str(date.today()),
        ),
    )
    await coroutine
    return {"message": "Etape précise et météo précise mise à jour"}


class Meteo_commentaire(BaseModel):
    comment: str


@app.post("/update_meteo_comment/{project_id}", status_code=201, tags=["Notion"], response_model=dict)
async def update_meteo_comment(
    project_id: str,
    meteo_comment: Meteo_commentaire,
):
    """Met à jour le commentaire de la météo d'un projet

    Args:
        project_id (str): ID du projet à mettre à jour
        meteo_comment (str): commentaire de la météo

    Returns:
        dict: message de confirmation
    """
    logger.info(f"Request from front on /update_meteo_comment to update project {project_id}...")
    loop = asyncio.get_event_loop()
    coroutine = await loop.run_in_executor(
        None, apiNotion.update_meteo_comment, project_id, meteo_comment.comment, projects
    )
    await coroutine
    return {"message": "Commentaire de la météo mise à jour"}


@app.post("/init_etape_meteo/", status_code=201, tags=["ADMIN"], response_model=dict)
async def init_etape_meteo(valid_token: bool = Depends(is_valid_user)):
    """Met à jour l'étape précise et la météo précise d'un projet quand on a pas de données
    ATTENTION : cette fonction est très longue à s'exécuter et est faite pour être lancée une seule fois au début

    Args:
        project_id (str): ID du projet à mettre à jour

    Returns:
        dict: message de confirmation
    """
    logger.info(f"Request from front on /init_etape_meteo to init etape and meteo for all projects...")
    loop = asyncio.get_event_loop()
    coroutine = await loop.run_in_executor(None, apiNotion.init_etape_meteo, columns, projects)
    await coroutine
    return {"message": "Etape précise et météo précise initialisées"}
