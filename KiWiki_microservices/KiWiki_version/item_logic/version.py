from fastapi.encoders import jsonable_encoder
from item_logic.crud_inheritance.version_crud import VersionCRUD
from item_logic.crud_inheritance.entry_crud import ENTRYCRUD


entry_crud = ENTRYCRUD()
crud = VersionCRUD()

async def get_versions(filter):

    if(len(filter) > 0):
        versions = await crud.get_by_filter(filter)
    else:
        versions = await crud.get_collection()

    return versions

async def get_version_by_id(id):
    version = await crud.get_id(id)
    return version

async def get_versions_by_entryid(entry_id,reverted):
    versions = await crud.get_versions_by_entryid(entry_id,reverted)
    return versions

async def get_entry_by_version_id(id):
    version = await crud.get_id(id)
    entry_id = version['entry_id']

    #Entrada referenciada
    entry = await entry_crud.get_id(entry_id)

    return entry


async def rollback_version_by_id(id):
    version = await crud.get_id(id)
    entry_id = version['entry_id']

    # Entrada referenciada
    entry = await entry_crud.get_id(entry_id)

    actualVersionID = entry["actual_version"]
    respuesta = None

    if actualVersionID == id:
        # Obtener todas las versiones de la entrada, incluyendo las revertidas
        versions = await crud.get_versions_by_entryid(entry_id, reverted=True)

        # Filtrar las versiones para obtener la más reciente que no esté revertida y no sea la actual
        non_reverted_versions = [
            v for v in versions 
            if not v["reverted"] and v["_id"] != actualVersionID
        ]

        if non_reverted_versions:
            # Ordenar las versiones por fecha de edición en orden descendente
            non_reverted_versions.sort(key=lambda v: v["editDate"], reverse=True)
            new_version = non_reverted_versions[0]

            # Actualizar la entrada con la nueva versión actual
            await entry_crud.update_id(entry_id, {"actual_version": new_version["_id"]})

            # Marcar la versión actual como revertida
            await crud.update_id(id, {"reverted": True})
            respuesta = new_version["_id"]
        else:
            raise Exception("No hay versiones no revertidas disponibles para hacer rollback.")
    else:
        raise Exception("La versión actual no coincide con la versión proporcionada para rollback.")

    return respuesta



async def delete_version_by_id(id):
    version = await crud.get_id(id)
    entry_id = version['entry_id']

    #Entrada referenciada
    entry = await entry_crud.get_id(entry_id)

    actualVersionID = entry["actual_version"]
    deleted_version = None

    if ( actualVersionID != id ) : # borra si no es actual
        deleted_version = await crud.delete_id(id)

    return deleted_version


# rollback manual (elige que version pasa a ser la actual)
async def update_actual_version_by_id(entry_id,version_id):
    versions = await crud.get_versions_by_entryid(entry_id,reverted=False)

    if any(str(v["_id"]) == version_id for v in versions):
        await entry_crud.update_id(entry_id, {"actual_version": version_id})
        await crud.update_id(version_id, {"reverted": False})
    else:
        return False

    return True