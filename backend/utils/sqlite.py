import asyncio
import os
import sqlite3

from schemas import Project_History
from utils.logger import logger


def parse_project(row):
    """Parse a row from the database to a Project_History object

    Args:
        row (tuple): The row to parse

    Returns:
        Project_History: The parsed object
    """
    return Project_History(
        project_id=row[1],
        date=row[2],
        meteo_precise=row[3],
        etape_precise=row[4],
    )


class LocalDatabase:
    """A class to interact with the local database

    Args:
        db_path (str): The path to the sqlite database file
    """

    def __init__(self, db_path: str):
        self.db_path = db_path

    async def get_all_projects_history(self) -> list[Project_History]:
        """Get all the projects history

        Returns:
            list[Project_History]: The list of all the projects history

        Example:
            >>> db = Local_database("db.sqlite")
            >>> history = await db.get_all_projects_history()
            >>> history
            [
                Project_History(project_id="1", date="2021-01-01", meteo_precise=0.1, etape_precise=0.1),
                Project_History(project_id="1", date="2021-01-02", meteo_precise=0.2, etape_precise=0.2),
                Project_History(project_id="2", date="2021-01-01", meteo_precise=0.3, etape_precise=0.3),
                Project_History(project_id="2", date="2021-01-02", meteo_precise=0.4, etape_precise=0.4),
            ]
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        history: list[Project_History] = []
        try:
            cursor.execute("SELECT * FROM project_history ORDER BY date")
            results = cursor.fetchall()
            for row in results:
                history.append(parse_project(row))
        except Exception as err:
            logger.error(err)
        conn.close()
        return history

    async def get_project_history(self, project_id: str) -> list[Project_History]:
        """Get the history of a project

        Args:
            project_id (str): The id of the project

        Returns:
            list[Project_History]: The list of the project history

        Example:
            >>> db = Local_database("db.sqlite")
            >>> history = await db.get_project_history("1")
            >>> history
            [
                Project_History(project_id="1", date="2021-01-01", meteo_precise=0.1, etape_precise=0.1),
                Project_History(project_id="1", date="2021-01-02", meteo_precise=0.2, etape_precise=0.2),
            ]
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        history: list[Project_History] = []
        try:
            cursor.execute(f"SELECT * FROM project_history WHERE project_id = '{project_id}' ORDER BY date")
            results = cursor.fetchall()
            for row in results:
                history.append(parse_project(row))
        except Exception as err:
            logger.error(err)
        conn.close()
        return history

    async def insert_project_history(self, history: Project_History):
        """Insert a project history in the database

        Args:
            history (Project_History): The project history to insert

        Returns:
            None

        Example:
            >>> db = Local_database("db.sqlite")
            >>> history = Project_History(project_id="1", date="2021-01-01", meteo_precise=0.1, etape_precise=0.1)
            >>> await db.insert_project_history(history)
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        try:
            # We look if there is already an entry for this project at this date
            cursor.execute(
                f"SELECT * FROM project_history WHERE project_id = '{history.project_id}' AND date = '{history.date}'"
            )
            results = cursor.fetchall()

            # If there is already an entry
            if len(results) > 0:
                # Update the entry
                cursor.execute(
                    f"""
                    UPDATE project_history 
                    SET etape_precise = {history.etape_precise}, meteo_precise = {history.meteo_precise}
                    WHERE project_id = '{history.project_id}' AND date = '{history.date}'
                    """
                )
            # If there is no entry
            else:
                # Insert the entry
                cursor.execute(
                    f"""
                    INSERT INTO project_history 
                    (project_id, date, etape_precise, meteo_precise)
                    VALUES ('{history.project_id}','{history.date}',{history.etape_precise},{history.meteo_precise})
                    """
                )
            conn.commit()

        except Exception as err:
            logger.error(err)

        conn.close()
