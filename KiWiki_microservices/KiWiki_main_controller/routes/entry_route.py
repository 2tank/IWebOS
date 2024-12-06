from fastapi import APIRouter, HTTPException, Body, Query
import httpx
from urls import config
from models.entry_schema import entrySchema, entryType
from models.version_schema import versionSchema
from typing import Optional, List, Dict

entry_url = config["entry_url"]
router = APIRouter()

@router.post("/")
async def add_entry(entry: entrySchema = Body(...)):
    """
    Crea una nueva entrada.

    Parámetros:
        - entry (entrySchema): Datos de la entrada a crear.

    Retorno:
        - dict: Datos de la entrada creada.

    Excepciones:
        - HTTPException: Error en la solicitud al servidor externo.
    """
    try:
        print(entry)
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{entry_url}/", json=entry.model_dump())
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Upload failed")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Upload failed")

@router.get("/")
async def get_entries(
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    day: Optional[int] = Query(None),
    description: Optional[str] = Query(None),
    tags: Optional[List[entryType]] = Query(None),
    getTags: Optional[bool] = Query(None),
    wiki: Optional[str] = Query(None),
):
    """
    Obtiene una lista de entradas aplicando filtros opcionales.

    Parámetros:
        - year (int, opcional): Año de creación.
        - month (int, opcional): Mes de creación.
        - day (int, opcional): Día específico de creación.
        - description (str, opcional): Descripción parcial.
        - tags (List[entryType], opcional): Lista de etiquetas.
        - getTags (bool, opcional): si es verdadero, devuelve la lista completa de tags.
        - wiki (str, opcional): id de la wiki a la que pertenece la entrada.

    Retorno:
        - List[dict]: Lista de entradas filtradas.

    Excepciones:
        - HTTPException: Error en la solicitud al servidor externo.
    """
    try:
        filters = {
            "year": year,
            "month": month,
            "day": day,
            "description": description,
            "tags": tags,
            "getTags" : getTags,
            "wiki" : wiki,
        }

        filters = {k: v for k, v in filters.items() if v is not None and v != []}

        async with httpx.AsyncClient() as client:
            response = await client.get(f"{entry_url}/", params=filters)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="No entries found")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="No entries found")

@router.get("/{id}")
async def get_entry(id: str):
    """
    Obtiene una entrada específica por ID.

    Parámetros:
        - id (str): ID de la entrada.

    Retorno:
        - dict: Datos de la entrada.

    Excepciones:
        - HTTPException: Error en la solicitud al servidor externo.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{entry_url}/{id}")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="No entry found")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="No entry found")

@router.delete("/{id}")
async def delete_entry(id: str):
    """
    Elimina una entrada específica por ID.

    Parámetros:
        - id (str): ID de la entrada a eliminar.

    Retorno:
        - dict: Datos de la entrada eliminada.

    Excepciones:
        - HTTPException: Error en la solicitud al servidor externo.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{entry_url}/{id}")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to delete entry")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete entry")


# este tengo que tocarlo

@router.put("/{id}")
async def update_entry(id: str, req: Dict = Body(...)):
    """
    Actualiza una entrada específica por ID.

    Parámetros:
        - id (str): ID de la entrada a actualizar.
        - req (entrySchema): Datos de la entrada actualizada.

    Retorno:
        - dict: Datos de la entrada actualizada.

    Excepciones:
        - HTTPException: Error en la solicitud al servidor externo.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(f"{entry_url}/{id}", json=req.model_dump())
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to update entry")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update entry")



@router.post("/{id}/versions/")
async def create_entry_version(id: str, version: versionSchema = Body(...)):
    """
    Crea una nueva versión para una entrada específica.

    Parámetros:
        - id (str): ID de la entrada.
        - version (versionSchema): Datos de la nueva versión.

    Retorno:
        - dict: Datos de la nueva versión creada.

    Excepciones:
        - HTTPException: Error en la solicitud al servidor externo.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{entry_url}/{id}/versions/", json=version.model_dump())
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to create version")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create version")

@router.get("/{id}/versions/")
async def get_versions_by_entry_id(id: str):
    """
    Obtiene todas las versiones de una entrada específica.

    Parámetros:
        - id (str): ID de la entrada.

    Retorno:
        - List[dict]: Lista de versiones de la entrada.

    Excepciones:
        - HTTPException: Error en la solicitud al servidor externo.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{entry_url}/{id}/versions/")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to find versions")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to find versions")

@router.get("/{id}/currentVersion/")
async def get_actual_version_by_entry_id(id: str):
    """
    Obtiene la versión actual de una entrada específica.

    Parámetros:
        - id (str): ID de la entrada.

    Retorno:
        - dict: Datos de la versión actual de la entrada.

    Excepciones:
        - HTTPException: Error en la solicitud al servidor externo.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{entry_url}/{id}/currentVersion/")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to find actual version")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to find actual version")

@router.put("/{entry_id}/versions/{version_id}")
async def update_version_by_id(entry_id: str, version_id: str):
    """
    Actualiza la versión actual de una entrada específica.

    Parámetros:
        - entry_id (str): ID de la entrada.
        - version_id (str): ID de la versión a actualizar.

    Retorno:
        - dict: Datos de la nueva versión actualizada.

    Excepciones:
        - HTTPException: Error en la solicitud al servidor externo.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(f"{entry_url}/{entry_id}/versions/{version_id}")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to update actual version")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update actual version")


@router.put("/{entry_id}/wiki/{wiki_id}")
async def add_wiki_to_entry(entry_id: str, wiki_id: str):
    """
    Añade el id de la wiki asociada a una entrada existente.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(f"{entry_url}/{entry_id}/wiki/{wiki_id}")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to update the wiki")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update actual")