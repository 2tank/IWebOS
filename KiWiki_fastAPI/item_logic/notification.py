from fastapi import Body
from fastapi.encoders import jsonable_encoder

from database import MONGOCRUD
from models.entry_schema import entrySchema

crud = MONGOCRUD('Notification') #Crud basico expandible con herencia.

# --- BASIC CRUD OPERATIONS -----------------------------------------------
async def add_notification(notification):
    notification_data = jsonable_encoder(notification)
    await crud.create_item(notification_data)

async def get_notifications():
    notifications = await crud.get_collection()
    return notifications

async def get_notification(id):
    notification = await crud.get_id(id)
    return notification

async def delete_notification(id):
    deletedNotification = await crud.delete_id(id)
    return deletedNotification

async def update_notification(id,req):
    req = {k: v for k, v in req.model_dump().items() if v is not None}
    updatedNotification = await crud.update_id(id, req)
    return updatedNotification

# --- ADDITIONAL OPERATIONS FOR NOTIFICATION ------------------------------

# Conseguir todas las notificaciones pertenecientes a un usuario
async def get_notifications_by_user(user_id: str):
    notifications = await crud.get_by_user(user_id)
    return notifications

# Acceptar la petición de la notificación
async def approve_notification(id: str):
    update_data = {"approved": True}  # Cambia el estado de 'read' a True
    updatedNotification = await crud.update_id(id, update_data)
    return updatedNotification

# Marcar como leida la notificación
async def mark_notification_as_read(id: str):
    update_data = {"read": True}  # Cambia el estado de 'read' a True
    updatedNotification = await crud.update_id(id, update_data)
    return updatedNotification
