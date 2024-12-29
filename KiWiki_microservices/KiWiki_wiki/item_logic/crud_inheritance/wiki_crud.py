from database import MONGOCRUD
from bson import ObjectId


import motor.motor_asyncio
import os
from dotenv import load_dotenv
from datetime import datetime
import httpx


load_dotenv(dotenv_path='.env')

MONGO_DETAILS = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)
database = client.IWebOS


class WIKICRUD(MONGOCRUD):
    """
    Clase para manejar operaciones CRUD sobre documentos de Wiki en MongoDB.
    Hereda de `MONGOCRUD` y proporciona métodos para añadir, eliminar y consultar entradas en una Wiki.
    """
    
    def __init__(self) -> None:
        """
        Inicializa la conexión con la colección de Wiki.
        Llama al constructor de la clase base `MONGOCRUD` con el nombre de la colección 'Wiki'.
        """
        super().__init__('Wiki')
    

    async def add_entry_wiki(self, id_wiki: str, id_entry: str):
        """
        Añade una entrada a la lista de entradas de una wiki.

        Args:
            id_wiki (str): El ID de la wiki donde se añadirá la entrada.
            id_entry (str): El ID de la entrada que se añadirá a la wiki.

        Returns:
            dict: Mensaje de éxito si la entrada se añade correctamente.

        Raises:
            ValueError: Si no se encuentra la wiki con el ID proporcionado.
        """
        result = await self.collection.update_one(
            {"_id": ObjectId(id_wiki)},
            {"$push": {"entries": id_entry}}
        )

        if result.modified_count == 0:
            raise ValueError("No Wiki document found with the provided ID")

        return {"message": "Entry ID added to Wiki entries successfully"}

    async def delete_entry_wiki(self, id_wiki: str, id_entry: str):
        """
        Elimina una entrada de la lista de entradas de una wiki.

        Args:
            id_wiki (str): El ID de la wiki de la cual se eliminará la entrada.
            id_entry (str): El ID de la entrada que se eliminará.

        Returns:
            dict: Mensaje de éxito si la entrada se elimina correctamente.

        Raises:
            ValueError: Si no se encuentra la wiki con el ID proporcionado.
        """
        result = await self.collection.update_one(
            {"_id": ObjectId(id_wiki)},
            {"$pull": {"entries": id_entry}}
        )

        if result.modified_count == 0:
            raise ValueError("No Wiki document found with the provided ID")

        return {"message": "Entry ID deleted to Wiki entries successfully"}


    def parse_date(self, date_str: str) -> datetime:
        """
        Convierte una fecha en formato 'día/mes/año' a un objeto datetime con la hora en 00:00:00.

        Args:
            date_str (str): La fecha en formato 'día/mes/año' (ejemplo '29/7/1981').

        Returns:
            datetime: El objeto datetime correspondiente con la hora puesta a 00:00:00.
        """
        # Convierte el formato 'día/mes/año' a un objeto datetime
        date = datetime.strptime(date_str, "%d/%m/%Y")
        # Aseguramos que la hora sea 00:00:00 para ignorar la parte de hora
        return date.replace(hour=0, minute=0, second=0, microsecond=0)

    async def get_wikis_same_date(self, wiki_date: datetime):
        """
        Obtiene las wikis que tienen la misma fecha especificada.

        Args:
            wiki_date (datetime): La fecha de la wiki que se utilizará para el filtro.

        Returns:
            list: Lista de wikis que coinciden con la fecha proporcionada.
        """
        items = []
        async for item in self.collection.find({"date": wiki_date}):
            item["_id"] = str(item["_id"])
            items.append(item)
        return items

    async def get_wikis_higher_date(self, wiki_date: datetime):
        """
        Obtiene las wikis con una fecha posterior a la especificada.

        Args:
            wiki_date (datetime): La fecha de referencia para el filtro.

        Returns:
            list: Lista de wikis con fechas posteriores a la proporcionada.
        """
        items = []
        async for item in self.collection.find({"date": {"$gt": wiki_date}}):
            item["_id"] = str(item["_id"])
            items.append(item)
        return items

    async def get_wikis_lower_date(self, wiki_date: datetime):
        """
        Obtiene las wikis con una fecha anterior a la especificada.

        Args:
            wiki_date (datetime): La fecha de referencia para el filtro.

        Returns:
            list: Lista de wikis con fechas anteriores a la proporcionada.
        """
        items = []
        async for item in self.collection.find({"date": {"$lt": wiki_date}}):
            item["_id"] = str(item["_id"])
            items.append(item)
        return items

    async def get_wiki_date(self, wiki_date: str, condition: str):
        """
        Obtiene wikis basadas en la condición de fecha especificada.

        Args:
            wiki_date (str): La fecha en formato 'día/mes/año' (ejemplo '29/7/1981').
            condition (str): La condición de la fecha ('higher', 'lower', o 'same').

        Returns:
            list: Lista de wikis que cumplen con la condición de fecha proporcionada.

        Raises:
            ValueError: Si la condición no es 'higher', 'lower', o 'same'.
        """
        # Convertir la fecha en formato 'día/mes/año' a datetime
        wiki_date_obj = self.parse_date(wiki_date)

        if condition == "higher":
            result = await self.get_wikis_higher_date(wiki_date_obj)
        elif condition == "lower":
            result = await self.get_wikis_lower_date(wiki_date_obj)
        elif condition == "same":
            result = await self.get_wikis_same_date(wiki_date_obj)
        else:
            raise ValueError("Condition error: debe ser 'higher', 'lower', o 'same'")

        return result
    

    async def get_wikis_author(self, wiki_author: str):
        items = []
        
        if wiki_author.lower() == "all":
            async for item in self.collection.find():
                item["_id"] = str(item["_id"])
                items.append(item)
        else:
            async for item in self.collection.find({"creator": {"$regex": f"{wiki_author}", "$options": "i"}}):
                item["_id"] = str(item["_id"])
                items.append(item)

        return items


    async def modify_wiki(self, id_wiki: str, wiki_data_modify: dict):
        
        result = await self.collection.update_one(
        {"_id": ObjectId(id_wiki)}, 
        {"$set": wiki_data_modify}  
    )

        if result.modified_count == 0:
            raise Exception("No se modificó ningún documento. Puede que el ID no sea válido o los datos no hayan cambiado.")

        wiki = await self.get_id(id_wiki)
        return wiki

    

    async def get_entries(self, id_wiki: str):
        wiki = await self.get_id(id_wiki)
        entries = []
        
        async with httpx.AsyncClient() as client:
            for entry_id in wiki["entries"]:
                print(entry_id)
                try:
                    response = await client.get(f'http://entry:8002/entries/{entry_id}') 
                    
                    if response.status_code == 200:
                        entry_data = response.json() 
                        entries.append(entry_data)
                    else:
                        print(f"Error obteniendo la entrada {entry_id}: {response.status_code}")
                except httpx.RequestError as e:
                    print(f"Error HTTP: {e}")
                    
        return entries



        

