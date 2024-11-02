from pydantic import BaseModel, Field
from datetime import datetime

class versionSchema(BaseModel):
    editor : str = Field(...)
    editDate: datetime = Field(...)
    content: str = Field(...)
    entry_id: str = None
 
    model_config = {
        "json_schema_extra" : {
            "examples" : [
                {
                    "editor": "Editor Prueba",
                    "editDate": "2024-11-02T15:27:29.120Z",
                    "content": "Contenido Prueba",
                    "entry_id": ""
                }
            ]
        }
    }