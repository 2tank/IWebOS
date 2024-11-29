import re
from datetime import datetime
from http.client import HTTPException
from typing import Optional

from bson import ObjectId
from fastapi import APIRouter, Body, Query

import item_logic.commentary as commentary_logic
from item_logic.commentary import commentaryCollection
from models.commentary_schema import commentary, commentaryUpdate

router = APIRouter()

@router.post("/")
async def add_commentary(commentary: commentary = Body(...)):
    if commentary.commentaryInReply:
        original_comentary_id = commentary.commentaryInReply
        await commentary_logic.add_commentary_reply(original_comentary_id, commentary)
    else:
        await commentary_logic.add_commentary(commentary)

"""
@router.get("/")
async def get_commentaries():
    commentaries = await commentary_logic.commentaryCollection.get_collection()
    return commentaries
"""

@router.get("/{id}")
async def get_commentary(id: str):
    commentary = await commentary_logic.commentaryCollection.get_id(id)
    return commentary

"""
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
"""

@router.delete("/{id}")
async def delete_commentary(id: str):
    comentarioParaEliminar = await commentary_logic.commentaryCollection.collection.find_one({"_id": ObjectId(id)})
    if comentarioParaEliminar['replies']:
        for replyID in comentarioParaEliminar['replies']:
            await commentary_logic.deleteCommentary(replyID)
    result = await commentary_logic.deleteCommentary(id)
    return result

@router.patch("/{id}")
async def update_commentary(id: str, req: commentaryUpdate = Body(...)):
    req = {k: v for k, v in req.model_dump().items() if v is not None}
    result = await commentary_logic.updateCommentary(id,req)
    return result

"""
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
"""


@router.get("/")
async def get_commentaries(
        user: Optional[str] = Query(None),
        entry_id: Optional[str] = Query(None),
        entry_version_id: Optional[str] = Query(None),
        only_main_commentaries: Optional[bool] = Query(None),
        sort_by_newest: Optional[bool] = Query(None),
        sort_by_oldest: Optional[bool] = Query(None),
    ):
    try:
        filter = {}
        if user:
            # filter["user"] = user
            # Utilizamos re.escape para evitar problemas con caracteres especiales en la cadena de búsqueda
            filter["user"] = {"$regex": re.escape(user),"$options": "i"}  # "i" es para búsqueda insensible a mayúsculas/minúsculas
        if entry_id:
            filter["entry"] = entry_id
            if entry_version_id:
                filter["entry_version"] = entry_version_id
        if only_main_commentaries:
            filter["commentaryInReply"] = None
        commentaries = await commentary_logic.get_commentaries(filter)

        if sort_by_newest:
            commentaries.sort(key=commentary_logic.extract_date, reverse=True)
        elif sort_by_oldest:
            commentaries.sort(key=commentary_logic.extract_date)
        return commentaries
    except:
        raise HTTPException(status_code=500, detail="No commentaries")

@router.get("/{id}/replies")
async def get_replies(id: str):
    result = await commentary_logic.getResponses(id)
    return result