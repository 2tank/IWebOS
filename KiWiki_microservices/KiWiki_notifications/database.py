import motor.motor_asyncio
import os

from bson import ObjectId
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env')

MONGO_DETAILS = os.getenv("MONGO_URI")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.IWebOS   

class MONGOCRUD:
    def __init__(self,collection_name):
        self.collection = database[collection_name]

    async def create_item(self,data: dict) -> dict:
        item = await self.collection.insert_one(data)
        return {"_id":str(item.inserted_id)}

    async def get_collection(self):
        items = []
        async for item in self.collection.find():
            item["_id"] = str(item["_id"])
            items.append(item)
        return items

    async def get_id(self,id: str) -> dict:
        item = await self.collection.find_one({"_id": ObjectId(id)})
        if item:
            item["_id"] = str(item["_id"])
            return item
        
    async def get_name(self,name: str, search_field: str) -> dict:
        item = await self.collection.find_one({search_field: str})
        if item:
            item[search_field] = name
            return item

    async def delete_id(self,id: str):
        deleted = False
        item = await self.collection.find_one({"_id": ObjectId(id)})
        if item:
            await self.collection.delete_one({"_id": ObjectId(id)})
            deleted = True
        return deleted

    async def update_id(self,id: str, data: dict):
        if not data:
            return False
        item = await self.collection.find_one({"_id": ObjectId(id)})
        if item:
            updatedItem = await self.collection.update_one(
                {"_id": ObjectId(id)}, {"$set": data}
            )
            return bool(updatedItem)
        
    async def get_by_filter(self,filter: dict) -> list[dict]:
        cursor = self.collection.find(filter)
        results = []
        async for document in cursor:
            document['_id'] = str(document['_id'])  # Convertir ObjectId a string
            results.append(document)
        
        return results