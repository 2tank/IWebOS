from fastapi.encoders import jsonable_encoder
from item_logic.crud_inheritance.user_crud import USERCRUD

crud = USERCRUD()

async def add_user(user):
    user_dict = user.dict()
    result = await crud.create_item(user_dict)
    return result

async def get_users_back(filter):
    users = []
    if len(filter)>0:
        users = await crud.get_by_filter(filter)
    else:
        users = await crud.get_collection()
    return users

async def get_user_back(email):
    user = await crud.get_id(email)
    return user

async def delete_user_by_email(email):
    deletedUser = await crud.delete_item_email({"email": email})
    return deletedUser

async def update_user_by_email(email,req):
    updated_data = {k: v for k, v in req.model_dump().items() if v is not None}
    updated_user = await crud.update_item_email({"email": email}, updated_data)
    return updated_user

async def update_user_preferences(email: str, preference: bool):
    updated_data = {"send_email": preference}
    updated_user = await crud.update_item_email({"email": email}, updated_data)
    return updated_user