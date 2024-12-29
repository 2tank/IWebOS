from fastapi import FastAPI, Depends, HTTPException, Request, APIRouter
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi.security import HTTPBearer

router = APIRouter()

# Configuración del token
SECRET_KEY = "clavealeatoria1"  # Cambia esto por algo más seguro si es necesario
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Esquema para autenticar el token
bearer_scheme = HTTPBearer()

# Función para crear un token
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Endpoint para obtener un token
@router.get("/")
async def get_token(username: str):
    # Aquí puedes añadir lógica para validar el usuario en tu base de datos.

    token = create_access_token(data={"sub": username})
    return {"access_token": token, "token_type": "bearer"}

# Middleware o función para verificar el token en solicitudes protegidas
async def verify_token(token: str = Depends(bearer_scheme)):
    try:
        # Decode el token usando el esquema de seguridad
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return username  # Devolver el usuario autenticado
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
