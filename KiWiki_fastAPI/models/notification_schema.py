from enum import Enum

from pydantic import BaseModel, Field
from datetime import datetime

class NotificationType(Enum):
    WIKI_REMOVAL = "Wiki removal authorization"
    ENTRY_ROLLBACK = "Entry rollback authorization"
    ENTRY_CREATION = "Entry creation authorization"
    ENTRY_REMOVAL = "Entry removal authorization"
    ENTRY_UPDATE = "Entry update authorization"

class notificationSchema(BaseModel):
    title: str = Field(...)
    user: str = Field(...)
    notifDate: datetime = Field(...)
    notifType: NotificationType = Field(...)
    approved: bool = Field(False)
    read: bool = Field(False)