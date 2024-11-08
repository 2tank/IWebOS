from fastapi import FastAPI
import notification_route
app = FastAPI()

app.include_router(notification_route.router, prefix="/notification")