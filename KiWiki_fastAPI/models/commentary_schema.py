from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class commentary(BaseModel):
    user: str = Field(...) #El ObjectId del usuario que está comentando
    entry: str = Field(...) #El ObjectId de la entrada en la que está comentando
    entry_version: str = Field(...) #El ObjectId de la version de la entrada en la que esta comentando
    content: str = Field(...)
    date: datetime = Field(...)
    entryRating: Optional[int] = Field(None,ge=0,le=10) #La puntuacion que le da el usuario a la entrada del 0 al 10
    commentaryInReply: Optional[str] = None
    replies: Optional[List[str]] = []

    model_config = {
        "json_schema_extra": {
            "example": {
                "user": "507f1f77bcf86cd799439011",
                "entry": "507f1f77bcf86cd799439022",
                "entry_version": "507f1f77bcf86cd799439033",
                "content": "Este es un comentario de prueba.",
                "date": "2024-11-02T15:23:52.461000",
                "entryRating": 8,
                "commentaryInReply": "507f1f77bcf86cd799439044",
                "replies": [
                    "507f1f77bcf86cd799439055",
                    "507f1f77bcf86cd799439066"
                ]
            }
        }
    }