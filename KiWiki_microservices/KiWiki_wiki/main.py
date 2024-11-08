from fastapi import FastAPI
from routes import wiki_route

app = FastAPI()

app.include_router(wiki_route.router, prefix="/wikis")
