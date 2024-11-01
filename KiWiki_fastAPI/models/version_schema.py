from pydantic import BaseModel, Field
from datetime import datetime

class versionSchema(BaseModel):
    editor : str = Field(...)
    editDate: datetime = Field(...)
    content: str = Field(...)
    description: str = Field(...)
    entry_id: str = None
 