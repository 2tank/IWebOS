from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class commentary(BaseModel):
    user: str = Field(...) #El ObjectId del usuario que está comentando
    entry: str = Field(...) #El ObjectId de la entrada en la que está comentando
    content: str = Field(...)
    date: datetime = Field(...)
    entryRating: Optional[int] = Field(None,ge=0,le=10) #La puntuacion que le da el usuario a la entrada del 0 al 10
    commentaryInReply: Optional[str] = None
    replies: Optional[List[str]] = []
    #commentaryInReply: Optional[str] = None #El ObjectId del comentario al que responde, en caso de hacerlo