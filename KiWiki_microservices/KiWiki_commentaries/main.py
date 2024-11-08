from fastapi import FastAPI
from routes import commentary_route

app = FastAPI()

app.include_router(commentary_route.router,prefix="/commentaries")