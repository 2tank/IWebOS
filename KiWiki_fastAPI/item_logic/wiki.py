from fastapi import APIRouter, HTTPException, Body
from fastapi.encoders import jsonable_encoder
from bson import ObjectId

from models.wiki_schema import WikiSchema
from datetime import date,datetime
from item_logic.crud_inheritance.wiki_crud import WIKICRUD
 
wiki_crud = WIKICRUD()

async def get_wikis():
    wikis = await wiki_crud.get_collection()
    return wikis


async def post_wiki(entry):
    entry_data = jsonable_encoder(entry)
    result = await wiki_crud.create_item(entry_data)
    return result


async def get_entries_name(content):
    result = await wiki_crud.get_entries_wiki_name(content, "get_name")

    if not result:
        raise ValueError("No entries found in the wiki")  # Lanza una excepción genérica
    
    return result["entries"]


async def get_entries_id(content):
    result = await wiki_crud.get_entries_wiki_id(content, "get_id")

    if not result:
        raise ValueError("No entries found in the wiki")  # Lanza una excepción genérica
    
    return result["entries"]

async def add_entries(id_wiki: str, id_entry: str):
    result = await wiki_crud.add_entry_wiki(id_wiki, id_entry)
    return result 


