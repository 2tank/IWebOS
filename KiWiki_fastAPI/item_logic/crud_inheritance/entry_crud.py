from database import MONGOCRUD
from bson import ObjectId
from models.version_schema import versionSchema
from models.entry_schema import entrySchema
import motor.motor_asyncio
import os
from dotenv import load_dotenv
from fastapi.encoders import jsonable_encoder

load_dotenv(dotenv_path='.env')

MONGO_DETAILS = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.IWebOS 

class ENTRYCRUD(MONGOCRUD):
    def __init__(self):
        super().__init__('Entry')
        self.version_collection = database['Version']

    async def get_by_filter(self,filter: dict):
        cursor = self.collection.find(filter)
        results = []
        async for document in cursor:
            document['_id'] = str(document['_id'])  # Convertir ObjectId a string
            results.append(jsonable_encoder(document))
        
        return results

    async def create_item(self, data: dict, content: str) -> dict:
        """
        Crea una entrada y automáticamente añade una versión inicial con el contenido proporcionado
        """

        #Creamos la versión inicial
        version = versionSchema(
            editor = data["creator"],
            editDate = data["creationDate"],
            content = content,
        )

        #Creamos la entrada inicial
        entry = entrySchema(
            title = data["title"],
            creator = data["creator"],
            creationDate = data["creationDate"],
            description = data["description"],
            tags = data["tags"],
        )

        # Insertamos la entrada en la colección y obtenemos su id.
        result = await self.collection.insert_one(entry.model_dump())
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

    async def add_version_to_entry(self, entry_id: str, version_data: versionSchema) -> dict:
        """
        Añade una nueva versión a una entrada existente.
        """
        version = version_data.model_dump()
        version["entry_id"] = str(entry_id)

        # Insertamos la nueva versión en la colección y obtenemos el id
        result = await self.version_collection.insert_one(version)
        version_id = result.inserted_id

        # Insertamos el id de la nueva versión en la lista de versiones de la entrada
        await self.collection.update_one(
            {"_id": ObjectId(entry_id)},
            {
            "$set": {"actual_version": str(version_id)}
            }
        )

        # Obtenemos y devolvemos la entrada actualizada.
        return await super().get_id(entry_id)