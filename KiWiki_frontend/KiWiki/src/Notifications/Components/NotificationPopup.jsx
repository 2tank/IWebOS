import React from "react";
import MailIcon from '@mui/icons-material/Mail';
import axios from 'axios';

function NotificationPopup({ minimized, onExpand, userEmail }) {
    const handleUpdatePreferences = async (preference) => {
        try {
            const response = await axios.patch(`http://localhost:8000/users/${userEmail}`, {
                preference,
            });
            console.log("Preferencias actualizadas:", response.data);
        } catch (error) {
            console.error("Error actualizando preferencias:", error);
        }
    };

    const handleAccept = () => {
        handleUpdatePreferences(true);
    };

    const handleReject = () => {
        handleUpdatePreferences(false);
    };

    return (
        <>
            {/* Este div solo se muestra cuando no está minimizado */}
            {!minimized && (
                <div
                    className={`fixed bottom-5 right-5 transition-all duration-300 z-50 bg-white border rounded-lg shadow-lg w-72 p-5`}
                >
                    <h2 className="text-lg font-bold mb-2">
                        ¿Quieres recibir notificaciones por correo?
                    </h2>
                    <div className="flex justify-between mb-3">
                        <button
                            onClick={handleAccept}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Sí, quiero recibir notificaciones por mi correo.
                        </button>
                        <button
                            onClick={handleReject}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            No, prefiero gestionar las notificaciones desde la página
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
