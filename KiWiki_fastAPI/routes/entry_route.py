from fastapi import APIRouter, HTTPException, Body
import item_logic.entry as entry_logic
import item_logic.version as version_logic
from models.entry_schema import entrySchema
from models.version_schema import versionSchema
from typing import Optional
from datetime import datetime

router = APIRouter()

#TODO Mejorar códigos de error

@router.post("/")
async def add_entry(content: str,description: str,entry: entrySchema = Body(...)):
    await entry_logic.add_entry(entry, content, description)
    
@router.get("/")
async def get_entries(
    year: Optional[int] = None,
    month: Optional[int] = None,
    day: Optional[int] = None):
    try:
        filter = None
        if year:
            filter = {}
            if month and day:
                start_date = datetime(year,month,day)
                end_date = datetime(year,month,day,23,59,59)
            elif month:
                start_date = datetime(year,month,1)
                if month == 12:
                    end_date = datetime(year+1,1,1)
                else:
                    end_date = datetime(year,month+1,1)
            else:
                start_date = datetime(year,1,1)
                end_date = datetime(year+1,1,1)
                
            filter["creationDate"] = {"$gte": start_date, "$lte": end_date}  

        entries = await entry_logic.get_entries(filter)
        return entries
    except:
        raise HTTPException(status_code=500, detail="No entries") 
    
@router.get("/{id}")
async def get_entry(id: str):
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

@router.get("/{id}/versions/")
async def get_versions_by_entry_id(id: str):
    versions = await version_logic.get_versions_by_entryid(id)
    return versions