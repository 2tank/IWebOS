from fastapi import APIRouter, HTTPException, Body

import httpx
from models.user_schema import userSchema
from urls import config

router = APIRouter()
user_url = config["user_url"]

@router.post("/")
async def create_user(user: userSchema = Body(...)):
    try:    
        async with httpx.AsyncClient() as client:
                response = await client.post(f"{user_url}/", json=user.model_dump())
                response.raise_for_status()
                return response.json()
        
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to create user")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create user")

@router.get("/")
async def get_users(
    ):
    try:
        async with httpx.AsyncClient() as client:
                print(f"{user_url}/")
                response = await client.get(f"{user_url}/", params={})
                response.raise_for_status()
                return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to retrieve users")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve users")

@router.get("/{email}")
async def get_user(email: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{user_url}/{email}")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to retrieve user")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve user")

@router.delete("/{email}")
async def delete_user(email: str):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.delete(f"{user_url}/{email}")
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to delete user")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete user")

@router.put("/{email}")
async def update_user(email: str, req: userSchema = Body(...)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.put(f"{user_url}/{email}", json=req.model_dump())
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to update user")

    except Exception as e:
        print(f"Se produjo un error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update user")

@router.patch("/{email}")
async def update_user_preferences(email: str, preference: bool):
    try:
        # Lógica para actualizar preferencias (simulada con un PATCH a un endpoint de preferencias)
        async with httpx.AsyncClient() as client:
            response = await client.patch(
                f"{user_url}/{email}/preferences", json={"preference": preference}
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as http_err:
        print(f"Error HTTP: {http_err}")
        raise HTTPException(status_code=500, detail="Failed to update user preferences")

    except Exception as e:
        print(f"Failed to update preferences of user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update user preferences")