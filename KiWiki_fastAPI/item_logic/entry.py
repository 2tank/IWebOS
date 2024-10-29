from fastapi import APIRouter, HTTPException, Body
from fastapi.encoders import jsonable_encoder

from database import MONGOCRUD
from models.entry_schema import entrySchema
from datetime import date,datetime

router = APIRouter()
crud = MONGOCRUD('Entry') #Crud basico expandible con herencia.

@router.post("/")
async def add_entry(entry: entrySchema = Body(...)):
    entry_data = jsonable_encoder(entry)
    await crud.create_item(entry_data)

@router.get("/")
async def get_entries():
    entries = await crud.get_collection()
    return entries

@router.get("/{id}")
async def get_entry(id):
    entry = await crud.get_id(id)
    return entry

@router.delete("/{id}")
async def delete_entry(id: str):
    deletedEntry = await crud.delete_id(id)
    return deletedEntry

@router.put("/{id}")
async def update_entry(id: str, req: entrySchema = Body(...)):
    req = {k: v for k, v in req.model_dump().items() if v is not None}
    updatedEntry = await crud.update_id(id, req)
    return updatedEntry