from fastapi import FastAPI

from item_logic import entry
from routes import wiki_route

app = FastAPI()

app.include_router(entry.router, prefix="/entry")
app.include_router(wiki_route.router, prefix="/wiki")