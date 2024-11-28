import { useEffect, useState } from "react"
import axios from "axios"
import DOMPurify from "dompurify";
import './CSS/html.css'

function SingleVersionSection({entryVersionID}){

    const urlVersion = "http://localhost:8000/versions/" + entryVersionID;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axios.get(urlVersion);
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

    const sanitizedHtmlContent = DOMPurify.sanitize(data.content);

    return (
        <div>
            <div className="flex flex-wrap flex-col bg-green-700 text-white">
                <h1 className='flex justify-center'>PLACEHOLDER DEL FRONT DE VERSION</h1>
                <h2>Data version:</h2>
                <ul>
                    <li>ID: {data._id}</li>
                    <li>editor: {data.editor}</li>
                    <li>editDate: {data.editDate}</li>
                </ul>
            </div>
            Contenido:
            <div className="htmlcontent-container" dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }} />
        </div>
    );
}

export default SingleVersionSection