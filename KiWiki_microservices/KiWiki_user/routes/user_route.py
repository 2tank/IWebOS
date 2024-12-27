from fastapi import APIRouter, HTTPException, Body
import item_logic.user as user_logic
from models.user_schema import userSchema

router = APIRouter()

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
    ):
    try:
        filter = {}

        users = await user_logic.get_users_back(filter)
        return users
    except Exception as e:
        print(f"Failed to retrieve entries: {str(e)}")
        raise HTTPException(status_code=500,  detail="Failed to retrieve users")

@router.get("/{email}")
async def get_user(email: str):
    try:
        user = await user_logic.get_user_back(email)
        return user
    except Exception as e:
        print(f"Failed to retrieve user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve single user")

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
        req.email = None  
        updated_user = await user_logic.update_user_by_email(email,req)
        return updated_user
    except Exception as e:
        print(f"Failed to update user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update user")

@router.patch("/{email}")
async def update_user_preferences(email:str, preference: bool):
    try:
        updated_user = await user_logic.update_user_preferences(email, preference)
        return updated_user
    except Exception as e:
        print(f"Failed to update perferences of user: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update perferences of user")