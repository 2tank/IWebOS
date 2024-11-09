    from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field, field_validator


class commentary(BaseModel):
    user: str = Field(...) #El ObjectId del usuario que está comentando
    entry: str = Field(...) #El ObjectId de la entrada en la que está comentando
    entry_version: str = Field(...) #El ObjectId de la version de la entrada en la que esta comentando
    content: str = Field(...)
    date: datetime = Field(...)
    entryRating: Optional[int] = Field(None,ge=0,le=10) #La puntuacion que le da el usuario a la entrada del 0 al 10
    commentaryInReply: Optional[str] = None
    replies: Optional[List[str]] = []

    model_config = {
        "json_schema_extra": {
            "example": {
                "user": "507f1f77bcf86cd799439011",
                "entry": "507f1f77bcf86cd799439022",
                "entry_version": "507f1f77bcf86cd799439033",
                "content": "Este es un comentario de prueba.",
                "entryRating": 8,
                "commentaryInReply": "507f1f77bcf86cd799439044",
                "replies": [
                    "507f1f77bcf86cd799439055",
                    "507f1f77bcf86cd799439066"
                ]
            }
        }
    }

    @field_validator('user', mode='before')
    @classmethod
    def validate_user(cls, v: Any) -> Any:
        """
        Valida que el campo 'user' esté vacío al momento de la creación.
        Args:
            v (Any): Valor del campo 'user'.
        Returns:
            Any: El valor validado, vacío si es válido.
        Raises:
            ValueError: Si 'user' contiene elementos al momento de la creación.
        """
        if v is not None and len(v) > 0:
            raise ValueError('User should not be provided on creation and must be empty.')
        return v

    @field_validator('entry', mode='before')
    @classmethod
    def validate_user(cls, v: Any) -> Any:
        """
        Valida que el campo 'entry' esté vacío al momento de la creación.
        Args:
            v (Any): Valor del campo 'entry'.
        Returns:
            Any: El valor validado, vacío si es válido.
        Raises:
            ValueError: Si 'entry' contiene elementos al momento de la creación.
        """
        if v is not None and len(v) > 0:
            raise ValueError('Entry should not be provided on creation and must be empty.')
        return v

    @field_validator('entry_version', mode='before')
    @classmethod
    def validate_user(cls, v: Any) -> Any:
        """
        Valida que el campo 'entry_version' esté vacío al momento de la creación.
        Args:
            v (Any): Valor del campo 'entry_version'.
        Returns:
            Any: El valor validado, vacío si es válido.
        Raises:
            ValueError: Si 'entry_version' contiene elementos al momento de la creación.
        """
        if v is not None and len(v) > 0:
            raise ValueError('Entry version should not be provided on creation and must be empty.')
        return v

class commentaryUpdate(BaseModel):
    content: str = Field(...)

    model_config = {
        "json_schema_extra": {
            "example": {
                "content": "Este es un comentario de prueba."
            }
        }
    }