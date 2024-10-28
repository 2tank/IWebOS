from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class WikiModel(BaseModel):
   
    name: str
    creator: str
    description: str
    date: date

    

    class Config:
        schema_extra = {
            "example": {
                "name": "Laptop",
                "description": "A powerful machine",
                "price": 1200.00
            }
        }




