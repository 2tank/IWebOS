from fastapi import FastAPI
from routes import route_commentary
app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

#app.include_router(entry.router, prefix="/entry")
app.include_router(route_commentary.router, prefix="/commentary")