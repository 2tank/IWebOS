from pydantic import BaseModel, Field
from datetime import datetime
from models.version_schema import versionSchema

class entrySchema(BaseModel):
    title: str = Field(...)
    creator : str = Field(...)
    creationDate: datetime = Field(...)
    actual_version: str = None