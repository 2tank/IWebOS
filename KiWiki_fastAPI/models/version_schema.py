from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class entrySchema(BaseModel):
    editor: str = Field(...)
    name : str = Field(...)
    creationDate: datetime = Field(...)
    entryId: int = Field(...)

