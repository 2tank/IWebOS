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

    #Entrada referenciada
    entry = await entry_crud.get_id(entry_id)
    response = "NI HA ENTRADO";

    actualVersionID = entry["actual_version"]

    if ( actualVersionID == id ) :
        versions = await crud.get_versions_by_entryid(entry_id,reverted=True)
        numVersions = len(versions)

        if (numVersions > 1):
            newId = versions[1]["_id"]

            #actualizar referencia a nueva version actual
            response = await update_actual_version_by_id(entry_id,newId);
            await crud.update_id(version["_id"],{"reverted": True})
    return response


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