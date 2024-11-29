import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "../Common/CommonOperations";

function VersionHistory({ entryID, onVersionChange }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentVersion, setCurrentVersion] = useState(null); // Estado para la versión actual
    const [isUpdating, setIsUpdating] = useState(false); // Estado para saber si estamos actualizando una versión

    const urlEntrada = `http://localhost:8000/entries/${entryID}/versions/`;
    const urlGetActual = `http://localhost:8000/entries/${entryID}/currentVersion/`;

    const fetchCurrentVersion = async () => {
        try {
            const response = await axios.get(urlGetActual);
            setCurrentVersion(response.data);
        } catch (err) {
            alert("No se pudo obtener la versión actual.");
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(urlEntrada);
            setData(response.data);
            await fetchCurrentVersion();
        } catch (err) {
            setError("Error al cargar las versiones.");
        } finally {
            setLoading(false);
        }
    };

    const updateVersion = async (versionID) => {
        try {
            setIsUpdating(true); // Iniciar el estado de actualización
            await axios.put(`${urlEntrada}${versionID}`);
            await fetchCurrentVersion(); // Recargar la versión actual
            if (onVersionChange) {
                onVersionChange(versionID);
            }
        } catch (err) {
            alert("No se pudo actualizar la versión.");
        } finally {
            setIsUpdating(false); // Finalizar la actualización
        }
    };

    const rollbackVersion = async (versionID) => {

        try {
            let response = null;
            setIsUpdating(true);
            response = await axios.put(`http://localhost:8000/versions/${versionID}`);

            console.log(response)

            await fetchCurrentVersion();


            if (onVersionChange && response) {
                onVersionChange(response.data);
            }
        } catch (err) {
            alert("No se pudo revertir la versión." +err);
        } finally {
            setIsUpdating(false);
        }
    };
    

    useEffect(() => {
        fetchData();
    }, [entryID]);

    if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
    if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;

    return (
        <div className="p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center border-b border-gray-600 pb-2">Historial de Versiones</h2>
            <ul className="space-y-6">
                {data.map((version) => (
                    <li key={version._id} className="p-4 rounded-lg border-gray-300 border-2 hover:shadow-xl transition-shadow">
                        <p className="text-lg font-semibold">Editor: <span className="font-normal">{version.editor}</span></p>
                        <p className="text-lg font-semibold">Fecha de Edición: <span className="font-normal">{formatDate(version.editDate)}</span></p>
                        <p className="text-lg font-semibold">Contenido:</p>
                        <p className="p-3 bg-gray-300 rounded-lg mt-2 text-sm">{version.content}</p>
                        {currentVersion && version._id === currentVersion._id ? (
                            <>
                                <div className="flex gap-3">
                                    <button
                                        disabled
                                        className="mt-4 bg-green-500 text-white  px-4 py-2 rounded cursor-not-allowed"
                                    >
                                        ACTUAL
                                    </button>
                                    <button
                                        onClick={() => rollbackVersion(version._id)}
                                        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                                        disabled={isUpdating} // Deshabilitar mientras se está actualizando
                                    >
                                        {isUpdating ? "Revirtiendo..." : "Revertir a esta versión"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => updateVersion(version._id)}
                                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                                    disabled={isUpdating} // Deshabilitar mientras se está actualizando
                                >
                                    {isUpdating ? "Actualizando..." : "Elegir como actual"}
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VersionHistory;
