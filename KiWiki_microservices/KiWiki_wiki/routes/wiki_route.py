from typing import List, Dict
from fastapi import APIRouter, HTTPException, Body
import item_logic.wiki as wiki_logic
from models.wiki_schema import WikiSchema, WikiSchemaPartial
from datetime import datetime

router = APIRouter()

@router.get("/")
async def get_wikis():
    """
    Retrieve all wikis from the database.

    Returns:
        List[dict]: A list of dictionaries representing all wikis.

    Raises:
        HTTPException: If an error occurs during retrieval, returns a 500 status.
    """
    try:
        wikis = await wiki_logic.get_wikis()
        return wikis
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=500, detail="No wikis") from e


@router.post("/")
async def post_wiki(entry: WikiSchema = Body(...)):
    """
    Add a new wiki to the database.

    Args:
        entry (WikiSchema): Data for the new wiki, validated against the WikiSchema.

    Returns:
        dict: A dictionary containing the ID of the newly created wiki.

    Raises:
        HTTPException: If an error occurs during creation, returns a 500 status.
    """
    try:
        response = await wiki_logic.post_wiki(entry.model_dump())
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=500, detail="No wikis") from e


@router.get("/name/{wiki_name}")
async def get_wiki_name(wiki_name: str):
    """
    Retrieve a wiki by its name.

    Args:
        content (str): The name of the wiki to retrieve.

    Returns:
        dict: The wiki data that matches the provided name.

    Raises:
        HTTPException: If no matching wiki is found, returns a 400 status.
    """
    try:
        response = await wiki_logic.get_wiki_name(wiki_name)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="No wiki for this name") from e


@router.get("/id/{wiki_id}")
async def get_wiki_id(wiki_id: str):
    """
    Retrieve a wiki by its ID.

    Args:
        content (str): The ID of the wiki to retrieve.

    Returns:
        dict: The wiki data that matches the provided ID.

    Raises:
        HTTPException: If no matching wiki is found, returns a 400 status.
    """
    try:
        response = await wiki_logic.get_wiki_id(wiki_id)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="No wiki for this id") from e


@router.patch("/{wiki_id}/add_entry/{id_entry}")
async def add_entries(wiki_id: str, id_entry: str) -> dict:
    """
    Add an entry to a wiki by ID.

    Args:
        id (str): The ID of the wiki.
        id_entry (str): The entry ID to add to the wiki.

    Returns:
        dict: Updated wiki data with the added entry.

    Raises:
        HTTPException: If the entry cannot be added, returns a 400 status.
    """
    try:
        response = await wiki_logic.add_entries(wiki_id, id_entry)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot create an entry") from e


@router.delete("/{id_wiki}/delete_entry/{id_entry}")
async def delete_entries(id_wiki: str, id_entry: str) -> dict:
    """
    Remove an entry from a wiki by ID.

    Args:
        id (str): The ID of the wiki.
        id_entry (str): The entry ID to remove from the wiki.

    Returns:
        dict: Updated wiki data with the entry removed.

    Raises:
        HTTPException: If the entry cannot be removed, returns a 400 status.
    """
    try:
        response = await wiki_logic.delete_entries(id_wiki, id_entry)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot remove an entry") from e


@router.delete("/{wiki_id}/")
async def delete_wiki(wiki_id: str) -> bool:
    """
    Delete a wiki by ID.

    Args:
        id (str): The ID of the wiki to delete.

    Returns:
        bool: True if the deletion was successful.

    Raises:
        HTTPException: If the wiki cannot be deleted, returns a 400 status.
    """
    try:
        response = await wiki_logic.delete_wiki(wiki_id)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot delete this wiki") from e


@router.post("/get_by_date/")
async def get_wikis_date(data: Dict = Body(...)) -> List[dict]:
    """
    Retrieve wikis based on a specified creation date and condition.

    Args:
        content (str): The creation date in ISO format.
        condition (str): The condition for the date comparison ('same', 'higher', or 'lower').

    Returns:
        List[dict]: A list of wikis that match the specified date and condition.

    Raises:
        HTTPException: If no matching wikis are found, returns a 400 status.
    """
    try:

        wiki_date = datetime.fromisoformat(data["content"])
        wikis = await wiki_logic.get_wikis_date(wiki_date, data["condition"])
        return wikis
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot obtain by current date") from e


@router.get("/creator/{name_author}")
async def get_wikis_author(name_author: str):

    try:
        print(type(name_author))
        wikis = await wiki_logic.get_wikis_author(name_author)
        return wikis

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot obtain by current creator") from e


@router.patch("/{id_wiki}/modify_wiki")
async def modify_wiki(id_wiki: str, wiki_data: WikiSchemaPartial = Body(...)) -> dict:
    try:
        wiki_data_modify = wiki_data.model_dump(exclude_unset=True)
        response = await wiki_logic.modify_wiki(id_wiki, wiki_data_modify)
        return response
    except Exception as e:
        print(f"Se produjo un erro: {e}")
        raise HTTPException(status_code=400, detail="Put parameters correctly") from e


@router.get("/{id_wiki}/entries")
async def get_wiki_entries(id_wiki: str) -> List:
    try:
        response = await wiki_logic.get_entries(id_wiki)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Put parameters correctly") from e