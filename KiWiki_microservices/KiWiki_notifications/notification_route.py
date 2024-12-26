from typing import Optional
from fastapi import APIRouter, HTTPException, Body, Query, BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

import notification as notification_logic
from notification_schema import NotificationSchema, NotificationType
from emails.email_schema import EmailRequest, NOTIFICATION_TEMPLATES
from emails.send_email import send_email as send_email_logic

# Configuración de correo
conf = ConnectionConfig(
    MAIL_USERNAME="tu_correo@gmail.com",
    MAIL_PASSWORD="contraseña_o_token_app",  # Si usas 2FA, genera una contraseña de aplicación en https://myaccount.google.com/apppasswords
    MAIL_FROM="tu_correo@gmail.com",
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=587,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)


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

@router.post("/send-email")
async def send_email(request: EmailRequest):

    """
    Enviar un correo electrónico a la dirección proporcionada en el cuerpo de la solicitud.
    :param request: Contiene la dirección de correo electrónico, el mensaje a enviar.
    """

    try:
        # Generar mensaje
        message_template = NOTIFICATION_TEMPLATES.get(request.notification_type, request.email, request.entry_name)
        if not message_template:
            raise ValueError("Tipo de notificación no soportado")

        send_email_logic(message_template, str(request.email), request.notification_type)

        return {"message": "Correo enviado exitosamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al enviar el correo: {str(e)}")

