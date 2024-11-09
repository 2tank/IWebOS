from typing import List, Dict
from fastapi import APIRouter, HTTPException, Body
from models.wiki_schema import WikiSchema, WikiSchemaPartial
import httpx
from urls import config

wiki_url = config["wiki_url"]
router = APIRouter()

@router.get("/")
async def get_wikis():
    try:
        async with httpx.AsyncClient() as client:
            print(f"{wiki_url}/")
            response = await client.get(f"{wiki_url}/")
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="No wikis")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=500, detail="No wikis")



@router.post("/")
async def post_wiki(entry: WikiSchema = Body(...)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{wiki_url}/", json=entry.model_dump())
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Cannot post wiki")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=500, detail="Cannot post wiki")



@router.get("/name/{wiki_name}")
async def get_wiki_name(wiki_name: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{wiki_url}/name/{wiki_name}")
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="No wiki for this name")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="No wiki for this name")



@router.get("/id/{id_wiki}")
async def get_wiki_id(id_wiki: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{wiki_url}/id/{id_wiki}")
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="No wiki for this id")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="No wiki for this id")



@router.patch("/{id_wiki}/add_entry/{id_entry}")
async def add_entries(id_wiki: str, id_entry: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.patch(f"{wiki_url}/{id_wiki}/add_entry/{id_entry}")
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Cannot create an entry")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot create an entry")



@router.delete("/{wiki_id}/")
async def delete_wiki(wiki_id: str) -> bool:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{wiki_url}/{wiki_id}/")
            response.raise_for_status()
            return response.status_code == 200

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Cannot delete this wiki")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot delete this wiki")



@router.post("/get_by_date/")
async def get_wikis_date(request: Dict = Body(...)) -> List[dict]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{wiki_url}/get_by_date/", json=request)
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Cannot obtain by current date")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot obtain by current date")



@router.patch("/{id_wiki}/modify_wiki")
async def modify_wiki(id_wiki: str, wiki_data: WikiSchemaPartial = Body(...)) -> dict:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.patch(f"{wiki_url}/{id_wiki}/modify_wiki", json=wiki_data.model_dump())
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Put parameters correctly")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Put parameters correctly")



@router.get("/creator/{name_author}")
async def get_wikis_author(name_author: str) -> List[dict]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{wiki_url}/creator/{name_author}")
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Failed to fetch wikis for author")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot retrieve wikis by author")


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
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{wiki_url}/{id_wiki}/delete_entry/{id_entry}")
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Cannot delete an entry")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot delete an entry")