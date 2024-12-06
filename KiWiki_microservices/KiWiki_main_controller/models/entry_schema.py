from pydantic import BaseModel, Field, field_serializer, field_validator
from datetime import datetime, timezone, timedelta
from typing import List, Literal

entryType = Literal[
    'POLÍTICA', 
    'DEPORTES', 
    'CINE', 
    'TECNOLOGÍA', 
    'CIENCIA', 
    'HISTORIA', 
    'ARTE', 
    'LITERATURA', 
    'MÚSICA', 
    'SALUD', 
    'EDUCACIÓN', 
    'GEOGRAFÍA', 
    'FILOSOFÍA', 
    'RELIGIÓN', 
    'NEGOCIOS', 
    'GASTRONOMÍA', 
    'VIAJES', 
    'NATURALEZA', 
    'IDIOMAS', 
    'VIDEOJUEGOS', 
    'MODA', 
    'CULTURA', 
    'MITOLOGÍA', 
    'MEDIO AMBIENTE', 
    'PSICOLOGÍA', 
    'DERECHO', 
    'ECONOMÍA'
]

class entrySchema(BaseModel):
    title: str = Field(..., max_length=100, description="Titulo de la Entrada")
    creator : str = Field(..., max_length=20, description="Creador de la Entrada")
    creationDate: datetime = Field(default_factory=lambda:datetime.now(timezone(timedelta(hours=2))) ,description="Fecha creación de la Entrada")
    description: str = Field(...,max_length=500, description="Descripción de la entrada")
    tags: List[entryType] = Field(default_factory=list,description="Tags asociados a la entrada")
    wiki: str = Field(..., description="Wiki asociada a la entrada")
    actual_version: str = None

    model_config = {
        "json_schema_extra" : {
            "example" :
            {
                "title": "Entrada Prueba",
                "creator": "Creador Prueba",
                "description": "Descripcion Prueba",
                "tags": [
                    "POLÍTICA"
                ],
                "wiki": "",
                "actual_version": ""
            }
        }
    }

    @field_serializer("creationDate", mode="plain")
    def serialize_date(self, value: datetime) -> str:
        return value.isoformat()

    @field_serializer("tags", mode="plain")
    def serialize_tags(self, value: List[entryType]) -> List[str]:
        """
        Serializa el campo tags a una lista de cadenas
        """
        return [tag for tag in value] 