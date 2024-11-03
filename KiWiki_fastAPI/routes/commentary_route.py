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

@router.get("/commentaryResponses/{id}")
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

@router.get("/allCommentariesInEntry/{id_entrada}")
async def get_commentaries_in_entry(id_entrada: str):
    result = await commentary_logic.getAllCommentariesFromEntry(id_entrada)
    return result

@router.get("/mainCommentariesInEntry/{id_entrada}")
async def get_main_commentaries_in_entry(id_entrada: str):
    result = await commentary_logic.getMainCommentariesFromEntry(id_entrada)
    return result

@router.get("/allCommentariesInEntrySpecificVersion/{id_entrada}/{id_version}")
async def get_commentaries_in_entry_specific_version(id_entrada: str, id_version: str):
    result = await commentary_logic.getAllCommentariesFromEntrySpecificVersion(id_entrada, id_version)
    return result

@router.get("/mainCommentariesInEntrySpecificVersion/{id_entrada}/{id_version}")
async def get_main_commentaries_in_entry_specific_version(id_entrada: str, id_version: str):
    result = await commentary_logic.getMainCommentariesFromEntrySpecificVersion(id_entrada, id_version)
    return result