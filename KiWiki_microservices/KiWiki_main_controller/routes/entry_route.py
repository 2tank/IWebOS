from fastapi import APIRouter, HTTPException, Body, Query
import httpx
from urls import config
from models.entry_schema import entrySchema, entryType
from models.version_schema import versionSchema
from typing import Optional, List
from datetime import datetime

entry_url = config["entry_url"]
router = APIRouter()

@router.post("/")
async def add_entry(content: str, entry: entrySchema = Body(...)):
    """
    Agrega una nueva entrada en el sistema.

    Parámetros:
        - content (str): Contenido de la entrada.
        - entry (entrySchema): Esquema de la entrada.

    Retorno:
        - dict: Información de la entrada agregada si es exitosa.

    Excepciones:
        - HTTPException: Error en la solicitud al servidor externo.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{entry_url}/", json={"content": content, "entry": entry.dict()})
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
):
    """
    Obtiene una lista de entradas aplicando filtros opcionales.

    Parámetros:
        - year (int, opcional): Año de creación.
        - month (int, opcional): Mes de creación.
        - day (int, opcional): Día específico de creación.
        - description (str, opcional): Descripción parcial.
        - tags (List[entryType], opcional): Lista de etiquetas.

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
        }

        filters = {k: v for k, v in filters.items() if v is not None and v != []}


        async with httpx.AsyncClient() as client:
            response = await client.get(f"{entry_url}/", params=filters)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="No entries")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="No entries")


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
        - id (str): ID de la entrada.

    Retorno:
        - dict: Información de la entrada eliminada.

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


@router.put("/{id}")
async def update_entry(id: str, req: entrySchema = Body(...)):
    """
    Actualiza una entrada específica.

    Parámetros:
        - id (str): ID de la entrada.
        - req (entrySchema): Nuevos datos para la entrada.

    Retorno:
        - dict: Información de la entrada actualizada.

    Excepciones:
        - HTTPException: Error en la solicitud al servidor externo.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(f"{entry_url}/{id}", json=req.dict())
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to update entry")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update entry")


@router.post("/{id}/versions/")
async def create_version_entry(id: str, version: versionSchema = Body(...)):
    """
    Crea una nueva versión de una entrada.

    Parámetros:
        - id (str): ID de la entrada.
        - version (versionSchema): Datos de la versión.

    Retorno:
        - dict: Información de la nueva versión.

    Excepciones:
        - HTTPException: Error en la solicitud al servidor externo.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{entry_url}/{id}/versions/", json=version.dict())
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Version creation failed")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Version creation failed")


@router.get("/{id}/versions/")
async def get_versions_by_entry_id(id: str):
    """
    Obtiene todas las versiones de una entrada.

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
        raise HTTPException(status_code=500, detail="No versions found")
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="No versions found")
