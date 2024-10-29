from fastapi import APIRouter, HTTPException
from models import ItemModel
from database import collection
from bson import ObjectId
import item_logic.wiki as wiki_logic

router = APIRouter()

@router.get("/")
