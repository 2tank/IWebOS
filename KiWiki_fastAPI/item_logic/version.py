from fastapi.encoders import jsonable_encoder
from item_logic.crud_inheritance.version_crud import VersionCRUD

crud = VersionCRUD()

async def get_versions():
    versions = await crud.get_collection()
    return versions

async def get_versions_by_entryid(entry_id):
    versions = await crud.get_versions_by_entryid(entry_id)
    return versions