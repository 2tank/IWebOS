from typing import List

from fastapi import APIRouter, HTTPException, Body
import item_logic.wiki as wiki_logic
from models.wiki_schema import WikiSchema
from datetime import datetime

router = APIRouter()

@router.get("/")
async def get_wikis():
    try:
        wikis = await wiki_logic.get_wikis()
        return wikis
    except Exception as e:
        print(f"Se produjo un error: {e}")  # Imprime el error para el diagnóstico
        raise HTTPException(status_code=500, detail="No wikis") from e


@router.post("/")
async def post_wiki(entry: WikiSchema = Body(...)):
    try:
        response = await wiki_logic.post_wiki(entry)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")  # Imprime el error para el diagnóstico
        raise HTTPException(status_code=500, detail="No wikis") from e


@router.get("/wiki_name")
async def get_wiki_name(content: str):
    try:
        response = await wiki_logic.get_wiki_name(content)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")  # Imprime el error para el diagnóstico
        raise HTTPException(status_code=400, detail="No wiki for this name") from e


@router.get("/wiki_id")
async def get_wiki_id(content: str):
    try:
        response = await wiki_logic.get_wiki_id(content)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")  # Imprime el error para el diagnóstico
        raise HTTPException(status_code=400, detail="No wiki for this id") from e


@router.patch("/{id}/add_entry/{id_entry}")
async def add_entries(id: str, id_entry: str):
    try:
        response = await wiki_logic.add_entries(id, id_entry)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")  # Imprime el error para el diagnóstico
        raise HTTPException(status_code=400, detail="Cannot create an entry") from e

@router.delete("/{id}/delete_entry/{id_entry}")
async def delete_entries(id: str, id_entry: str):
    try:
        response = await wiki_logic.delete_entries(id, id_entry)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot remove an entry") from e


@router.delete("/{id}/")
async def delete_wiki(id: str) -> bool:
    try:
        response = await wiki_logic.delete_wiki(id)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")  # Imprime el error para el diagnóstico
        raise HTTPException(status_code=400, detail="Cannot delete this wiki") from e

@router.post("/get_by_date/")
async def get_wikis_date(content: str = Body(...), condition: str = Body(...)) -> List[dict]:
    try:
        wiki_date = datetime.fromisoformat(content)
        print(wiki_date)
        wikis = await wiki_logic.get_wikis_date(wiki_date, condition)
        return wikis
    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=400, detail="Cannot obtain by current date") from e
