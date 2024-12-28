from pydantic import BaseModel, Field
from typing import Literal

rolType = Literal[
    'EDITOR',
    'REDACTOR',
    'ADMIN',
]

class userSchema(BaseModel):
    rol : rolType = Field(..., max_length=20if(urlUser) {
                const response = await axios.get(urlUser);
                setData(response.data);
            }, description="Rol asignado al usuario")
    email: str = Field(..., max_length=100, description="User Email")
    #TODO Notifications preferences
    send_email : bool = Field(False, description="Preferencia de notificaciones por email")

    model_config = {
        "json_schema_extra" : {
            "example" :
            {
                "rol": "REDACTOR",
                "email" : "test@gmail.com",
                "send_email" : True
            }
        }
    }

