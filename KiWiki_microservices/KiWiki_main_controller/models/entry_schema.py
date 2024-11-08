from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Literal

#No tengo claro si dejar los tags como literales internos o pasarlo a una tabla de la bbdd
#por ahora lo dejo aqui por simplicidad y tambien pienso que será algo predefinido
#y que se editará con muy poca frecuencia por lo que no lo veo mal aquí.
entryType = Literal['POLITICS', 'SPORTS', 'CINEMA']  # Ejemplo de tipos permitidos

class entrySchema(BaseModel):
    title: str = Field(..., max_length=20, description="Titulo de la Entrada")
    creator : str = Field(..., max_length=20, description="Creador de la Entrada")
    creationDate: datetime = Field(..., description="Fecha creación de la Entrada")
    description: str = Field(..., description="Descripción de la entrada")
    tags: List[entryType] = Field(...,description="Tags asociados a la entrada")
    actual_version: str = None