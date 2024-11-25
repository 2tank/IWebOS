import { useEffect, useState } from "react"
import axios from "axios"
import CommentarySection from "../Commentary/CommentarySection";
import CommentaryComponent from "../Commentary/CommentaryComponent";

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
        <div>
            <div className='flex flex-wrap flex-col bg-black text-white'>
                <h1 className='flex justify-center'>PLACEHOLDER DEL FRONT DE ENTRY (todo este cuadrado negro)</h1>
                <h2>Data entrada test:</h2>
                <ul>
                    <li>ID: {data._id}</li>
                    <li>Titulo: {data.title}</li>
                    <li>Creador: {data.creator}</li>
                    <li>Fecha de creacion: {data.creationDate}</li>
                    <li>Descripcion: {data.description}</li>
                    <li>Version ID: {data.actual_version}</li>
                </ul>
            </div>
            <div className='flex flex-wrap justify-center bg-yellow-300 text-black'>
                <h1>Componente de comentarios comienza debajo</h1>
            </div>
            <CommentaryComponent entryID={data._id} entryVersionID={data.actual_version}/>
        </div>
    )

}

export default EntryTest