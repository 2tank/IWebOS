import axios from "axios";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import url from '../../url.json';

function Notification({ id, title, user, notifDate, notifType, read, onUpdate, approved }) {
    const handleAccept = async (id) => {
        try {
            await axios.patch(`${url.active_urlBase}/notification/approve/${id}`);
            onUpdate(id, true); // Actualiza el estado como aprobado
        } catch (error) {
            console.error("Error al aceptar la notificación:", error);
        }
    };

    const handleDeny = async (id) => {
        try {
            await axios.patch(`${url.active_urlBase}/notification/deny/${id}`);
            onUpdate(id, false); // Actualiza el estado como denegado
        } catch (error) {
            console.error("Error al denegar la notificación:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${url.active_urlBase}/notification/${id}`);
            onUpdate(id, null); // Notifica al componente padre para eliminar la notificación
        } catch (error) {
            console.error("Error al eliminar la notificación:", error);
        }
    };

    return (
        <div
            className={`p-4 m-2 rounded shadow-md w-full max-w-xl relative ${
                read ? "bg-gray-300" : "bg-white"
            }`}
        >
            {/* Título con color condicional según el estado de aprobación */}
            <h2
                className={`text-xl font-bold mb-2 ${
                    approved === true
                        ? "text-green-500" // Verde si está aprobado
                        : approved === false
                        ? "text-red-500" // Rojo si está denegado
                        : "text-black" // Negro por defecto si no está aprobado ni denegado
                }`}
            >
                {title}
            </h2>
            <p className="text-gray-700 mb-1">Usuario: {user}</p>
            <p className="text-gray-700 mb-1">
                Fecha: {new Date(notifDate).toLocaleDateString()}
            </p>
            <p className="text-gray-700">Tipo: {notifType}</p>

            {/* Botones de Aceptar/Denegar */}
            {!approved && approved !== false && notifType !== "COMMENT"? (
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-700"
                        onClick={() => handleAccept(id)}
                    >
                        Aceptar
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => handleDeny(id)}
                    >
                        Denegar
                    </button>
                </div>
            ) : null}

            {(approved === true || approved === false) && (
                <div
                    className="absolute bottom-2 right-2 bg-red-500 text-white p-3 rounded-full cursor-pointer hover:bg-red-700"
                    onClick={() => handleDelete(id)}
                >
                    <DeleteForeverIcon fontSize="large" />
                </div>
            )}
        </div>
    );
}

export default Notification;
