

#Copiado de chatGPT
#///////////////////////////////////////
from pydantic import BaseModel
from typing import Optional

class ItemSchema(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
#///////////////////////////////////////