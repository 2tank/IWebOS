import axios from "axios";
import url from "../url.json";

export const handleSendEmail = async (email_reciver, subject, body) => {
  const endpoint = `${url.active_urlBase}/notification/send-email`; // URL del endpoint

  try {
    // Construimos la query string con los parámetros
    const response = await axios.post(endpoint, null, {
      params: {
        email: email_reciver, // Cambia el nombre del parámetro si es diferente en el backend
        subject: subject,
        body: body,
      },
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
