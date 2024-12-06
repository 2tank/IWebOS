from fastapi import APIRouter, HTTPException, Query
import item_logic.version as version_logic
from typing import Optional
from datetime import datetime


router = APIRouter()


@router.get("/")
async def get_versions(
    year: Optional[int] = Query(None, ge=1900, le=datetime.now().year),
    month: Optional[int] = Query(None, ge=1, le=12),
    day: Optional[int] = Query(None, ge=1, le=31),
    content_word: Optional[str] = Query(None),
    editor: Optional[str] = Query(None),
    entry_id: Optional[str] = Query(None),
    ):
    try:
        filter = {}
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

                filter["editDate"] = {"$gte": start_date, "$lte": end_date}

        if content_word:
            filter["content"] = {"$regex": ".*{}.*".format(content_word), "$options": "i"}

        if editor:
            filter["editor"] = {"$regex": ".*{}.*".format(editor), "$options" : "i"}

        if entry_id:
            filter["entry_id"] = entry_id

        filter["$orderby"] = {"editDate": -1}

        versions = await version_logic.get_versions(filter)
        return versions

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500,  detail=f"Failed to retrieve versions")

@router.get("/{id}")
async def get_version_by_id(id : str):
    try:
        version = await version_logic.get_version_by_id(id)
        return version
    except Exception as e:
        print({str(e)})
        raise HTTPException(status_code=500, detail=f"Failed to retrieve version by ID")

@router.put("/{id}")
async def rollback_version_by_id(id : str):
    try:
        version = await version_logic.rollback_version_by_id(id)
        return version
    except Exception as e:
        print({str(e)})
        raise HTTPException(status_code=500, detail=f"Failed to rollback version by ID")

@router.delete("/{id}")
async def delete_version_by_id(id : str):
    try:
        deleted_version = await version_logic.delete_version_by_id(id)
        return deleted_version
    except Exception as e:
        print({str(e)})
        raise HTTPException(status_code=500, detail=f"Failed to delete version by ID")

@router.get("/{id}")
async def get_entry_by_version_id(id : str):
    try:
        entry = await version_logic.delete_version_by_id(id)
        return entry
    except Exception as e:
        print({str(e)})
        raise HTTPException(status_code=500, detail=f"Failed to retrieve entry by Version ID")

