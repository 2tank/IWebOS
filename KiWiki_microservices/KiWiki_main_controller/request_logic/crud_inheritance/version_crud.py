# item_logic/crud_inheritance/version_crud.py
from database import MONGOCRUD
from bson import ObjectId
from fastapi.encoders import jsonable_encoder


class VersionCRUD(MONGOCRUD):

    def __init__(self):
        super().__init__('Version')

    async def get_versions_by_entryid(self, entry_id: str):
        cursor = self.collection.find({"entry_id": entry_id})
        versions = []

        async for document in cursor:
            # Convertir ObjectId a string y aplicar jsonable_encoder
            document['_id'] = str(document['_id'])  # Convertir ObjectId a string
            versions.append(jsonable_encoder(document))

        return versions
    
    async def get_by_filter(self, filter):
        cursor = self.collection.find(filter).sort({"editDate" : -1})
        results = []
        async for document in cursor:
            document['_id'] = str(document['_id'])  # Convertir ObjectId a string
            results.append(document)
        
        return results
