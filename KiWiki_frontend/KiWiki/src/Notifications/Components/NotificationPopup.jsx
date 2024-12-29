import React from "react";
import MailIcon from "@mui/icons-material/Mail";
import CloseIcon from "@mui/icons-material/Close";
import { useSession } from "../../Common/SessionProvider";

function NotificationPopup({ minimized, onExpand, onClose }) {
  const { user, toggleMyMailPreference } = useSession();

  const handleTogglePreference = () => {
    toggleMyMailPreference();
  };

  return (
    <>
      {/* Este div solo se muestra cuando no está minimizado */}
      {!minimized && (
        <div
          className="fixed bottom-5 right-5 transition-all duration-300 z-50 bg-white border rounded-lg shadow-lg w-72 p-5"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Notificaciones por correo</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {user?.send_email
                ? "Actualmente estás recibiendo notificaciones por correo."
                : "Actualmente no estás recibiendo notificaciones por correo."}
            </span>
            <button
              onClick={handleTogglePreference}
              className={`px-4 py-2 rounded text-white transition-colors duration-300 ${
                user?.send_email
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {user?.send_email ? "Desactivar" : "Activar"}
            </button>
          </div>
        </div>
      )}

      {/* Botón para expandir solo cuando está minimizado */}
      {minimized && (
        <button
          onClick={onExpand}
          className="fixed bottom-5 right-5 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 z-50"
        >
          <MailIcon />
        </button>
      )}
    </>
  );
}

export default NotificationPopup;
