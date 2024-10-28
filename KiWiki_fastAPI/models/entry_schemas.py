from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class entrySchema(BaseModel):
    author: str = Field(...) #Cambiar a usuario creador cuando sea necesario
    creationDate: date = Field(...)
    updateDate: date = Field(...)
    name: str = Field(...)
    editor: str = Field(...) #Cambiar a usuario editor cuando sea necesario

    #Optional[] = None