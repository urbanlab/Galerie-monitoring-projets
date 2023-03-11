from pprint import pprint

from schemas import Columns, Projet, Raw_Notion_Page, colored_text, icon, people, periode


def parse_notion_page(page: Raw_Notion_Page) -> Projet:
    """Parse a raw notion page to a Projet object

    Args:
        page (Raw_Notion_Page): Raw notion page

    Returns:
        Projet: Parsed notion page
    """
    prop = page["properties"]
    return Projet(
        id=page["id"],
        notion_url=page["url"],
        projet=prop["Projet"]["title"][0]["plain_text"] if prop["Projet"]["title"] else None,
        icon=icon(
            type=page["icon"]["type"],
            value=page["icon"]["emoji"]
            if page["icon"]["type"] == "emoji"
            else (
                page["icon"]["file"]["url"]
                if page["icon"]["type"] == "file"
                else (page["icon"]["external"]["url"] if page["icon"]["type"] == "external" else None)
            ),
        )
        if page["icon"]
        else None,
        type_activite=colored_text(
            text=prop["Typologie d'activité"]["select"]["name"],
            color=prop["Typologie d'activité"]["select"]["color"],
        )
        if prop["Typologie d'activité"]["select"]
        else None,
        objet=prop["Objet"]["rich_text"][0]["plain_text"] if prop["Objet"]["rich_text"] else None,
        etat=colored_text(
            text=prop["Etat"]["select"]["name"],
            color=prop["Etat"]["select"]["color"],
        )
        if prop["Etat"]["select"]
        else None,
        etape=[
            colored_text(
                text=prop["Etape"]["multi_select"][j]["name"],
                color=prop["Etape"]["multi_select"][j]["color"],
            )
            for j in range(len(prop["Etape"]["multi_select"]))
        ]
        if prop["Etape"]["multi_select"]
        else [],
        etape_precise=prop["Etape précise"]["number"],  # if prop["Etape précise"]["number"] else None,
        meteo=prop["Météo"]["select"]["name"] if prop["Météo"]["select"] else None,
        meteo_precise=prop["Météo précise"]["number"],  # if prop["Météo précise"]["number"] else None,
        meteo_commentaire=prop["Commentaire météo"]["rich_text"][0]["plain_text"]
        if prop["Commentaire météo"]["rich_text"]
        else "",
        politiques_publiques=[
            colored_text(
                text=prop["Politiques publiques"]["multi_select"][j]["name"],
                color=prop["Politiques publiques"]["multi_select"][j]["color"],
            )
            for j in range(len(prop["Politiques publiques"]["multi_select"]))
        ]
        if prop["Politiques publiques"]["multi_select"]
        else [],
        directeur_projet=[
            people(
                id=prop["Directeur de projet"]["people"][j]["id"],
                name=prop["Directeur de projet"]["people"][j]["name"],
                avatar_url=prop["Directeur de projet"]["people"][j]["avatar_url"]
                if prop["Directeur de projet"]["people"][j]["avatar_url"]
                else None,
            )
            for j in range(len(prop["Directeur de projet"]["people"]))
        ]
        if prop["Directeur de projet"]["people"]
        else [],
        chef_de_projet_ou_referent=[
            people(
                id=prop["Chef de projet / Referent"]["people"][j]["id"],
                name=prop["Chef de projet / Referent"]["people"][j].get("name", ""),
                avatar_url=prop["Chef de projet / Referent"]["people"][j].get("avatar_url", None),
            )
            for j in range(len(prop["Chef de projet / Referent"]["people"]))
        ]
        if prop["Chef de projet / Referent"]["people"]
        else [],
        direction_metier=[
            colored_text(
                text=prop["Directions métiers"]["multi_select"][j]["name"],
                color=prop["Directions métiers"]["multi_select"][j]["color"],
            )
            for j in range(len(prop["Directions métiers"]["multi_select"]))
        ]
        if prop["Directions métiers"]["multi_select"]
        else [],
        periode_principale=periode(
            start=prop["Période principale / réalisation"]["date"]["start"],
            end=prop["Période principale / réalisation"]["date"]["end"]
            if prop["Période principale / réalisation"]["date"]["end"]
            else None,
        )
        if prop["Période principale / réalisation"]["date"]
        else None,
        periode_preparatoire=periode(
            start=prop["Période préparatoire"]["date"]["start"],
            end=prop["Période préparatoire"]["date"]["end"] if prop["Période préparatoire"]["date"]["end"] else None,
        )
        if prop["Période préparatoire"]["date"]
        else None,
        charge_erasme=prop["Charge Erasme Globale (JH)"]["number"]
        if prop["Charge Erasme Globale (JH)"]["number"]
        else None,
        besoins_lab=[
            colored_text(
                text=prop["Besoins Lab"]["multi_select"][j]["name"],
                color=prop["Besoins Lab"]["multi_select"][j]["color"],
            )
            for j in range(len(prop["Besoins Lab"]["multi_select"]))
        ]
        if prop["Besoins Lab"]["multi_select"]
        else [],
        budget_global=prop["Budget global (Interne et ext)"]["number"]
        if prop["Budget global (Interne et ext)"]["number"]
        else None,
    )


def parse_notion_columns(page: Raw_Notion_Page) -> Columns:
    """Parse notion columns from a notion page

    Args:
        page (Raw_Notion_Page): Raw notion page

    Returns:
        Columns: Parsed notion columns
    """
    prop = page["properties"]
    return Columns(
        types_activite=[
            colored_text(
                text=option["name"],
                color=option["color"],
            )
            for option in prop["Typologie d'activité"]["select"]["options"]
        ]
        if prop["Typologie d'activité"]["select"]["options"]
        else [],
        etats=[
            colored_text(
                text=option["name"],
                color=option["color"],
            )
            for option in prop["Etat"]["select"]["options"]
        ]
        if prop["Etat"]["select"]["options"]
        else [],
        etapes=[
            colored_text(
                text=option["name"],
                color=option["color"],
            )
            for option in prop["Etape"]["multi_select"]["options"]
        ]
        if prop["Etape"]["multi_select"]["options"]
        else [],
        meteos=[option["name"] for option in prop["Météo"]["select"]["options"]]
        if prop["Météo"]["select"]["options"]
        else [],
        politiques_publiques=[
            colored_text(
                text=option["name"],
                color=option["color"],
            )
            for option in prop["Politiques publiques"]["multi_select"]["options"]
        ]
        if prop["Politiques publiques"]["multi_select"]["options"]
        else [],
        directions_metier=[
            colored_text(
                text=option["name"],
                color=option["color"],
            )
            for option in prop["Directions métiers"]["multi_select"]["options"]
        ]
        if prop["Directions métiers"]["multi_select"]["options"]
        else [],
        besoins_lab=[
            colored_text(
                text=option["name"],
                color=option["color"],
            )
            for option in prop["Besoins Lab"]["multi_select"]["options"]
        ]
        if prop["Besoins Lab"]["multi_select"]["options"]
        else [],
    )
