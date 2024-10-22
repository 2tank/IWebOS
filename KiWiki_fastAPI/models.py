

#Copiado de chatGPT
#///////////////////////////////////////
from pydantic import BaseModel, Field
from typing import Optional


class ItemModel(BaseModel):
    name: str = Field(...)
    description: Optional[str] = None
    price: float = Field(..., gt=0)

    class Config:
        schema_extra = {
            "example": {
                "name": "Laptop",
                "description": "A powerful machine",
                "price": 1200.00
            }
        }
#///////////////////////////////////////