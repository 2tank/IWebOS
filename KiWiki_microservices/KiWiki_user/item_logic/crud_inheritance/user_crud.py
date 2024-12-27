from database import MONGOCRUD
from bson import ObjectId
from typing import Optional, List, Dict
import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env')

MONGO_DETAILS = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.IWebOS

class USERCRUD(MONGOCRUD):
    def __init__(self):
        super().__init__('User')

    async def delete_item_email(self, filter: dict):
            result = await self.collection.delete_one(filter)
            return result.deleted_count > 0

    async def update_item_email(self, filter: dict, update_data: dict):
        # Validar que el filtro y los datos sean diccionarios
        if not isinstance(filter, dict) or not isinstance(update_data, dict):
            raise ValueError("El filtro y los datos de actualización deben ser diccionarios válidos.")

        # Realiza la actualización
        result = await self.collection.update_one(filter, {"$set": update_data})
        return result.modified_count > 0