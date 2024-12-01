from database import MONGOCRUD
from bson import ObjectId

import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env')

MONGO_DETAILS = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.IWebOS


class NOTIFCRUD(MONGOCRUD):
    def __init__(self) -> None:
        super().__init__('Notification')

    async def update_many(self, update_data):
        await self.collection.update_many({}, {"$set": update_data})  # Cambia `collection` por `self.collection`




