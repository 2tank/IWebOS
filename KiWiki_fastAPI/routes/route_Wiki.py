from email.policy import default

from fastapi import APIRouter, HTTPException
from models import WikiModel
from database import collection
from bson import ObjectId

router = APIRouter()

@router.get("/test_collection")
async def test_collection():
    try:
        # Hacer una consulta básica para verificar si collection está funcionando
        document = await collection.find_one()  # Buscar el primer documento en la colección
        if document:
            return {"status": "Collection is working!", "document": document}
        else:
            return {"status": "Collection is working, but no documents found!"}
    except Exception as e:
        return {"status": "Collection not working", "error": str(e)}

@router.get("/pene/{id_de_broma}", response_model=WikiModel)
async def get_pene(id_de_broma: int):
    item = await collection.find_one({"id_de_broma": id_de_broma})
    if item:
        return item
    raise HTTPException(status_code=404, detail=f"Item with ID {id} not found")

@router.get("/penes/", response_model=WikiModel)
async def get_lista_pene():
    items = await collection.find().to_list(100)
    if items:
        return items
    raise HTTPException(status_code=404, detail=f"Not found")