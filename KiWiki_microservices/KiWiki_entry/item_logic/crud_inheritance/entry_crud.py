from database import MONGOCRUD
from bson import ObjectId
from models.version_schema import versionSchema
from models.entry_schema import entrySchema
from typing import Optional, List, Dict
import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='.env')

MONGO_DETAILS = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.IWebOS 

class ENTRYCRUD(MONGOCRUD):
    def __init__(self):
        super().__init__('Entry')
        self.version_collection = database['Version']

    async def create_item(self, data: entrySchema) -> dict:
        """
        Crea una entrada y automáticamente añade una versión inicial con el contenido proporcionado
        """

        data_dict = data.model_dump()
        
        #Creamos la versión inicial con contenidos vacios
        version = versionSchema(
            editor = data_dict["creator"],
            editDate = data_dict["creationDate"],
        )

        # Insertamos la entrada en la colección y obtenemos su id.
        result = await self.collection.insert_one(data_dict)
        entry_id = result.inserted_id

        # Actualizamos el campo entry_id de versión e insertamos version en la colección y obtenemos el id nuevamente
        version.entry_id = str(entry_id)
        result = await self.version_collection.insert_one(version.model_dump())  # Guardar la versión inicial
        version_id = result.inserted_id

        # Actualizamos la referencia de entrada para poner el id de la versión
        await self.collection.update_one(
            {"_id": entry_id},
            {
                "$set": {"actual_version": str(version_id)}
            }
        )

        # Obtenemos y devolvemos la entrada creada.
        return await super().get_id(entry_id)

    async def add_version_to_entry(self, entry_id: str, version_data: Dict) -> dict:
        """
        Añade una nueva versión a una entrada existente.
        """
        
        version_data["entry_id"] = str(entry_id)

        # Insertamos la nueva versión en la colección y obtenemos el id
        result = await self.version_collection.insert_one(version_data)
        version_id = result.inserted_id

        # Insertamos el id de la nueva versión en la lista de versiones de la entrada
        await self.collection.update_one(
            {"_id": ObjectId(entry_id)},
            {
            "$set": {"actual_version": str(version_id)}
            }
        )

        # Obtenemos y devolvemos la entrada actualizada.
        result = await self.version_collection.find_one({"_id" : ObjectId(version_id)})
        result["_id"] = str(result["_id"]) 
        return result

    

    async def add_wiki_to_entry(self, entry_id: str, wiki_id: str) -> dict:
        """
        Añade el id de la wiki asociada a una entrada existente.
        """
        result = await self.collection.update_one(
            {"_id": ObjectId(entry_id)}, 
            {"$set": {"wiki": wiki_id}}
        )

        if result.modified_count == 0:
            raise ValueError("No Wiki document found with the provided ID")

        return {"message": "Entry ID added to Wiki entries successfully"}
        