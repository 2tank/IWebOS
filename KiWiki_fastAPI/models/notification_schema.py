from enum import Enum

from pydantic import BaseModel, Field, field_validator
from datetime import datetime, timezone, timedelta


class NotificationType(Enum):
    WIKI_REMOVAL = "WIKI_REMOVAL"
    ENTRY_ROLLBACK = "ENTRY_ROLLBACK"
    ENTRY_CREATION = "ENTRY_CREATION"
    ENTRY_REMOVAL = "ENTRY_REMOVAL"
    ENTRY_UPDATE = "ENTRY_UPDATE"

class NotificationSchema(BaseModel):
    title: str = Field(...)
    user: str = Field(...)
    notifDate: datetime = Field(default_factory=lambda:datetime.now(timezone(timedelta(hours=2))))
    notifType: NotificationType = Field(...)
    approved: bool = Field(default = False)
    read: bool = Field(default = False)

    class Config:
        use_enum_values = True # Configuración para serializar Enums como strings
        json_schema_extra = {
            "example": {
                "title": "Notificación de creación de entrada de la Wiki Guerra",
                "user": "Raquel",
                "notifDate": "07/11/2024 23:16:52",  # Ejemplo en formato `dd/mm/yyyy hh:mm:ss`
                "notifType": "ENTRY_CREATION",
                "approved": True,
                "read": False
            }
        }