from typing import Dict, List

from schemas import Projet


def update_project(id: int, updates: List[Dict[str, any]], projects: List[Projet]) -> None:
    """Update a project with the given updates as a list of dictionaries with the property name and the new value

    Args:
        id (int): The id of the project to update
        updates (List[Dict[str, any]]): The list of updates
        projects (List[Projet]): The list of projects

    Returns:
        None

    Example:
        update_project(
            1,
            [
                {"property": "meteo", "value": "🌧"},
                {"property": "meteo_precise", "value": 0.1},
            ],
            projects,
        )
    """

    project_index = [index for (index, project) in enumerate(projects) if project.id == id]
    if project_index:
        index = project_index[0]
        for update in updates:
            property_name = update["property"]
            new_value = update["value"]
            setattr(projects[index], property_name, new_value)
