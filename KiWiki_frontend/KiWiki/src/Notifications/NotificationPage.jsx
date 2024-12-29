import axios from "axios";
import { colors } from "@mui/material";
import Notification from "./Components/Notification";
import Navbar from "../../src/Common/NavBar";
import { useState, useEffect } from "react";
import React from 'react';
import { useNotification } from "../../src/Common/NotificationContext";
import NotificationPopup from "./Components/NotificationPopup";

function NotificationPage() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    // Estado para controlar el popup
    const [showPopup, setShowPopup] = useState(true);
    const [minimizedPopup, setMinimizedPopup] = useState(false);

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

    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 2;
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("OTHER");

    const filteredData = data.filter((notification) => {
        const matchesType = filterType ? notification.notifType === filterType : true;
        const matchesStatus =
            filterStatus === "ACCEPTED"
                ? notification.approved === true
                : filterStatus === "DENIED"
                ? notification.approved === false
                : filterStatus === "OTHER"
                ? notification.approved === null
                : true;
        return matchesType && matchesStatus;
    });

    const indexOfLastNotification = currentPage * notificationsPerPage;
    const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
    const currentNotifications = filteredData.slice(indexOfFirstNotification, indexOfLastNotification);

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

    const handleFilterChange = (event) => {
        setFilterType(event.target.value);
        setCurrentPage(1);
    };

    const handleStatusChange = (event) => {
        setFilterStatus(event.target.value);
        setCurrentPage(1);
    };

    const { markAllAsRead } = useNotification();

    const handleUpdateNotification = (id, approved) => {
        setData((prevData) =>
            prevData.map((notification) =>
                notification._id === id ? { ...notification, approved } : notification
            )
        );
    };

    // Cambié la lógica para que minimice el popup en lugar de ocultarlo
    const handleAcceptNotifications = () => {
        setMinimizedPopup(true); // Minimizar el popup al aceptar
    };

    const handleRejectNotifications = () => {
        setMinimizedPopup(true); // Minimizar el popup al rechazar
    };

    if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
    if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;

    return (
        <>
            <Navbar />

            {/* Popup para notificaciones */}
            {showPopup && (
                <NotificationPopup
                    minimized={minimizedPopup}
                    onExpand={() => setMinimizedPopup(false)}
                    onAccept={handleAcceptNotifications}
                    onReject={handleRejectNotifications}
                />
            )}

            <main
                style={{ background: colors.brown[100] }}
                className="min-h-screen w-full flex items-center justify-center p-4 sm:p-10"
            >
                <div className="max-w-2xl w-full mx-auto pt-8 bg-white rounded-md px-4 sm:px-10">
                    <section className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-6">
                        <h1 className="text-2xl sm:text-3xl flex gap-3 items-center font-bold">
                            Notificaciones
                        </h1>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex flex-col gap-4">
                                <select
                                    value={filterType}
                                    onChange={handleFilterChange}
                                    className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                                >
                                    <option value="">Filtrar por tipo</option>
                                    <option value="WIKI_REMOVAL">Borrado de Wiki</option>
                                    <option value="ENTRY_ROLLBACK">Reversión de Entrada</option>
                                    <option value="ENTRY_CREATION">Creación de Entrada</option>
                                    <option value="ENTRY_REMOVAL">Borrado de Entrada</option>
                                    <option value="ENTRY_UPDATE">Actualización de Entrada</option>
                                    <option value="COMMENT">Commentarios</option>
                                </select>

                                <select
                                    value={filterStatus}
                                    onChange={handleStatusChange}
                                    className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                                >
                                    <option value="OTHER">Sin responder</option>
                                    <option value="ACCEPTED">Aceptadas</option>
                                    <option value="DENIED">Denegadas</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={markAllAsRead}
                            className="text-blue-500 hover:underline font-medium w-full sm:w-auto"
                        >
                            Marcar todos como leídos
                        </button>
                    </section>

                    {currentNotifications.length === 0 ? (
                        <p className="text-center text-lg text-gray-500">No tienes notificaciones por leer.</p>
                    ) : (
                        currentNotifications.map((notification, index) => (
                            <Notification
                                key={index}
                                id={notification._id}
                                title={notification.title}
                                user={notification.user}
                                notifDate={notification.notifDate}
                                notifType={notification.notifType}
                                approved={notification.approved}
                                read={notification.read}
                                onUpdate={handleUpdateNotification}
                            />
                        ))
                    )}

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
                                    currentPage === 1
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "hover:bg-indigo-500 bg-indigo-600"
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
