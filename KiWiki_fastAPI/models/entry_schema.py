from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class entrySchema(BaseModel):
    author: str = Field(...) #Cambiar a usuario creador cuando sea necesario
    creationDate: datetime = Field(...)
    updateDate: datetime = Field(...)
    name: str = Field(...)
    editor: str = Field(...) #Cambiar a usuario editor cuando sea necesario