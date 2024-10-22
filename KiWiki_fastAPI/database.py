

#Copiado de chatGPT
#///////////////////////////////////////
import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_URI")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.my_database   # Nombre de tu base de datos en MongoDB
collection = database.my_collection   # Nombre de la colección
#////////////////////////////////////////