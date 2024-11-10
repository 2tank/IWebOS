from enum import Enum
from pydantic import BaseModel, Field, field_serializer
from datetime import datetime, timezone, timedelta

class NotificationType(str, Enum):
    WIKI_REMOVAL = "WIKI_REMOVAL"
    ENTRY_ROLLBACK = "ENTRY_ROLLBACK"
    ENTRY_CREATION = "ENTRY_CREATION"
    ENTRY_REMOVAL = "ENTRY_REMOVAL"
    ENTRY_UPDATE = "ENTRY_UPDATE"

class NotificationSchema(BaseModel):
    title: str = Field(...)
    user: str = Field(...)
    notifDate: datetime = Field(default_factory=lambda: datetime.now(timezone(timedelta(hours=2))))
    notifType: NotificationType = Field(...)
    approved: bool = Field(default=False)
    read: bool = Field(default=False)

    @field_serializer("notifDate")
    def serialize_date(self, value: datetime) -> str:
        return value.isoformat()

    class Config:
        use_enum_values = True
        json_schema_extra = {
            "example": {
                "title": "Notificación de creación de entrada de la Wiki Guerra",
                "user": "Raquel",
                "notifDate": "2024-11-02T15:23:52.461000",
                "notifType": "ENTRY_CREATION",
                "approved": True,
                "read": False
            }
        }
