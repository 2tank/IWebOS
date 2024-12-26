from pydantic import BaseModel, Field, EmailStr
from notification_schema import NotificationType

class EmailRequest(BaseModel):
    email: EmailStr = Field(...)
    notification_type: NotificationType
    entry_name: str  # Nombre de la wiki o entrada

NOTIFICATION_TEMPLATES = {
    NotificationType.WIKI_REMOVAL: "La página del wiki '{entry_name}' ha sido eliminada por {user_name}.",
    NotificationType.ENTRY_ROLLBACK: "La entrada '{entry_name}' ha sido revertida a una versión anterior por {user_name}.",
    NotificationType.ENTRY_CREATION: "Una nueva entrada llamada '{entry_name}' ha sido creada por {user_name}.",
    NotificationType.ENTRY_REMOVAL: "La entrada '{entry_name}' ha sido eliminada por {user_name}.",
    NotificationType.ENTRY_UPDATE: "La entrada '{entry_name}' ha sido actualizada por {user_name}.",
}