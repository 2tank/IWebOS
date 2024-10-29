from fastapi import FastAPI

from item_logic import entry
from routes import wiki_route

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

app.include_router(entry.router, prefix="/entry")
app.include_router(wiki_route.router, prefix="/wiki")