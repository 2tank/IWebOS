from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer

import token_manager
from routes import wiki_route,entry_route,version_route, commentary_route, notification_route,user_route

# Definir el esquema de seguridad para Bearer Token
bearer_scheme = HTTPBearer()

app = FastAPI(
    # Agregar el esquema de seguridad al Swagger UI
    security=[bearer_scheme]
)
# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Cambia esto según el puerto de tu frontend
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP
    allow_headers=["*"],  # Permite todos los encabezados
)

app.include_router(entry_route.router, prefix="/entries")
app.include_router(wiki_route.router, prefix="/wikis")
app.include_router(version_route.router,prefix="/versions")
app.include_router(commentary_route.router,prefix="/commentaries")
app.include_router(notification_route.router,prefix="/notification")
app.include_router(user_route.router, prefix="/users")
app.include_router(token_manager.router, prefix="/token")