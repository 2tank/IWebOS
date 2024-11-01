from fastapi import APIRouter, HTTPException, Body
from bson import ObjectId
import item_logic.notification as notification_logic
from models.notification_schema import notificationSchema

router = APIRouter()

# --- BASIC CRUD OPERATIONS -----------------------------------------------
@router.post("/")
async def add_notification(notification: notificationSchema = Body(...)):
    try:
        await notification_logic.add_notification(notification)
    except:
        raise HTTPException(status_code=500, detail="Error sending notification")


@router.get("/")
async def get_notifications():
    try:
        notifications = await notification_logic.get_notifications()
        return notifications
    except:
        raise HTTPException(status_code=500, detail="No notifications")


@router.get("/{id}")
async def get_notification(id):
    try:
        notification = await notification_logic.get_notification(id)
        return notification
    except:
        raise HTTPException(status_code=500, detail="Could not get given notification")


@router.delete("/{id}")
async def delete_notification(id: str):
    try:
        deleted_notification = await notification_logic.delete_notification(id)
        return deleted_notification
    except:
        raise HTTPException(status_code=500, detail="Could not delete given notification")


@router.put("/{id}")
async def update_notification(id: str, req: notificationSchema = Body(...)):
    try:
        updated_notification = await notification_logic.update_notification(id, req)
        return updated_notification
    except:
        raise HTTPException(status_code=500, detail="Could not update given notification")

# --- ADDITIONAL OPERATIONS FOR NOTIFICATION ------------------------------

# Conseguir todas las notificaciones pertenecientes a un usuario
@router.get("/user/{user_id}", response_model=list) # La respuesta de la ruta tiene que ser de tipo lista
async def get_notifications_by_user(user_id: str):
    try:
        notifications = await notification_logic.get_notifications_by_user(user_id)
        return notifications
    except:
        raise HTTPException(status_code=404, detail="No notifications for given user.")


# Acceptar la petición de la notificación
async def approve_notification(id: str):
    try:
        updated_notification = await notification_logic.approve_notification(id)
        return updated_notification
    except Exception as e:
        raise HTTPException(status_code=500, detail="Notificación no encontrada.")

# Marcar como leida la notificación
async def mark_notification_as_read(id: str):
    try:
        updated_notification = await notification_logic.mark_notification_as_read(id)
        return updated_notification
    except Exception as e:
        raise HTTPException(status_code=500, detail="Notificación no encontrada.")