from fastapi import APIRouter, HTTPException, Body
from fastapi.encoders import jsonable_encoder

from database import MONGOCRUD
from models.wiki_schema import WikiSchema
from datetime import date,datetime

crud = MONGOCRUD('Wiki') 


async def get_wikis():
    wikis = await crud.get_collection()
    return wikis


async def post_wiki(entry):
    entry_data = jsonable_encoder(entry)
    result = await crud.create_item(entry_data)
