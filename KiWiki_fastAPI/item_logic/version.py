from fastapi.encoders import jsonable_encoder
from item_logic.crud_inheritance.version_crud import VersionCRUD
from item_logic.crud_inheritance.entry_crud import ENTRYCRUD


entry_crud = ENTRYCRUD()
crud = VersionCRUD()

async def get_versions():
    versions = await crud.get_collection()
    return versions

async def get_version_by_id(id):
    version = await crud.get_id(id)
    return version

async def get_versions_by_entryid(entry_id):
    versions = await crud.get_versions_by_entryid(entry_id)
    return versions

async def rollback_version_by_id(id):
    version = await crud.get_id(id)
    entry_id = version['entry_id']

    #Entrada referenciada
    entry = await entry_crud.get_id(entry_id)

    actualVersionID = entry["actual_version"]
    deleted_version = None

    if ( actualVersionID != id ) : # borra si no es actual
        # deleted_version = await crud.delete_id(id) # descomentar si quieres: borrar de la bdd una version antigua
        deleted_version = None
    else: # si es actual hace rollback pero no la borra
        versions = await crud.get_versions_by_entryid(entry_id)
        numVersions = len(versions)

        if (numVersions > 1):
            newId = versions[1]["_id"]

            #actualizar referencia a nueva version actual   
            await entry_crud.update_id(entry_id, {"actual_version": newId})            

    return deleted_version


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