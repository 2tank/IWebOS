from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException, Body, Query, Depends

from models.notification_schema import NotificationSchema, NotificationType
from token_manager import verify_token
from urls import config

notification_url = config["notification_url"]
router = APIRouter()

# --- BASIC CRUD OPERATIONS -----------------------------------------------
@router.post("/")
async def add_notification(notification: NotificationSchema = Body(...), username: str = Depends(verify_token)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{notification_url}/", json=notification.model_dump())
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        raise HTTPException(status_code=500, detail="Error reaching microservice: " + str(http_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error sending notification: " + str(e))


@router.get("/")
async def get_notifications(
    user : Optional[str] = Query(None),
    notif_type: Optional[NotificationType] = Query(None),
    approved: Optional[bool] = Query(None),
    read: Optional[bool] = Query(None)
):
    try:
        notifications_filter = {
            "user" : user,
            "notif_type" : notif_type,
            "approved" : approved,
            "read" : read
        }

        notifications_filter = {k: v for k, v in notifications_filter.items() if v is not None and v != []}

        async with httpx.AsyncClient() as client:
            response = await client.get(f"{notification_url}/", params=notifications_filter)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        raise HTTPException(status_code=500, detail="Error reaching microservice: " + str(http_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{id}")
async def get_notification(id):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{notification_url}/{id}")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        raise HTTPException(status_code=500, detail="Error reaching microservice: " + str(http_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not get given notification: " + str(e))


@router.delete("/{id}")
async def delete_notification(id: str, username: str = Depends(verify_token)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{notification_url}/{id}")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        raise HTTPException(status_code=500, detail="Error reaching microservice: " + str(http_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not delete given notification: " + str(e))


@router.put("/{id}")
async def update_notification(id: str, req: NotificationSchema = Body(...), username: str = Depends(verify_token)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(f"{notification_url}/{id}", json = req.model_dump())
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        raise HTTPException(status_code=500, detail="Error reaching microservice: " + str(http_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not update given notification: " + str(e))


@router.patch("/approve/{id}")
async def approve_notification(id: str, username: str = Depends(verify_token)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.patch(f"{notification_url}/approve/{id}")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        raise HTTPException(status_code=500, detail="Error approving notification: " + str(http_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not approve the notification: " + str(e))

@router.patch("/deny/{id}")
async def deny_notification(id: str, username: str = Depends(verify_token)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.patch(f"{notification_url}/deny/{id}")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        raise HTTPException(status_code=500, detail="Error denying notification: " + str(http_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not deny the notification: " + str(e))

@router.patch("/read")
async def mark_all_notifications_as_read(username: str = Depends(verify_token)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.patch(f"{notification_url}/read")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        raise HTTPException(status_code=500, detail="Error marking notifications as read: " + str(http_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not mark notifications as read: " + str(e))

@router.post("/send-email")
async def send_email(email:str, subject: str, body: str, username: str = Depends(verify_token)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(f"{notification_url}/send-email", json={"email": email, "subject": subject, "body": body})
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        raise HTTPException(status_code=500, detail="Error reaching microservice: " + str(http_err))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error sending email: " + str(e))