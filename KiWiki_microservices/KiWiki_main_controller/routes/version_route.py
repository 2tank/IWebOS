from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from urls import config
from datetime import datetime
import httpx

router = APIRouter()
version_url = config["version_url"]

@router.get("/")
async def get_versions(
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    day: Optional[int] = Query(None),
    content_word: Optional[str] = Query(None)
):
    """
    Obtiene versiones filtradas por fecha y contenido.

    Parámetros:
    - year (int, opcional): Año de la versión.
    - month (int, opcional): Mes de la versión.
    - day (int, opcional): Día específico de la versión.
    - content_word (str, opcional): Palabra clave en el contenido.

    Retorno:
    - List[dict]: Lista de versiones filtradas.
    """
    try:
        filter_params = {
            "year": year,
            "month": month,
            "day": day,
            "content_word": content_word,
        }

        # Eliminamos del diccionario aquellos valores que sean None
        filter_params = {k: v for k, v in filter_params.items() if v is not None}
        # Construimos el rango de fechas
        if year:
            if month and day:
                start_date = datetime(year, month, day)
                end_date = datetime(year, month, day, 23, 59, 59)
            elif month:
                start_date = datetime(year, month, 1)
                end_date = datetime(year + 1, 1, 1) if month == 12 else datetime(year, month + 1, 1)
            else:
                start_date = datetime(year, 1, 1)
                end_date = datetime(year + 1, 1, 1)
            filter_params["editDate"] = {"$gte": start_date, "$lte": end_date}

        # Filtrado por palabra clave en contenido
        if content_word:
            filter_params["content"] = {"$regex": f".*{content_word}.*", "$options": "i"}

        async with httpx.AsyncClient() as client:
            response = await client.get(version_url, params=filter_params)
            response.raise_for_status()
            return response.json()

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve versions")


@router.get("/{id}")
async def get_version_by_id(id: str):
    """
    Obtiene una versión específica por ID.

    Parámetros:
    - id (str): ID de la versión.

    Retorno:
    - dict: Datos de la versión.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{version_url}/{id}")
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve version by ID")


@router.put("/{id}")
async def rollback_version_by_id(id: str):
    """
    Revierte una versión específica por ID.

    Parámetros:
    - id (str): ID de la versión.

    Retorno:
    - dict: Datos de la versión revertida.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(f"{version_url}/{id}/rollback")
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to rollback version by ID")


@router.delete("/{id}")
async def delete_version_by_id(id: str):
    """
    Elimina una versión específica por ID.

    Parámetros:
    - id (str): ID de la versión.

    Retorno:
    - dict: Información de la versión eliminada.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{version_url}/{id}")
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete version by ID")


@router.get("/{id}/entry")
async def get_entry_by_version_id(id: str):
    """
    Obtiene la entrada correspondiente a una versión específica.

    Parámetros:
    - id (str): ID de la versión.

    Retorno:
    - dict: Datos de la entrada correspondiente a la versión.
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{version_url}/{id}/entry")
            response.raise_for_status()
            return response.json()
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve entry by Version ID")
