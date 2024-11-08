from typing import List
from fastapi import APIRouter, HTTPException, Body
import request_logic.wiki as wiki_request_logic
from models.wiki_schema import WikiSchema, WikiSchemaPartial
import httpx
from datetime import datetime
from urls import config

wiki_url = config["wiki_url"]
router = APIRouter()

@router.get("/")
async def get_wikis():
    try:
        async with httpx.AsyncClient() as client:
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



@router.get("/wiki_name")
async def get_wiki_name(content: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{wiki_url}/wiki_name", json=content)
            response.raise_for_status()
            return response.json()
        
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="No wiki for this name")
    
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="No wiki for this name")



@router.get("/wiki_id")
async def get_wiki_id(content: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{wiki_url}/wiki_id", json=content)
            response.raise_for_status()
            return response.json()
        
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="No wiki for this id")
    
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="No wiki for this id")



@router.patch("/{id}/add_entry/{id_entry}")
async def add_entries(id: str, id_entry: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{wiki_url}/{id}/add_entry/{id_entry}")
            response.raise_for_status()
            return response.json()
        
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Cannot create an entry")
    
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot create an entry")



@router.delete("/{id}/")
async def delete_wiki(id: str) -> bool:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{wiki_url}/{id}/")
            response.raise_for_status()
            return response.status_code == 204
        
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Cannot delete this wiki")
    
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot delete this wiki")



@router.post("/get_by_date/")
async def get_wikis_date(content: str, condition: str = Body(...)) -> List[dict]:
    try:
        payload = {"content": content, "condition": condition}
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{wiki_url}/get_by_date/", json=payload)
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
        wiki_data_modify = wiki_data.model_dump(exclude_unset=True)
        async with httpx.AsyncClient() as client:
            response = await client.patch(f"{wiki_url}/{id_wiki}/modify_wiki", json=wiki_data_modify)
            response.raise_for_status()
            return response.json()
        
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Put parameters correctly")
    
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Put parameters correctly")



@router.get("/wikis/author/{name_author}")
async def get_wikis_author(name_author: str) -> List[dict]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{wiki_url}/get_by_author/{name_author}")
            response.raise_for_status()
            return response.json()
        
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Failed to fetch wikis for author")
    
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot retrieve wikis by author")
