from fastapi import APIRouter, HTTPException, Body
import item_logic.version as version_logic


router = APIRouter()


@router.get("/")
async def get_versions():
    try:
        versions = await version_logic.get_versions()
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
