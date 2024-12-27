from fastapi import APIRouter, HTTPException, Body, Query
import item_logic.user as user_logic
from models.user_schema import userSchema
from typing import Optional, List, Dict, get_args
from datetime import datetime

router = APIRouter()

# Comando : uvicorn main:app --host 127.0.0.1 --port 8002

@router.post("/")
async def create_user(user: userSchema = Body(...)):
    try:
        result = await user_logic.add_user(user)
        return result
    except Exception  as e:
        print(f"Upload failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Upload failed")

@router.get("/")
async def get_users(
    name: Optional[str] = Query(None),
    rol: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    description: Optional[str] = Query(None),
    ):
    try:

            filter = {}
            #Filtro por Año|Mes|Día

            #Filtramos con expresión regular y la opción case-insensitive
            if name:
                filter["name"] = {"$regex": ".*{}.*".format(name), "$options": "i"}

            if rol:
                filter["rol"] = {"$rol": ".*{}.*".format(rol), "$options": "i"}

            if email:
                filter["email"] = {"$regex": ".*{}.*".format(email), "$options": "i"}

            if description:
                filter["description"] = {"$regex": ".*{}.*".format(description), "$options": "i"}


            users = await user_logic.get_users_back(filter)
            return users
    except Exception as e:
        print(f"Failed to retrieve entries: {str(e)}")
        raise HTTPException(status_code=500,  detail="Failed to retrieve users")

@router.get("/{id}")
async def get_user(id: str):
    try:
        user = await user_logic.get_user_back(id)
        return user
    except Exception as e:
        print(f"Failed to retrieve user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve single user")

# @router.delete("/{id}")
# async def delete_user(id: str):
#     try:
#         deleted_user = await user_logic.delete_user_back(id)
#         return deleted_user
#     except Exception as e:
#         print(f"Failed to delete user: {str(e)}")
#         raise HTTPException(status_code=500, detail="Failed to delete user")


# @router.put("/{id}")
# async def update_user(id: str, req: userSchema = Body(...)):
#     try:
#         updated_user = await user_logic.update_user(id,req)
#         return updated_user
#     except Exception as e:
#         print(f"Failed to update user: {str(e)}")
#         raise HTTPException(status_code=500, detail="Failed to update user")


@router.delete("/{email}")
async def delete_user(email: str):
    try:
        deleted_user = await user_logic.delete_user_by_email(email)
        return deleted_user
    except Exception as e:
        print(f"Failed to delete user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete user")


@router.put("/{email}")
async def update_user(email: str, req: userSchema = Body(...)):
    try:
        req.email = None  # Eliminar el email del cuerpo antes de la actualización
        updated_user = await user_logic.update_user_by_email(email,req)
        return updated_user
    except Exception as e:
        print(f"Failed to update user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update user")