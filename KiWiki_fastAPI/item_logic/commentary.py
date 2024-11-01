from bson import ObjectId
from fastapi.encoders import jsonable_encoder

from database import MONGOCRUD
from models.commentary_schema import commentary

commentaryCollection = MONGOCRUD('Commentary')


def commentaryHelper(commentary) -> dict:
    return {
        "_id": str(commentary["_id"]),
        "user": commentary["user"],
        "entry": commentary["entry"],
        "content": commentary["content"],
        "date": commentary["date"],
        "entryRating": commentary["entryRating"],
        "commentaryInReply": commentary["commentaryInReply"],
        "replies": commentary["replies"],
    }

async def add_commentary(commentary):
    """

    :param commentary:
    :return:
    """
    commentary_data = jsonable_encoder(commentary)
    await commentaryCollection.create_item(commentary_data)

async def add_commentary_reply(original_commentary_id, reply):
    """

    :param original_commentary_id:
    :param reply:
    :return:
    """
    reply_data = jsonable_encoder(reply)
    reply_data = await commentaryCollection.create_item(reply_data)
    await commentaryCollection.collection.update_one(
        {"_id": ObjectId(original_commentary_id)},
        {"$push": {"replies": reply_data['_id']}},
    )

async def hasResponses(id: str) -> bool:
    """

    :param id:
    :return:
    """
    comentarioEvaluando = await commentaryCollection.collection.find_one({"_id": ObjectId(id)})
    if comentarioEvaluando:
        return len(comentarioEvaluando['replies']) > 0
    return False


async def numberOfResponses(id: str) -> int:
    """

    :param id:
    :return:
    """
    comentarioEvaluando = await commentaryCollection.collection.find_one({"_id": ObjectId(id)})
    if comentarioEvaluando:
        return len(comentarioEvaluando['replies'])
    return 0

async def getResponses(id: str) -> list[dict]:
    """
    Devuelve los comentarios en respuesta al comentario que le pasamos por id
    :param id: Identificador del comentario al que obtenemos las respuestas
    :return: Devuelve una lista con las respuestas a este comentario
    """
    listaRespuestas = []
    comentarioEvaluando = await commentaryCollection.collection.find_one({"_id": ObjectId(id)})
    if comentarioEvaluando:
        for replyId in comentarioEvaluando['replies']:
            respuesta = await commentaryCollection.collection.find_one({"_id": ObjectId(replyId)})
            respuesta = commentaryHelper(respuesta) #Commentary helper hace que el id se devuelva en str en lugar de en ObjectId (lo cual bloquea fast api)
            listaRespuestas.append(respuesta)
    return listaRespuestas

async def updateCommentary(id: str, commentary):
    resultado = await commentaryCollection.update_id(id, commentary)
    return resultado

async def deleteCommentary(id: str):
    """

    :param id:
    :return:
    """
    comentarioParaEliminar = await commentaryCollection.collection.find_one({"_id": ObjectId(id)})
    if comentarioParaEliminar['commentaryInReply']:
        comentarioEnRespuesta = await commentaryCollection.collection.find_one({"_id": ObjectId(comentarioParaEliminar['commentaryInReply'])})
        comentarioEnRespuesta['replies'].remove(str(comentarioParaEliminar['_id']))
        await updateCommentary(str(comentarioEnRespuesta['_id']), comentarioEnRespuesta)
    deletedComentary = await commentaryCollection.delete_id(id)
    return deletedComentary