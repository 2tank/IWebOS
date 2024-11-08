from fastapi import FastAPI
from routes import entry_route,version_route

app = FastAPI()

app.include_router(entry_route.router, prefix="/entries")
app.include_router(version_route.router,prefix="/versions")