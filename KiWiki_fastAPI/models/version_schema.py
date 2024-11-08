from pydantic import BaseModel, Field, HttpUrl, field_validator
from datetime import datetime, timezone, timedelta
from typing import List, Optional,  Literal

linkType = Literal['External','Internal']

class Attachment(BaseModel):
    type: str = Field(...,description="Tipo de archivo 'image', 'file'...") 
    url: str = Field(..., description="Url adjunto al archivo")
    caption: Optional[str] = Field(None,description="Descripción del archivo")
    alt_text: Optional[str] = Field(None,description="Texto alternativo para imágenes")
    file_name: Optional[str] = Field(None, description="Nombre del archivo, solo para archivos que no son imágenes")

    @field_validator('url')
    def validate_attachment_url(cls, value):
        try:
            HttpUrl(value)
        except ValueError:
            raise ValueError(f"URL no válida para el adjunto: {value}")
        return value

class Link(BaseModel):
    type: linkType = Field(...,description="Tipo de enlace external o Internal") 
    url: str = Field(...,description="URL del enlace")
    text: str = Field(...,description="Texto del enlace")

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
    editor : str = Field(..., description="Editor de esta versión")
    editDate: datetime = Field(default_factory=lambda:datetime.now(timezone(timedelta(hours=2))), description="Fecha de la edición")
    content: Optional[str] = Field(None, description="Contenido HTML de la entrada")
    attachments: List[Attachment] = Field(default_factory=list, description="Lista de archivos adjuntos")
    links: List[Link] = Field(default_factory=list,description="Lista de enlaces")
    maps: List[Map] = Field(default_factory=list,description="Lista de mapas")
    reverted: bool = Field(default=False)
    entry_id: str = None

 
    model_config = {
        "json_schema_extra" : {
            "example": {
                "editor": "Nombre del editor",
                "editDate": "2023-11-04T00:00:00Z",
                "content": "<p>Este es el contenido en HTML</p>",
                "attachments": [
                    {
                        "type": "image",
                        "url": "https://imagen.com",
                        "caption": "Descripción de la imagen",
                        "alt_text": "Texto alternativo"
                    },
                    {
                        "type": "file",
                        "url": "https://archivo.com",
                        "file_name": "documento.pdf"
                    }
                ],
                "links": [
                    {
                        "type": "Internal",
                        "url": "https://enlaceinterno.com",
                        "text": "Enlace interno"
                    },
                    {
                        "type": "External",
                        "url": "https://enlaceexterno.com",
                        "text": "Enlace externo"
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
            }
        }
    }