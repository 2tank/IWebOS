

#Copiado de chatGPT
#///////////////////////////////////////
import motor.motor_asyncio
import os
from dotenv import load_dotenv

from bson import ObjectId
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env')

MONGO_DETAILS = os.getenv("MONGO_URI")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.IWebOS   # Nombre de tu base de datos en MongoDB
entryCollection = database['Entry']   # Nombre de la colección
#////////////////////////////////////////

async def delete_entry_id(id: str):
    deleted = False
    entry = await entryCollection.find_one({"_id":ObjectId(id)})
    if entry:
        await entry.delete_one({"_id": ObjectId(id)})
        deleted = True
    return deleted 

async def update_entry(id: str, data: dict):
    if not data:
        return False
    entry = await entryCollection.find_one({"_id":ObjectId(id)})
    if entry:
        updatedEntry = await entryCollection.update_one({
            {"_id": ObjectId(id)},{"$set":data}})
        return bool(update_entry)