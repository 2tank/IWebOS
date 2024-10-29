from fastapi import APIRouter, HTTPException
from bson import ObjectId
import item_logic.wiki as wiki_logic

router = APIRouter()

@router.get("/")
async def get_wikis():
    try:
        wikis = await wiki_logic.get_wikis()
        return wikis
    except:
        raise HTTPException(status_code=500, detail="No wikis") 

    