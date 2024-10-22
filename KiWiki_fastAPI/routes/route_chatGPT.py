from fastapi import APIRouter, HTTPException
from models import ItemModel
from database import collection
from bson import ObjectId

router = APIRouter()

@router.post("/items/", response_description="Add new item", response_model=ItemModel)
async def create_item(item: ItemModel):
    item_dict = item.dict()
    result = await collection.insert_one(item_dict)
    new_item = await collection.find_one({"_id": result.inserted_id})
    return new_item

@router.get("/items/{id}", response_description="Get a single item", response_model=ItemModel)
async def get_item(id: str):
    item = await collection.find_one({"_id": ObjectId(id)})
    if item:
        return item
    raise HTTPException(status_code=404, detail=f"Item with ID {id} not found")