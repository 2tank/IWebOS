from pydantic import BaseModel, Field, HttpUrl, field_validator
from datetime import datetime, timezone, timedelta
from typing import List, Optional

class Attachment(BaseModel):
    type: str = Field(...,description="Tipo de archivo 'image', 'file'...")
    url: str = Field(..., description="Url adjunto al archivo")
    file_name: str = Field(None, description="Nombre del archivo")

    @field_validator('url')
    def validate_attachment_url(cls, value):
        try:
            HttpUrl(value)
        except ValueError:
            raise ValueError(f"URL no válida para el adjunto: {value}")
        return value

class Location(BaseModel):
    latitude: float = Field(...,description="Latitud de la ubicación")
    longitude: float = Field(...,description="Longitud de la ubicación")

class Map(BaseModel):
    location: Location = Field(...,description="Ubicación geográfica del mapa")
    description: str = Field(...,description="Descripción de la ubicación")

class versionSchema(BaseModel):
    editor : str = Field(..., max_length=100, description="Editor de esta versión")
    editDate: datetime = Field(default_factory=lambda:datetime.now(timezone(timedelta(hours=2))), description="Fecha de la edición")
    content: Optional[str] = Field(None, description="Contenido HTML de la entrada")
    attachments: List[Attachment] = Field(default_factory=list, description="Lista de archivos adjuntos")
    maps: List[Map] = Field(default_factory=list,description="Lista de mapas")
    reverted: bool = Field(default=False)
    entry_id: str = None

    model_config = {
        "json_schema_extra" : {
            "example" :
            {
            "editor": "Creador Prueba",
            "editDate": "2024-11-02T15:23:52.461000+02:00",
            "content": "pruebaNuevaVersion",
            "attachments": [
              {
                "type": "file",
                "url": "https://example.com/document.pdf",
                "file_name": "documento_prueba.pdf"
              }
            ],
            "maps": [
              {
                "location": {
                  "latitude": 40.712776,
                  "longitude": -74.005974
                },
                "description": "Ubicación en Nueva York"
              }
            ],
            "reverted": False,
            "entry_id": "672f52b8f8bc9f564411f89c"
            }
          }
        }
