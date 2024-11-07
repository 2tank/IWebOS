from fastapi.encoders import jsonable_encoder

from database import MONGOCRUD

crud = MONGOCRUD('Notification') #Crud basico expandible con herencia.

# --- BASIC CRUD OPERATIONS -----------------------------------------------
async def add_notification(notification):
    notification_data = jsonable_encoder(notification)
    await crud.create_item(notification_data)

async def get_notifications(notifications_filter):
    notifications = await crud.get_by_filter(notifications_filter) if len(notifications_filter) > 0 else await crud.get_collection()
    return notifications

async def get_notification(id):
    notification = await crud.get_id(id)
    return notification

async def delete_notification(id):
    deleted_notification = await crud.delete_id(id)
    return deleted_notification

async def update_notification(id,req):
    req = {k: v for k, v in req.model_dump().items() if v is not None}
    updated_notification = await crud.update_id(id, req)
    return updated_notification

# --- ADDITIONAL OPERATIONS FOR NOTIFICATION ------------------------------

# Acceptar la petición de la notificación
async def approve_notification(id: str):
    update_data = {"approved": True}  # Cambia el estado de 'read' a True
    updated_notification = await crud.update_id(id, update_data)
    return updated_notification

# Marcar como leida la notificación
async def mark_notification_as_read(id: str):
    update_data = {"read": True}  # Cambia el estado de 'read' a True
    updated_notification = await crud.update_id(id, update_data)
    return updated_notification
