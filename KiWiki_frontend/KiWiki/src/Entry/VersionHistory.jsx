import React from "react";
import axios from "axios"
import { useEffect, useState } from "react"

function VersionHistory({entryID}) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const urlEntrada = "http://localhost:8000/entries/" + entryID  + "/versions/";

    console.log("entryID recibido:", entryID);


    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axios.get(urlEntrada);
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

    return (
        <div className="bg-gray-800 text-white p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Historial de Versiones</h2>
            <ul>
                {data.map((version) => (
                    <ul className="mb-4">
                        <li>ID: {version._id}</li>
                        <li>editor: {version.editor}</li>
                        <li>editDate: {version.editDate}</li>
                        <li>content: {version.content}</li>
                    </ul>
                ))}
            </ul>
        </div>
    );
}

export default VersionHistory
