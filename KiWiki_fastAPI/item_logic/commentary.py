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
        "entry_version": commentary["entry_version"],
        "content": commentary["content"],
        "date": commentary["date"],
        "entryRating": commentary["entryRating"],
        "commentaryInReply": commentary["commentaryInReply"],
        "replies": commentary["replies"],
    }

async def add_commentary(commentary):
    """
    Añade el comentario a la base de datos
    :param commentary: Model de comentario
    :return: Devuelve el resultado del metodo de MONGOCRUD
    """
    commentary_data = jsonable_encoder(commentary)
    result = await commentaryCollection.create_item(commentary_data)
    return result

async def add_commentary_reply(original_commentary_id, reply):
    """
    Añade el comentario cuando es en respuesta a otro comentario
    :param original_commentary_id: Es el id del comentario al que esta respondiendo
    :param reply: Es la respuesta que ha introducido el usuario comentando
    :return: Devuelve el resultado del metodo de collection
    """
    reply_data = jsonable_encoder(reply)
    reply_data = await commentaryCollection.create_item(reply_data)
    result = await commentaryCollection.collection.update_one(
        {"_id": ObjectId(original_commentary_id)},
        {"$push": {"replies": reply_data['_id']}},
    )
    return result

async def hasResponses(id: str) -> bool:
    """
    Comprueba si el comentario evaluando tiene respuestas
    :param id: El id del comentario que queremos comprobar
    :return: Un valor booleano (True signigica que tiene respuestas)
    """
    comentarioEvaluando = await commentaryCollection.collection.find_one({"_id": ObjectId(id)})
    if comentarioEvaluando:
        return len(comentarioEvaluando['replies']) > 0
    return False


async def numberOfResponses(id: str) -> int:
    """
    Devuelve el numero de respuestes al comentario
    :param id: El id del comentario que queremos comprobar
    :return: Un valor numerico entero (numero de respuestas)
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
    """
    Actualiza un cometario de forma simple
    :param id: El id del comentario que queremos actualizar
    :param commentary: Es el cuerpo del comentario actualizado
    :return: Devuelve el resultado del metodo heredado de MONGOCRUD
    """
    resultado = await commentaryCollection.update_id(id, commentary)
    return resultado

async def deleteCommentary(id: str):
    """
    Eliminar un comentario y ademas si es una respuesta elimina la referencia en
    el comentario al que respondia
    :param id: El id del comentario que queremos eliminar
    :return: Devuelve el resultado del metodo que hereda de MONGOCRUD
    """
    comentarioParaEliminar = await commentaryCollection.collection.find_one({"_id": ObjectId(id)})
    if comentarioParaEliminar['commentaryInReply']:
        comentarioEnRespuesta = await commentaryCollection.collection.find_one({"_id": ObjectId(comentarioParaEliminar['commentaryInReply'])})
        comentarioEnRespuesta['replies'].remove(str(comentarioParaEliminar['_id']))
        await updateCommentary(str(comentarioEnRespuesta['_id']), comentarioEnRespuesta)
    deletedComentary = await commentaryCollection.delete_id(id)
    return deletedComentary

async def getAllCommentariesFromEntry(entry_id: str) -> list[str]:
    """
    Obtiene todos los comentarios de una entrada, todos y de todas las versiones
    :param entry_id: El id de la entrada en la que buscamos
    :return: Devuelve una lista con los Id de los comentarios
    """
    list = []
    listComentaries = await commentaryCollection.collection.find({"entry": entry_id}).to_list(length=None)
    for commentary in listComentaries:
        list.append(str(commentary['_id']))
    return list

async def getMainCommentariesFromEntry(entry_id: str) -> list[str]:
    """
    Obtiene todos los comentarios principales (que no son respuesta a otro)
    de una entrada, todos y de todas las versiones
    :param entry_id: El id de la entrada en la que buscamos
    :return: Devuelve una lista con los Id de los comentarios
    """
    list = []
    listaComentarios = await commentaryCollection.collection.find(
        {"entry": entry_id, "$or": [{"commentaryInReply": None}, {"commentaryInReply": ""}]}
    ).to_list(length=None)
    for comentario in listaComentarios:
        list.append(str(comentario['_id']))
    return list

async def getAllCommentariesFromEntrySpecificVersion(entry_id: str, entry_version_id: str) -> list[str]:
    """
    Obtiene todos los comentarios de una entrada, todos los de una version especifica
    :param entry_id: El id de la entrada en la que buscamos
    :param entry_version_id: El id de la version de la entrada en la que buscamos
    :return: Devuelve una lista con los Id de los comentarios
    """
    list = []
    listComentaries = await commentaryCollection.collection.find(
        {"entry": entry_id, "entry_version": entry_version_id}
    ).to_list(length=None)
    for commentary in listComentaries:
        list.append(str(commentary['_id']))
    return list

async def getMainCommentariesFromEntrySpecificVersion(entry_id: str, entry_version_id: str) -> list[str]:
    """
    Obtiene todos los comentarios principales (que no son respuesta a otro)
    de una entrada en una version especifica
    :param entry_id: El id de la entrada en la que buscamos
    :param entry_version_id: El id de la version de la entrada en la que buscamos
    :return: Devuelve una lista con los Id de los comentarios
    """
    list = []
    listaComentarios = await commentaryCollection.collection.find(
        {"entry": entry_id, "entry_version": entry_version_id,"$or": [{"commentaryInReply": None}, {"commentaryInReply": ""}]}
    ).to_list(length=None)
    for comentario in listaComentarios:
        list.append(str(comentario['_id']))
    return list