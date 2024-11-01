from fastapi.encoders import jsonable_encoder
from item_logic.crud_inheritance.entry_crud import ENTRYCRUD
from database import MONGOCRUD

crud = MONGOCRUD("Version")

async def get_versions():
    versions = await crud.get_collection()
    return versions