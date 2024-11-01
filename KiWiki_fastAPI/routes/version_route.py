from fastapi import APIRouter, HTTPException, Body
import item_logic.version as version_logic

router = APIRouter()


@router.get("/")
async def get_versions():
    try:
        versions = await version_logic.get_versions()
        return versions
    except:
        raise HTTPException(status_code=500, detail="No versions") 