from database import MONGOCRUD
from bson import ObjectId

import motor.motor_asyncio
import os
from dotenv import load_dotenv
from fastapi.encoders import jsonable_encoder
from datetime import datetime


load_dotenv(dotenv_path='.env')

MONGO_DETAILS = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.IWebOS


class WIKICRUD(MONGOCRUD):
    def __init__(self):
        super().__init__('Wiki')
    

    
    async def add_entry_wiki(self, id_wiki: str, id_entry: str):
        result = await self.collection.update_one(
        {"_id": ObjectId(id_wiki)},  # Filtro por _id
        {"$push": {"entries": id_entry}}  # Añade `entry` a la lista en `entries`
        )
        if result.modified_count == 0:
            raise ValueError("No Wiki document found with the provided ID")

        return {"message": "Entry ID added to Wiki entries successfully"}

    async def delete_entry_wiki(self, id_wiki: str, id_entry: str):
        result = await self.collection.update_one(
            {"_id": ObjectId(id_wiki)},
            {"$pull": {"entries": id_entry}}
        )
        if result.modified_count == 0:
            raise ValueError("No Wiki document found with the provided ID")

        return {"message": "Entry ID deleted to Wiki entries successfully"}


    async def get_wikis_same_date(self, wiki_date: datetime):
        items = []
        async for item in self.collection.find({"date": wiki_date}):  # Usa un filtro de consulta
            item["_id"] = str(item["_id"])
            items.append(item)
        return items


    async def get_wikis_higher_date(self, wiki_date: datetime):
        items = []
        async for item in self.collection.find({"date": {"$gt": wiki_date}}):  # Usa un filtro de consulta
            item["_id"] = str(item["_id"])
            items.append(item)
        return items


    async def get_wikis_lower_date(self, wiki_date: datetime):
        items = []
        async for item in self.collection.find({"date": {"$lt": wiki_date}}):  # Usa un filtro de consulta
            item["_id"] = str(item["_id"])
            items.append(item)
        return items


    async def get_wiki_date(self, wiki_date: datetime, condition: str):
        
        if condition == "higher":
            result = await self.get_wikis_higher_date(wiki_date)

        elif condition == "lower":
            result = await self.get_wikis_lower_date(wiki_date)

        elif condition == "same":
            result = await self.get_wikis_same_date(wiki_date)
            
        else:
            raise ValueError("Condition error: debe ser 'higher', 'lower', o 'same'")
    
        return result

