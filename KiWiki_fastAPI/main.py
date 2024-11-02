from fastapi import FastAPI
from routes import wiki_route,entry_route,version_route, commentary_route

app = FastAPI()

app.include_router(entry_route.router, prefix="/entries")
app.include_router(wiki_route.router, prefix="/wikis")
app.include_router(version_route.router,prefix="/versions")
app.include_router(commentary_route.router,prefix="/commentary")