import axios from "axios";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import url from '../../url.json';

function Notification({ id, title, user, notifDate, notifType, read, onUpdate }) {
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
            <h2 className="text-xl font-bold mb-2 text-black">{title}</h2>
            <p className="text-gray-700 mb-1">Usuario: {user}</p>
            <p className="text-gray-700 mb-1">
                Fecha: {new Date(notifDate).toLocaleDateString()}
            </p>
            <p className="text-gray-700">Tipo: {notifType}</p>

            {read && (
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
