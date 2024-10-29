import motor.motor_asyncio
import os

from bson import ObjectId
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env')

MONGO_DETAILS = os.getenv("MONGO_URI")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.IWebOS   # Nombre de tu base de datos en MongoDB
collection = database.my_collection   # Nombre de la colección

async def crear_ejemplo(collection,data: dict) -> dict:
    item = await collection.insert_one(data)

async def get_collection(collection):
    items = []
    async for item in collection.find():
        items.append(item.dict())
    return items

async def get_id(collection,id: str) -> dict:
    item = await collection.find_one({"_id": ObjectId(id)})
    if item:
        return item.dict()

async def delete_id(collection,id: str):
    deleted = False
    item = await collection.find_one({"_id": ObjectId(id)})
    if item:
        await collection.delete_one({"_id": ObjectId(id)})
        deleted = True
    return deleted

async def update_id(collection,id: str, data: dict):
    if not data:
        return False
    item = await collection.find_one({"_id": ObjectId(id)})
    if item:
        updatedItem = await collection.update_one(
            {"_id": ObjectId(id)}, {"$set": data}
        )
        return bool(updatedItem)
