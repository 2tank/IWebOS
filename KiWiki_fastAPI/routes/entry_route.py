from fastapi import APIRouter, HTTPException, Body, Query
import item_logic.entry as entry_logic
import item_logic.version as version_logic
from models.entry_schema import entrySchema, entryType
from models.version_schema import versionSchema
from typing import Optional, List
from datetime import datetime

router = APIRouter()

@router.post("/")
async def add_entry(entry: entrySchema = Body(...)):
    try:
        result = await entry_logic.add_entry(entry)
        return result
    except Exception  as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}") 
    
@router.get("/")
async def get_entries(
    year: Optional[int] = Query(None, ge=1900, le=datetime.now().year),
    month: Optional[int] = Query(None, ge=1, le=12),
    day: Optional[int] = Query(None, ge=1, le=31),
    description: Optional[str] = Query(None),
    tags: Optional[List[entryType]] = Query(None),
    ):
    try:
        filter = {}
        #Filtro por Año|Mes|Día
        if year:
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

        #Filtramos con expresión regular y la opción case-insensitive
        if description:
            filter["description"] = {"$regex": ".*{}.*".format(description), "$options": "i"}

        #Filtro por tags
        if tags:
            filter["tags"] = {"$in": tags}

        entries = await entry_logic.get_entries(filter)
        return entries
    except Exception as e:
        raise HTTPException(status_code=500,  detail=f"Failed to retrieve entries: {str(e)}") 
    
@router.get("/{id}")
async def get_entry(id: str):
    try:
        entry = await entry_logic.get_entry(id)
        return entry
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve entry: {str(e)}")

@router.delete("/{id}")
async def delete_entry(id: str):
    try:
        deleted_entry = await entry_logic.delete_entry(id)
        return deleted_entry
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete entry: {str(e)}")
    
@router.put("/{id}")
async def update_entry(id: str, req: entrySchema = Body(...)):
    try:
        updated_entry = await entry_logic.update_entry(id,req)
        return updated_entry
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update entry: {str(e)}")
        
@router.post("/{id}/versions/")
async def create_entry_version(id: str,version: versionSchema):
    try:
        updated_entry = await entry_logic.create_version(id,version)
        return updated_entry
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create version: {str(e)}")

@router.get("/{id}/versions/")
async def get_versions_by_entry_id(id: str):
    try:
        versions = await version_logic.get_versions_by_entryid(id)
        return versions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No versions found: {str(e)}")
    
@router.get("/{id}/currentVersion/")
async def get_actual_version_by_entry_id(id: str):
    try:
        version = await entry_logic.get_actualVersion_by_entryid(id)
        return version
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"No versions found: {str(e)}")
    
@router.put("/{entry_id}/versions/{version_id}")
async def update_version_by_id(entry_id : str,version_id : str):
        version = await version_logic.update_actual_version_by_id(entry_id,version_id)
        return version