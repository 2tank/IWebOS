import { useEffect, useState } from "react"
import axios from "axios"

function EntryTest() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axios.get("http://localhost:8000/entries/672644cbdc02d93cacc94f1d");
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
        <div className='max-h-screen flex-row justify-center items-center max-h-screen bg-white'>
            <h1>Data:</h1>
            <ul>
                <li>Titulo: {data.title}</li>
                <li>Creador: {data.creator}</li>
            </ul>
        </div>
    )

}

export default EntryTest