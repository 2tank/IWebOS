import axios from "axios";
import url from '../url.json';


export const handleSendEmail = async (email, notification_type, nameRef, user_name) => {
  const url = `${url.active_urlBase}/email/send-email`; // URL del endpoint

  const payload = {
    email,
    notification_type,
    nameRef, // Nombre de la Wiki o Entrada correspondiente
    user_name,
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
