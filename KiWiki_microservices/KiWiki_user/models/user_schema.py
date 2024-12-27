from pydantic import BaseModel, Field
from typing import Literal

rolType = Literal[
    'EDITOR',
    'REDACTOR',
    'ADMIN',
]

class userSchema(BaseModel):
    rol : rolType = Field(..., max_length=20, description="Rol asignado al usuario")
    email: str = Field(..., max_length=100, description="User Email")
    #TODO Notifications preferences

    model_config = {
        "json_schema_extra" : {
            "example" :
            {
                "rol": "REDACTOR",
                "email" : "test@gmail.com",
            }
        }
    }

