from typing import List, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field, field_serializer, field_validator


class WikiSchema(BaseModel):
    """
    Schema para la creación de una Wiki.
    
    Atributos:
        name (str): Nombre de la wiki, con un máximo de 20 caracteres.
        creator (str): Nombre del creador de la wiki, con un máximo de 20 caracteres.
        description (str): Descripción de la wiki, con un máximo de 50 caracteres.
        date (datetime): Fecha de creación de la wiki.
        entries (List[str]): Lista de entradas asociadas a la wiki.
    """

    name: str = Field(..., max_length=20, description="Nombre de la wiki")
    creator: str = Field(..., max_length=100, description="Nombre del creador de la wiki")
    description: str = Field(..., max_length=200, description="Descripción de la wiki")
    date: datetime = Field(..., description="Fecha de creación de la wiki")
    entries: List[str] = Field(default_factory=list, description="Lista de entradas asociadas")

    @field_validator('entries', mode='before')
    @classmethod
    def validate_entries(cls, v: Any) -> Any:
        """
        Valida que el campo 'entries' esté vacío al momento de la creación.
        Args:
            v (Any): Valor del campo 'entries'.
        Returns:
            Any: El valor validado, vacío si es válido.
        Raises:
            ValueError: Si 'entries' contiene elementos al momento de la creación.
        """
        if v is not None and len(v) > 0:
            raise ValueError('Entries should not be provided on creation and must be empty.')
        return v


    @field_serializer("date", mode="plain")
    def serialize_date(self, value: datetime) -> str:
        return value.isoformat()


class WikiSchemaPartial(BaseModel):
    """
    Schema para la modificación de una Wiki.
    
    Atributos:
        name (str): Nombre de la wiki, con un máximo de 20 caracteres.
        description (str): Descripción de la wiki, con un máximo de 50 caracteres.
    """
    name: Optional[str] = Field(None, max_length=20, description="Nombre de la wiki")
    description: Optional[str] = Field(None, max_length=50, description="Descripción de la wiki")