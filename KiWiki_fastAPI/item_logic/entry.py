from fastapi import Body
from fastapi.encoders import jsonable_encoder

from database import MONGOCRUD
from models.entry_schema import entrySchema

crud = MONGOCRUD('Entry') #Crud basico expandible con herencia.

async def add_entry(entry):
    entry_data = jsonable_encoder(entry)
    await crud.create_item(entry_data)

async def get_entries():
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