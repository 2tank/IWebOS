from fastapi import APIRouter, HTTPException, Body
from fastapi.encoders import jsonable_encoder

from database import MONGOCRUD
from models.wiki_model import WikiModel
from datetime import date,datetime

crud = MONGOCRUD('Wiki') 


async def get_wikis():
    wikis = await crud.get_collection()
    return wikis
