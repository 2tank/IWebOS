from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class commentary(BaseModel):
    user: str = Field(...) #El ObjectId del usuario que está comentando
    entry: str = Field(...) #El ObjectId de la entrada en la que está comentando
    content: str = Field(...)
    date: datetime = Field(...)
    entryRating: int = Field(...) #La puntuacion que le da el usuario a la entrada del 1 al 10
    commentaryInReply: Optional[str] = None #El ObjectId del comentario al que responde, en caso de hacerlo
