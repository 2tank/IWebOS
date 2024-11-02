from fastapi import APIRouter, HTTPException, Body
import item_logic.version as version_logic

router = APIRouter()


@router.get("/")
async def get_versions():
    try:
        versions = await version_logic.get_versions()
        return versions
    except Exception as e:
        raise HTTPException(status_code=500,  detail=f"Failed to retrieve versions: {str(e)}") 
    
#TODO DELETE and UPDATE, hay que tener cuidado de que en el update no se permita editar el campo entry_id