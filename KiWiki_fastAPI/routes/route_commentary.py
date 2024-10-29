from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

import item_logic.commentary as commentary_logic
from models.commentary_schema import commentary

router = APIRouter()

@router.post("/")
async def add_commentary(commentary: commentary = Body(...)):
    commentary_data = jsonable_encoder(commentary)
    await commentary_logic.commentaryCollection.create_item(commentary_data)

@router.get("/")
async def get_commentaries():
    commentaries = await commentary_logic.commentaryCollection.get_collection()
    return commentaries

@router.get("/{id}")
async def get_commentary(id: str):
    commentary = await commentary_logic.commentaryCollection.get_id(id)
    return commentary

@router.delete("/{id}")
async def delete_commentary(id: str):
    deletedComentary = await commentary_logic.commentaryCollection.delete_id(id)
    return deletedComentary

@router.put("/{id}")
async def update_commentary(id: str, req: commentary = Body(...)):
    req = {k: v for k, v in req.model_dump().items() if v is not None}
    updatedEntry = await commentary_logic.commentaryCollection.update_id(id, req)
    return updatedEntry