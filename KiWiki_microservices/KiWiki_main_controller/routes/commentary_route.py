from typing import List, Optional
from fastapi import APIRouter, HTTPException, Body, Query
import httpx

from models.commentary_schema import commentary, commentaryUpdate
from urls import config

commentary_url = config["commentary_url"]
router = APIRouter()


@router.post("/")
async def post_commetary(commentary: commentary = Body(...)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{commentary_url}/", json=commentary.model_dump())
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Cannot post commentary")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=500, detail="Cannot post commentary")



@router.get("/")
async def get_commentaries(
        user: Optional[str] = Query(None),
        entry_id: Optional[str] = Query(None),
        entry_version_id: Optional[str] = Query(None),
        only_main_commentaries: Optional[bool] = Query(None),
        sort_by_newest: Optional[bool] = Query(None),
        sort_by_oldest: Optional[bool] = Query(None),
    ):
    try:
        filters = {
            "user": user,
            "entry_id": entry_id,
            "entry_version_id": entry_version_id,
            "only_main_commentaries": only_main_commentaries,
            "sort_by_newest": sort_by_newest,
            "sort_by_oldest": sort_by_oldest,
        }

        filters = {k: v for k, v in filters.items() if v is not None and v != []}

        async with httpx.AsyncClient() as client:
            response = await client.get(f"{commentary_url}/", params=filters)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="No commentaries found")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="No commentaries found")


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

@router.delete("/{id_commentary}")
async def delete_commentary(id_commentary: str) -> bool:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{commentary_url}/{id_commentary}")
            response.raise_for_status()
            return response.status_code == 200

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Cannot delete this commentary")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot delete this commentary")


@router.patch("/{id_commentary}")
async def patch_commentary(id_commentary: str, commentaryUpdate: commentaryUpdate = Body(...)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.patch(f"{commentary_url}/{id_commentary}", json=commentaryUpdate.model_dump())
            response.raise_for_status()
            return response.json()

    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=400, detail="Put parameters correctly")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Put parameters correctly")

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