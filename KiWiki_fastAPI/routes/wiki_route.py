from fastapi import APIRouter, HTTPException, Body
from bson import ObjectId
import item_logic.wiki as wiki_logic
from models.wiki_schema import WikiSchema

router = APIRouter()

@router.get("/")
async def get_wikis():
    try:
        wikis = await wiki_logic.get_wikis()
        return wikis
    except:
        raise HTTPException(status_code=500, detail="No wikis") 


@router.post("/")
async def post_wiki(entrt:WikiSchema = Body(...)):
    try:
        response = await wiki_logic.post_wiki()
        return response
    except:
        raise HTTPException(status_code=500, detail="No wikis")

    