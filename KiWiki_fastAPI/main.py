from fastapi import FastAPI
from routes import wiki_route,entry_route

app = FastAPI()

app.include_router(entry_route.router, prefix="/entries")
app.include_router(wiki_route.router, prefix="/wikis")