from bson import ObjectId

from database import MONGOCRUD

commentaryCollection = MONGOCRUD('Commentary')


def commentaryHelper(commentary) -> dict:
    return {
        "id": str(commentary["_id"]),
        "user": commentary["user"],
        "entry": commentary["entry"],
        "content": commentary["content"],
        "date": commentary["date"],
        "entryRating": commentary["entryRating"],
        "commentaryInReply": commentary["commentaryInReply"],
    }

async def hasResponses(id: str) -> bool:
    """

    :param id:
    :return:
    """
    comentarioEvaluando = await commentaryCollection.collection.find_one({"_id": ObjectId(id)})
    if comentarioEvaluando:
        comentarioEvaluandoDict = commentaryHelper(comentarioEvaluando)
        respuesta = await commentaryCollection.collection.find_one(
            {"commentaryInReply": ObjectId(id), "entry": comentarioEvaluandoDict.get('entry')}
        )
        return bool(respuesta)
    return False


async def numberOfResponses(id: str) -> int:
    """

    :param id:
    :return:
    """
    comentarioEvaluando = await commentaryCollection.collection.find_one({"_id": ObjectId(id)})
    if comentarioEvaluando:
        comentarioEvaluandoDict = commentaryHelper(comentarioEvaluando)
        listaRespuestas = await commentaryCollection.collection.find(
            {"commentaryInReply": ObjectId(id), "entry": comentarioEvaluandoDict.get('entry')}
        )
        return listaRespuestas.count()
    return 0

async def getResponses(id: str) -> list:
    """
    Devuelve los comentarios en respuesta al comentario que le pasamos por id
    :param id: Identificador del comentario al que obtenemos las respuestas
    :return: Devuelve una lista con las respuestas a este comentario
    """
    comentarioEvaluando = await commentaryCollection.collection.find_one({"_id": ObjectId(id)})
    if comentarioEvaluando:
        comentarioEvaluandoDict = commentaryHelper(comentarioEvaluando)
        listaRespuestas = await commentaryCollection.collection.find(
            {"commentaryInReply": ObjectId(id), "entry": comentarioEvaluandoDict.get('entry')}
        )
        return listaRespuestas
    return None