import axios from "axios";
import { useEffect, useState } from "react";
import { colors } from "@mui/material";
import Notification from "./Components/Notification";
import Navbar from '../../src/Common/NavBar';

function NotificationPage() {
    const [data, setData] = useState([]); // Cambié a un array por defecto para evitar problemas.
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estado para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 2; // Número de notificaciones por página.

    // Estado para filtro de tipo
    const [filterType, setFilterType] = useState(""); // Filtro por tipo de notificación

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8000/notification/");
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
    if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;

    // Filtrar las notificaciones por tipo
    const filteredData = filterType ? data.filter(notification => notification.notifType === filterType) : data;

    // Calcular índices para las notificaciones visibles
    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = filteredData.slice(indexOfFirstNotification, indexOfLastNotification);

    // Funciones para cambiar de página
    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredData.length / notificationsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Función para manejar el cambio de filtro
    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
        setCurrentPage(1); // Resetear la página cuando el filtro cambie
    };

    return (
        <>
        <Navbar/>
        <main
            style={{ background: colors.brown[100] }}
            className="min-h-screen w-full flex items-center justify-center p-4 sm:p-10"
        >
            <div className="max-w-2xl w-full mx-auto pt-8 bg-white rounded-md px-4 sm:px-10">
                <section className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-6">
                    <h1 className="text-2xl sm:text-3xl flex gap-3 items-center font-bold">
                        Notificaciones
                    </h1>

                    {/* Filtro por tipo */}
                    <select
                        value={filterType}
                        onChange={handleFilterChange}
                        className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                    >
                        <option value="">Filtrar por tipo</option>
                        <option value="WIKI_REMOVAL">Borrado de Wiki</option>
                        <option value="ENTRY_CREATION">Creación de Entrada</option>
                        {/* Agregar más tipos de notificación aquí si es necesario */}
                    </select>

                    <button className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto">
                        Marcar todos como leídos
                    </button>
                </section>

                {/* Renderizar notificaciones visibles */}
                {currentNotifications.length === 0 ? (
                    <p className="text-center text-lg text-gray-500">No tienes notificaciones por leer.</p>
                ) : (
                    currentNotifications.map((notification, index) => (
                        <Notification
                            key={index}
                            title={notification.title}
                            user={notification.user}
                            notifDate={notification.notifDate}
                            notifType={notification.notifType}
                        />
                    ))
                )}

                {/* Paginación */}
                <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                    <span className="text-xs xs:text-sm text-gray-900">
                        Mostrando {indexOfFirstNotification + 1} a{" "}
                        {Math.min(indexOfLastNotification, filteredData.length)} de {filteredData.length} Notificaciones
                    </span>
                    <div className="flex mt-2 xs:mt-0">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`text-sm text-indigo-50 transition duration-150 ${
                                currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "hover:bg-indigo-500 bg-indigo-600"
                            } font-semibold py-2 px-4 rounded-l`}
                        >
                            Anterior
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === Math.ceil(filteredData.length / notificationsPerPage)}
                            className={`text-sm text-indigo-50 transition duration-150 ${
                                currentPage === Math.ceil(filteredData.length / notificationsPerPage)
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "hover:bg-indigo-500 bg-indigo-600"
                            } font-semibold py-2 px-4 rounded-r`}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            </div>
        </main>
        </>
    );
}

export default NotificationPage;
