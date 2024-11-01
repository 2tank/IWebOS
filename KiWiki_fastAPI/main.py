from fastapi import FastAPI
from routes import wiki_route,entry_route,version_route

app = FastAPI()

app.include_router(entry_route.router, prefix="/entry")
app.include_router(wiki_route.router, prefix="/wiki")
app.include_router(version_route.router,prefix="/versions")