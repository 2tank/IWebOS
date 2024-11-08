"""Modules for wiki."""
from typing import List
from datetime import datetime

from item_logic.crud_inheritance.wiki_crud import WIKICRUD


wiki_crud = WIKICRUD()

async def get_wikis() -> List:
    """
    Obtiene una lista de todas las wikis disponibles en la colección.

    Returns:
        List: Lista de documentos de wikis en formato JSON.
    """
    wikis = await wiki_crud.get_collection()
    return wikis


async def post_wiki(entry) -> dict:
    """
    Crea una nueva wiki utilizando los datos proporcionados.

    Args:
        entry (dict): Datos de la nueva wiki a crear.

    Returns:
        dict: Devuelve en formato dict el id de la wiki creada.
    """
    entry_data = entry.dict()
    result = await wiki_crud.create_item(entry_data)
    return result


async def get_wiki_name(content: str) -> List:
    """
    Obtiene una lista de entradas de wiki por su nombre.

    Args:
        content (str): El nombre del wiki para buscar las entradas.

    Returns:
        List: Devuelve una lista de entradas asociadas al nombre del wiki.

    Raises:
        ValueError: Si no se encuentran entradas en el wiki.
    """
    result = await wiki_crud.get_name(content, "name")

    if not result:
        raise ValueError("No entries found in the wiki")  # Lanza una excepción genérica

    return result


async def get_wiki_id(content: str) -> List:
    """
    Obtiene una lista de entradas de wiki por su ID.

    Args:
        content (str): El ID del wiki para buscar las entradas.

    Returns:
        List: Devuelve una lista de entradas asociadas al ID del wiki.

    Raises:
        ValueError: Si no se encuentran entradas en el wiki.
    """
    result = await wiki_crud.get_id(content)

    if not result:
        raise ValueError("No entries found in the wiki")  # Lanza una excepción genérica

    return result


async def add_entries(id_wiki: str, id_entry: str) -> dict:
    """"
    Añade una entrada a una wiki existente.

    Args:
        id_wiki (str): El ID de la wiki a la que se añadirá la entrada.
        id_entry (str): El ID de la entrada que se añadirá.

    Returns:
        dict: Devuelve un mensaje de éxito o resultado de la operación.
    """
    result = await wiki_crud.add_entry_wiki(id_wiki, id_entry)
    return result

async def delete_entries(id_wiki: str, id_entry: str) -> dict:
    """
    Elimina una entrada de una wiki existente.

    Args:
        id_wiki (str): El ID de la wiki de la cual se eliminará la entrada.
        id_entry (str): El ID de la entrada que se eliminará.

    Returns:
        dict: Mensaje de éxito o el resultado de la operación.
    """
    result = await wiki_crud.delete_entry_wiki(id_wiki, id_entry)
    return result


async def delete_wiki(id_wiki: str) -> dict:
    """"
    Elimina una wiki ya existente.

    Args:
        id_wiki (str): El ID de la wiki a la que se eliminará.

    Returns:
        dict: Devuelve un mensaje de éxito o resultado de la operación.
    """

    result = await wiki_crud.delete_id(id_wiki)
    return result

async def get_wikis_date(content: datetime, condition: str) -> List:
    result = await wiki_crud.get_wiki_date(content, condition)
    return result


async def get_wikis_author(name_author: str) -> List:
    result = await wiki_crud.get_wikis_author(name_author)
    return result



async def modify_wiki(id_wiki: str, wiki_data_modify: dict) -> dict:
    result = await wiki_crud.modify_wiki(id_wiki, wiki_data_modify)
    return result
