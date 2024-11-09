from typing import List, Dict
from fastapi import APIRouter, HTTPException, Body
# from models.wiki_schema import WikiSchema, WikiSchemaPartial
import httpx
from datetime import datetime
from urls import config

commentary_url = config["commentary_url"]
router = APIRouter()


@router.post("/")
async def post_commetary(commentary: Dict = Body(...)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{commentary_url}/", json=commentary)
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Cannot post commentary")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=500, detail="Cannot post commentary")

@router.get("/")
async def get_commentaries():
    try:
        async with httpx.AsyncClient() as client:
            print(f"{commentary_url}/")
            response = await client.get(f"{commentary_url}/")
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="No commentaries")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=500, detail="No commentaries")


@router.get("/{id_commentary}")
async def get_commentary_by_id(id_commentary: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{commentary_url}/{id_commentary}")
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="No commentary for this id")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="No commentary for this id")

@router.delete("/{id_commentary}/")
async def delete_commentary(id_commentary: str) -> bool:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{commentary_url}/{id_commentary}/")
            response.raise_for_status()
            return response.status_code == 200

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Cannot delete this commentary")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot delete this commentary")


@router.get("/{id_commentary}/replies")
async def get_wikis_author(id_commentary: str) -> List[dict]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{commentary_url}/{id_commentary}/replies")
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Failed to fetch replies from commentary")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot retrieve replies from commentary")