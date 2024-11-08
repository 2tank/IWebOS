from database import MONGOCRUD
from bson import ObjectId
import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env')

MONGO_DETAILS = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.IWebOS 


class WIKICRUD(MONGOCRUD):
    def __init__(self):
        super().__init__('Wiki')

    
    async def get_entries_wiki_id(self, content: str, search_type: str):
        wiki_entries_id = await super().get_collection(content)
        return wiki_entries_id
            
    async def get_entries_wiki_name(content: str):
        wiki_entries_name = await super().get_name(content, "name")
        return wiki_entries_name
            
            
    async def add_entry_wiki(self, id_wiki: str, id_entry: str):
        result = await self.collection.update_one(
        {"_id": ObjectId(id_wiki)},  # Filtro por _id
        {"$push": {"entries": id_entry}}  # Añade `entry` a la lista en `entries`
        )
        if result.modified_count == 0:
            raise ValueError("No Wiki document found with the provided ID")

        return {"message": "Entry ID added to Wiki entries successfully"}
    