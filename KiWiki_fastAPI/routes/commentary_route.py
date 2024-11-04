from datetime import datetime
from http.client import HTTPException
from typing import Optional

from fastapi import APIRouter, Body, Query
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
    result = await commentary_logic.deleteCommentary(id)
    return result

@router.put("/{id}")
async def update_commentary(id: str, req: commentary = Body(...)):
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


def extract_date(commentary):
    try:
        fullDate = commentary['date']
        dateSplitBase = fullDate.split('T')
        yearMonthDay = dateSplitBase[0].split('-')
        dateSplitRest = dateSplitBase[1].split('.')
        hourMinuteSecond = dateSplitRest[0].split(':')

        # Crear el valor único cronológicamente ordenado
        unique_value = (
            f"{int(yearMonthDay[0]):04}"  # Año (4 dígitos)
            f"{int(yearMonthDay[1]):02}"  # Mes (2 dígitos)
            f"{int(yearMonthDay[2]):02}"  # Día (2 dígitos)
            f"{int(hourMinuteSecond[0]):02}"  # Hora (2 dígitos)
            f"{int(hourMinuteSecond[1]):02}"  # Minuto (2 dígitos)
            f"{int(hourMinuteSecond[2]):02}"  # Segundo (2 dígitos)
        )

        return int(unique_value)  # Convertir a entero para mantener orden cronológico
    except KeyError:
        return 0

@router.get("/")
async def get_commentaries(
        user_id: Optional[str] = Query(None),
        entry_id: Optional[str] = Query(None),
        entry_version_id: Optional[str] = Query(None),
        only_main_commentaries: Optional[bool] = Query(None),
        sort_by_newest: Optional[bool] = Query(None),
        sort_by_oldest: Optional[bool] = Query(None),
    ):
    try:
        filter = {}
        if user_id:
            filter["user"] = user_id
        if entry_id:
            filter["entry"] = entry_id
            if entry_version_id:
                filter["entry_version"] = entry_version_id
        if only_main_commentaries:
            filter["commentaryInReply"] = None
        commentaries = await commentary_logic.get_entries(filter)
        if sort_by_newest:
            commentaries.sort(key=extract_date, reverse=True)
        elif sort_by_oldest:
            commentaries.sort(key=extract_date)
        return commentaries
    except:
        raise HTTPException(status_code=500, detail="No entries")

@router.get("/{id}/replies")
async def get_replies(id: str):
    result = await commentary_logic.getResponses(id)
    return result