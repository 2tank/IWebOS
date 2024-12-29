import axios from "axios";
import url from '../url.json';


export const handleSendEmail = async (email_reciver, subject, body) => {
  const url = `${url.active_urlBase}/notification/send-email`; // URL del endpoint

  const payload = {
    email_reciver,
    subject,
    body
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Correo enviado exitosamente:", response.data);
    return response.data; // Retorna la respuesta del backend
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error(error.response?.data?.detail || "Error al enviar el correo");
  }
};
