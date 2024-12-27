from fastapi import FastAPI
from routes import user_route

app = FastAPI()

app.include_router(user_route.router, prefix="/users")
