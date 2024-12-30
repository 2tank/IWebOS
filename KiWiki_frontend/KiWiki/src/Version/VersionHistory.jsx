import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDate } from "../Common/CommonOperations";
import VersionFilter from "./VersionFilter";
import { useSession } from '../Common/SessionProvider'

import FilesViewer from './FilesViewer'

import url from '../url.json';


function VersionHistory({ entryID, onVersionChange }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentVersion, setCurrentVersion] = useState(null); // Estado para la versión actual
    const [isUpdating, setIsUpdating] = useState(false); // Estado para saber si estamos actualizando una versión

    const urlEntrada = `${url.active_urlBase}/entries/${entryID}/versions/`;
    const urlGetActual = `${url.active_urlBase}/entries/${entryID}/currentVersion/`;

    const { isLoggedIn, setRol, user } = useSession();

    const [formState,setFormState] = useState({
        year: "",
        month: "",
        day: "",
        editor: "",
    });

    const fetchCurrentVersion = async () => {
        try {
            const response = await axios.get(urlGetActual);
            setCurrentVersion(response.data);
        } catch (err) {
            alert("No se pudo obtener la versión actual.");
        }
    };

    const fetchData = async (url) => {
        try {
            const response = await axios.get(url);
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

    const handleFilterVersion = async(e) => {
        e.preventDefault();

        const year = e.target.year.value;
        const month = e.target.month.value;
        const day = e.target.day.value;
        const editor = e.target.editor.value;

        let filterURL = `${url.active_urlBase}/versions/?entry_id=${entryID}`;

        if(year){
            filterURL += `&year=${year}`;
        }
        if(month){
            filterURL += `&month=${month}`;
        }
        if(day){
            filterURL += `&day=${day}`;
        }
        if(editor){
            filterURL += `&editor=${editor}`;
        }

        fetchData(filterURL);
    };

    const rollbackVersion = async (versionID) => {
        try {
            setIsUpdating(true); // Iniciar estado de actualización
            const response = await axios.put(`${url.active_urlBase}/versions/${versionID}`);
            if (response.status === 200) {
                console.log("Respuesta del backend:", response.data);
    
                // Actualizar la versión actual y la lista de versiones
                await fetchCurrentVersion();
                await fetchData(urlEntrada);
    
                // Notificar cambios si hay un callback
                if (onVersionChange) {
                    onVersionChange(response.data);
                }
            } else {
                alert("Error inesperado al revertir la versión.");
            }
        } catch (err) {
            alert("No se pudo revertir la versión: " + err);
        } finally {
            setIsUpdating(false); // Finalizar estado de actualización
        }
    };
    
    


    useEffect(() => {
        fetchData(urlEntrada);
    }, []);

    if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
    if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;

    return (
        <div className="p-6">
            <VersionFilter handleFilterVersion={handleFilterVersion} formState={formState} setFormState={setFormState}/>
            <h2 className="text-2xl font-bold mb-4 text-center border-b border-gray-600 pb-2">Historial de Versiones</h2>
            <ul className="space-y-6">
                {data.map((version) => (
                    <li key={version._id} className="p-4 rounded-lg border-gray-300 border-2 hover:shadow-xl transition-shadow">
                        <p className="text-lg font-semibold">Editor: <span className="font-normal">{version.editor}</span></p>
                        <p className="text-lg font-semibold">Fecha de Edición: <span className="font-normal">{formatDate(version.editDate)}</span></p>
                        {version._id}
                        {version.attachments && version.attachments.length > 0 && (
                            <>
                                <p className="text-lg font-semibold">Archivos:</p>
                               < FilesViewer attachments={version.attachments}/>
                            </>
                        )}

                        {version.maps && version.maps.length > 0 && (
                            <>
                                <p className="text-lg font-semibold">Mapas:</p>

                                <ul className="space-y-2">
                                {version.maps.map((map, index) => (
                                    <li key={index} className="p-3 bg-gray-300 rounded-lg mt-2 text-sm w-1/4">
                                        {map.description}
                                    </li>
                                ))}
                                </ul>
                            </>
                        )}
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
                                    {(user?.rol === 'EDITOR' || user?.rol === 'ADMIN') && (
                                    <button
                                        onClick={() => rollbackVersion(version._id)}
                                        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                                        disabled={isUpdating} // Deshabilitar mientras se está actualizando
                                    >
                                        {isUpdating ? "Revirtiendo..." : "Revertir esta versión"}
                                    </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {(user?.rol === 'ADMIN') && (
                                <button
                                    onClick={() => updateVersion(version._id)}
                                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                                    disabled={isUpdating} // Deshabilitar mientras se está actualizando
                                >
                                    {isUpdating ? "Actualizando..." : "Elegir como actual"}
                                </button>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default VersionHistory;
