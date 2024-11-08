from fastapi import APIRouter, HTTPException, Body
import item_logic.wiki as wiki_logic
from models.wiki_schema import WikiSchema

router = APIRouter()

@router.get("/")
async def get_wikis():
    try:
        wikis = await wiki_logic.get_wikis()
        return wikis
    except Exception as e:
        print(f"Se produjo un error: {e}")  # Imprime el error para el diagnóstico
        raise HTTPException(status_code=500, detail="No wikis") 


@router.post("/")
async def post_wiki(entrt:WikiSchema = Body(...)):
    try:
        response = await wiki_logic.post_wiki(entrt)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")  # Imprime el error para el diagnóstico
        raise HTTPException(status_code=500, detail="No wikis")
    

@router.get("/entries_name")
async def get_entries(content: str):
    try:
        response = await wiki_logic.get_entries_name(content)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")  # Imprime el error para el diagnóstico
        raise HTTPException(status_code=400, detail="No entries for this wiki")


@router.get("/entries_id")
async def get_entries_id(content: str):
    try:
        response = await wiki_logic.get_entries_id(content)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")  # Imprime el error para el diagnóstico
        raise HTTPException(status_code=400, detail="No entries for this wiki")
    

@router.patch("/{id_wiki}/add_entry/{id_entry}")
async def add_entries(id_wiki: str, id_entry: str):
    try:
        print(id_wiki, id_entry)
        response = await wiki_logic.add_entries(id_wiki, id_entry)
        return response
    except Exception as e:
        print(f"Se produjo un error: {e}")  # Imprime el error para el diagnóstico
        raise HTTPException(status_code=400, detail="Cannot create an entry")