from pydantic import BaseModel, Field
from datetime import datetime, timezone, timedelta
from typing import List, Literal


rolType = Literal[
    'LECTOR',
    'EDITOR',
    'CREADOR',
    'ADMIN',
]

class userSchema(BaseModel):
    name: str = Field(..., max_length=100, description="User Name")
    rol : rolType = Field(..., max_length=20, description="Rol asignado al usuario")
    email: str = Field(..., max_length=100, description="User Email")
    description: str = Field(...,max_length=500, description="Descripción del usuario")


    model_config = {
        "json_schema_extra" : {
            "example" :
            {
                "name": "Username",
                "rol": "LECTOR",
                "email" : "test@gmail.com",
                "description": "Descripcion de User",
            }
        }
    }

