import base64
import json
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from tempfile import NamedTemporaryFile

from dotenv import load_dotenv

from emails.Google import Create_Service

load_dotenv(dotenv_path="emails/.env")

# Obtener el JSON desde el .env
client_secret_content = os.getenv("CLIENT_SECRET_FILE")

if client_secret_content:
    # Convertir la cadena JSON en un diccionario
    client_secret_dict = json.loads(client_secret_content)

    # Crear un archivo temporal con el contenido JSON
    with NamedTemporaryFile(mode="w+", delete=False, suffix=".json") as temp_file:
        json.dump(client_secret_dict, temp_file)
        temp_file.seek(0)  # Asegurar que se escribe todo antes de cerrar
        temp_file_path = temp_file.name  # Guardar la ruta del archivo temporal
else:
    raise ValueError("CLIENT_SECRET_FILE no está definido en el archivo .env")

CLIENT_SECRET_FILE = temp_file_path
API_NAME = 'gmail'
API_VERSION = 'v1'
SCOPES = ['https://mail.google.com/']

service = Create_Service(CLIENT_SECRET_FILE, API_NAME, API_VERSION, SCOPES)

def send_email(message:str, receipient:str, subject:str):
    emailMsg = message
    mimeMessage = MIMEMultipart()
    mimeMessage['to'] = receipient
    mimeMessage['subject'] = subject
    mimeMessage.attach(MIMEText(emailMsg, 'plain'))
    raw_string = base64.urlsafe_b64encode(mimeMessage.as_bytes()).decode()

    message = service.users().messages().send(userId='me', body={'raw': raw_string}).execute()
    print(message)