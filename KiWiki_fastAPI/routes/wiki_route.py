from fastapi import APIRouter, HTTPException
from bson import ObjectId
import item_logic.wiki as wiki_logic

router = APIRouter()

@router.get("/")
async def get_entries():
    return wiki_logic.get_entries