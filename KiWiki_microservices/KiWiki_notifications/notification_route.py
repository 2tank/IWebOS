from typing import Optional

from fastapi import APIRouter, HTTPException, Body, Query
import notification as notification_logic
from notification_schema import NotificationSchema, NotificationType

router = APIRouter()

# --- BASIC CRUD OPERATIONS -----------------------------------------------
@router.post("/")
async def add_notification(notification: NotificationSchema = Body(...)):
    try:
        await notification_logic.add_notification(notification)
    except:
        raise HTTPException(status_code=500, detail="Error sending notification")


@router.get("/")
async def get_notifications(
    user : Optional[str] = Query(None),
    notif_type: Optional[NotificationType] = Query(None),
    approved: Optional[bool] = Query(None),
    read: Optional[bool] = Query(None)
):
    try:
        notifications_filter = {}

        # Filtar por usuario (nombre por ahora)
        if user is not None:
            notifications_filter["user"] = user

        # Filtrar por tipo de notificación, si notifType fue proporcionado
        if notif_type is not None:
            notifications_filter["notifType"] = notif_type

        # Filtrar por estado de aprobación, si approved fue proporcionado
        if approved is not None:
            notifications_filter["approved"] = approved

        # Filtrar por estado de lectura, si read fue proporcionado
        if read is not None:
            notifications_filter["read"] = read


        notifications = await notification_logic.get_notifications(notifications_filter)
        return notifications
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
async def update_notification(id: str, req: NotificationSchema = Body(...)):
    try:
        updated_notification = await notification_logic.update_notification(id, req)
        return updated_notification
    except:
        raise HTTPException(status_code=500, detail="Could not update given notification")

# --- ADDITIONAL OPERATIONS FOR NOTIFICATION ------------------------------

@router.patch("/approve/{id}")
async def approve_notification(id: str):
    try:
        updated_notification = await notification_logic.approve_notification(id)
        return updated_notification
    except:
        raise HTTPException(status_code=500, detail="Could not approve given notification")

@router.patch("/deny/{id}")
async def deny_notification(id: str):
    try:
        updated_notification = await notification_logic.deny_notification(id)
        return updated_notification
    except:
        raise HTTPException(status_code=500, detail="Could not deny the given notification")


@router.patch("/read")
async def mark_all_notifications_as_read():
    try:
        await notification_logic.mark_all_notifications_as_read()
        return {"success": True, "message": "All notifications marked as read"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not mark notifications as read: {e}")
