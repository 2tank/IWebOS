from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

"""
from fastapi import FastAPI
from app.routes import router as item_router

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI MongoDB app!"}

app.include_router(item_router, tags=["Items"], prefix="/item")
"""