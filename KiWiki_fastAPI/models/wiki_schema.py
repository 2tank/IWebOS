from pydantic import BaseModel, Field
from datetime import datetime #Ponemos el as DateType ya que si no entra en conflicto la línea 10 con el date y el Field
from typing import List

class WikiSchema(BaseModel):

    name: str = Field(..., max_length=20, description="Nombre de la wiki")
    creator: str = Field(..., max_length=20, description="Nombre del creador de la wiki")
    description: str = Field(..., max_length=50, description="Decripción de la wiki")
    date: datetime = Field(..., description="Fecha de creación de la wiki")
    entries: List[str] = Field(None, description="Lista de entradas asociadas")