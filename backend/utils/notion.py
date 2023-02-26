import random
from pprint import pprint

import aiohttp
from schemas import Columns, Projet, Raw_Notion_Page, colored_text
from utils.env import env
from utils.logger import logger
from utils.parse_notion import parse_notion_columns, parse_notion_page
from utils.update_projects import update_project


class APINotion:
    """Custom class to interact with the Notion API"""

    def __init__(self):
        # Initialize the API with env variables
        self.token = env.API_TOKEN
        self.database_id = env.DATABASE_ID
        self.url = f"{env.NOTION_API_URL}/"
        self.version = "2022-06-28"

    async def make_request(self, method, endpoint="", **kwargs):
        """Make a async request to the Notion API

        Args:
            method (str): HTTP method
            endpoint (str, optional): Endpoint to call. Defaults to "".

        Returns:
            dict: Response from the API

        Raises:
            Exception: If the response status is not 200

        Example:
            >>> api = API_Notion()
            >>> api.make_request("GET", "databases")
            >>> api.make_request("POST", "databases/{database_id}/query, filter=filter")
        """
        # Build the request

        # Add the endpoint to the url
        url = self.url + endpoint

        # Add the headers
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Notion-Version": self.version,
        }

        # Add all kwargs to the body
        body = {}
        for arg in kwargs:
            if kwargs[arg] is not None:
                body[arg] = kwargs[arg]

        # Make the request
        logger.info(f"[Notion API] {method} to /{url}")
        async with aiohttp.ClientSession() as session:
            async with session.request(method, url, headers=headers, json=body) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    logger.error(f"Response: {await response.text()}")
                    return None

    async def get_columns_data(self) -> Columns:
        """Get the columns data from the database

        Returns:
            Columns: The columns data

        Example:
            >>> api = API_Notion()
            >>> columns = await api.get_columns_data()
            >>> columns
            Columns(
                id="id",
                nom="nom",
                etape="etape",
                ...
            )
        """
        raw_results: Raw_Notion_Page = await self.make_request("GET", f"databases/{self.database_id}")
        columns = parse_notion_columns(raw_results)
        return columns

    async def get_all_projects(self, filter=None) -> list[Projet]:
        """Get all the projects from the database

        Returns:
            list[Projet]: The list of projects

        Example:
            >>> api = API_Notion()
            >>> projects = await api.get_all_projects()
            >>> projects
            [
                Projet(
                    id="id",
                    nom="nom",
                    etape="etape",
                    ...
                ),
                ...
            ]
        """
        projects: list[Projet] = []

        # Male multiple requests to get all the projects with pagination of 100 (notion limit)
        next_cursor = None
        while True:
            # Make the request
            raw_results = await self.make_request(
                "POST", f"databases/{self.database_id}/query", start_cursor=next_cursor, filter=filter
            )
            # Parse the results
            if raw_results is not None:
                for i in range(len(raw_results["results"])):
                    projects.append(parse_notion_page(raw_results["results"][i]))
                # Check if there is more results and get the next cursor
                next_cursor = raw_results.get("next_cursor")
                # If there is no more results, return the projects
                if not raw_results.get("has_more") or not next_cursor:
                    return projects

    async def get_project(self, project_id: str) -> Projet:
        """Get a project from the database

        Args:
            project_id (str): The id of the project

        Returns:
            Projet: The project
        """
        page = await self.make_request("GET", f"pages/{project_id}")
        if page is not None:
            return parse_notion_page(page)

    async def update_meteo(self, page_id: str, meteo_precise: float, projects: list[Projet]) -> None:
        """Update the meteo of a project

        Args:
            page_id (str): The id of the project
            meteo_precise (float): The precise meteo
            projects (list[Projet]): The list of projects

        Example:
            >>> api = API_Notion()
            >>> await api.update_meteo("id", 0.5, projects)
        """

        # Get the meteo emoji
        if meteo_precise < 0.33:
            meteo = "🌧"
        elif meteo_precise < 0.66:
            meteo = "⛅️"
        else:
            meteo = "☀️"

        successful_request = await self.make_request(
            "PATCH",
            f"pages/{page_id}",
            properties={"Météo": {"select": {"name": meteo}}, "Météo précise": {"number": meteo_precise}},
        )

        # If the request was successful, update the project in the local variable
        if successful_request is not None:
            update_project(
                page_id,
                [
                    {"property": "meteo", "value": meteo},
                    {"property": "meteo_precise", "value": meteo_precise},
                ],
                projects,
            )

    async def update_etape(self, page_id: str, etape_precise: float, projects: list[Projet]) -> None:
        """Update the etape of a project

        Args:
            page_id (str): The id of the project
            etape_precise (float): The precise etape
            projects (list[Projet]): The list of projects

        Example:
            >>> api = API_Notion()
            >>> await api.update_etape("id", 0.5, projects)
        """
        # Make the request
        successful_request = await self.make_request(
            "PATCH",
            f"pages/{page_id}",
            properties={"Etape précise": {"number": etape_precise}},
        )

        # If the request was successful, update the project in the local variable
        if successful_request is not None:
            update_project(
                page_id,
                [{"property": "etape_precise", "value": etape_precise}],
                projects,
            )

    async def update_etape_meteo(
        self, page_id: str, etape_precise: float, meteo_precise: float, projects: list[Projet]
    ) -> None:
        """Update the etape and meteo of a project

        Args:
            page_id (str): The id of the project
            etape_precise (float): The precise etape
            meteo_precise (float): The precise meteo
            projects (list[Projet]): The list of projects

        Example:
            >>> api = API_Notion()
            >>> await api.update_etape_meteo("id", 0.5, 0.5, projects)
        """

        # Get the meteo emoji
        if meteo_precise < 0.33:
            meteo = "🌧"
        elif meteo_precise < 0.66:
            meteo = "⛅️"
        else:
            meteo = "☀️"

        # Make the request
        successful_request = await self.make_request(
            "PATCH",
            f"pages/{page_id}",
            properties={
                "Etape précise": {"number": etape_precise},
                "Météo": {"select": {"name": meteo}},
                "Météo précise": {"number": meteo_precise},
            },
        )

        # If the request was successful, update the project in the local variable
        if successful_request is not None:
            update_project(
                page_id,
                [
                    {"property": "meteo", "value": meteo},
                    {"property": "meteo_precise", "value": meteo_precise},
                    {"property": "etape_precise", "value": etape_precise},
                ],
                projects,
            )

    async def init_etape_meteo(self, columns: Columns, projects: list[Projet]) -> None:
        """Initialize etape and meteo precise for all projects if not already set

        Args:
            columns (Columns): The columns of the database
            projects (list[Projet]): The list of projects

        Example:
            >>> api = API_Notion()
            >>> await api.init_etape_meteo(columns, projects)
        """

        # Loop through all projects
        for project in projects:

            # If meteo and no meteo_precise, set meteo_precise
            if project.meteo and not project.meteo_precise:
                # get meteo value and set meteo_precise randomly
                meteo = project.meteo
                if meteo == "🌧":
                    meteo_precise = 0.33 * random.random()
                elif meteo == "⛅️":
                    meteo_precise = 0.33 + 0.33 * random.random()
                else:
                    meteo_precise = 0.66 + 0.33 * random.random()

            # If etape and no etape_precise, set etape_precise
            if project.etape and not project.etape_precise:
                # get etape value and set etape_precise
                etape: colored_text = project.etape
                for i in range(len(columns.etapes)):
                    if etape[-1]["text"] == columns.etapes[i]["text"]:
                        etape_precise = (i + 1) / len(columns.etapes) * random.random()
                        break

            # update project in notion according to the values
            if project.meteo and project.etape and not project.meteo_precise and not project.etape_precise:
                await self.update_etape_meteo(project.id, etape_precise, meteo_precise)
            elif project.meteo and not project.meteo_precise:
                await self.update_meteo(project.id, meteo_precise)
            elif project.etape and not project.etape_precise:
                await self.update_etape(project.id, etape_precise)
