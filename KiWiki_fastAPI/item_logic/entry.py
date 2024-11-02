from fastapi.encoders import jsonable_encoder
from item_logic.crud_inheritance.entry_crud import ENTRYCRUD

crud = ENTRYCRUD()

async def add_entry(entry,content):
    entry_data = jsonable_encoder(entry)
    result = await crud.create_item(entry_data,content)
    return result

async def get_entries(filter):
    entries = []
    if len(filter)>0:
        entries = await crud.get_by_filter(filter)
    else:
        entries = await crud.get_collection()
    return entries

async def get_entry(id):
    entry = await crud.get_id(id)
    return entry

async def delete_entry(id):
    deletedEntry = await crud.delete_id(id)
    return deletedEntry

async def update_entry(id,req):
    req = {k: v for k, v in req.model_dump().items() if v is not None}
    updatedEntry = await crud.update_id(id, req)
    return updatedEntry

async def create_version(id,versionSchema):
    entry_newVersion = await crud.add_version_to_entry(id,versionSchema)
    return entry_newVersion