from fastapi import APIRouter, Body
from fastapi.encoders import jsonable_encoder

import item_logic.commentary as commentary_logic
from item_logic.commentary import updateCommentary
from models.commentary_schema import commentary

router = APIRouter()

@router.post("/")
async def add_commentary(commentary: commentary = Body(...)):
    if commentary.commentaryInReply:
        original_comentary_id = commentary.commentaryInReply
        await commentary_logic.add_commentary_reply(original_comentary_id, commentary)
    else:
        await commentary_logic.add_commentary(commentary)

@router.get("/")
async def get_commentaries():
    commentaries = await commentary_logic.commentaryCollection.get_collection()
    return commentaries

@router.get("/{id}")
async def get_commentary(id: str):
    commentary = await commentary_logic.commentaryCollection.get_id(id)
    return commentary

@router.get("/hasResponses/{id}")
async def get_commentary_has_response(id: str):
    result = await commentary_logic.hasResponses(id)
    return result

@router.get("/numberOfResponses/{id}")
async def get_commentary_number_of_responses(id: str):
    result = await commentary_logic.numberOfResponses(id)
    return result

@router.get("/getResponses/{id}")
async def get_commentary_get_responses(id: str):
    result = await commentary_logic.getResponses(id)
    return result

@router.delete("/{id}")
async def delete_commentary(id: str):
    result = await commentary_logic.deleteCommentary(id)
    return result

@router.put("/{id}")
async def update_commentary(id: str, req: commentary = Body(...)):
    req = {k: v for k, v in req.model_dump().items() if v is not None}
    result = await commentary_logic.updateCommentary(id,req)
    return result