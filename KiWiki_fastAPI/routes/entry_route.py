from fastapi import APIRouter, HTTPException, Body
import item_logic.entry as entry_logic
from models.entry_schema import entrySchema
from models.version_schema import versionSchema

router = APIRouter()

#TODO Mejorar códigos de error

@router.post("/")
async def add_entry(content: str,description: str,entry: entrySchema = Body(...)):
    await entry_logic.add_entry(entry, content, description)
    
@router.get("/")
async def get_entries():
    try:
        entries = await entry_logic.get_entries()
        return entries
    except:
        raise HTTPException(status_code=500, detail="No entries") 
    
@router.get("/{id}")
async def get_entry(id):
    try:
        entry = await entry_logic.get_entry(id)
        return entry
    except:
        raise HTTPException(status_code=500, detail="No entry")

@router.delete("/{id}")
async def delete_entry(id: str):
    try:
        deleted_entry = await entry_logic.delete_entry(id)
        return deleted_entry
    except:
        raise HTTPException(status_code=500, detail="No entry")
    
@router.put("/{id}")
async def update_entry(id: str, req: entrySchema = Body(...)):
    try:
        updated_entry = await entry_logic.update_entry(id,req)
        return updated_entry
    except:
        raise HTTPException(status_code=500, detail="No entry")
    
@router.post("/{id}/versions/")
async def create_version_entry(id: str,version: versionSchema):
    updated_entry = await entry_logic.create_version(id,version)
    return updated_entry
