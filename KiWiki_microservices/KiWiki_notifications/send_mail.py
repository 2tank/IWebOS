import os
import smtplib
from email.message import EmailMessage
import ssl

async def send_email_func(email:str, subjectP: str, bodyP: str):
    email_sender = 'wikikiwi350@gmail.com'
    password = 'uscz twin jpsz fvam'
    email_reciver = email

    subject = subjectP
    body = bodyP

    em = EmailMessage()
    em["From"] = email_sender
    em["To"] = email_reciver
    em["Subject"] = subject
    em.set_content(body)


    context = ssl.create_default_context()

    with smtplib.SMTP_SSL("smtp.gmail.com",465,context=context) as smtp:
        smtp.login(email_sender,password)
        smtp.sendmail(email_sender,email_reciver,em.as_string())