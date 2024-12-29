from pydantic import BaseModel, Field
from typing import Literal

rolType = Literal[
    'LECTOR',
    'EDITOR',
    'REDACTOR',
    'ADMIN',
]

class userSchema(BaseModel):
    rol : rolType = Field(..., max_length=20, description="Rol asignado al usuario")
    email: str = Field(..., max_length=100, description="User Email")
    #TODO Notifications preferences
    send_email : bool = Field(False, description="Preferencia de notificaciones por email")

    model_config = {
        "json_schema_extra" : {
            "example" :
            {
                "rol": "LECTOR",
                "email" : "test@gmail.com",
                "send_email" : True
            }
        }
    }