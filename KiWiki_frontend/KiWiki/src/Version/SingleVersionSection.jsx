import { useEffect, useState } from "react"
import axios from "axios"
import DOMPurify from "dompurify";
import PostVersion from "./PostVersion";
import { formatDate } from "../Common/CommonOperations";
import './CSS/html.css'

function SingleVersionSection({entryVersionID}){

    const urlVersion = "http://localhost:8000/versions/" + entryVersionID;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [versionCreator, setVersionCreator] = useState(false);

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
            <div className="flex justify-end">
                <button className="bg-green-500 hover:bg-green-700 font-bold py-1 px-4 rounded-full text-white" onClick={() => setVersionCreator(!versionCreator)}>
                {versionCreator ? "Cancelar" : "Modificar Version"}
                </button>
            </div>
            <div className="flex gap-3 text-black">
                <span className="text-xs">Editado: {formatDate(data.editDate)}</span>
                <span className="text-xs">Editor: {data.editor}</span>
            </div>
            <div className="htmlcontent-container mt-2" dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }} />
            {versionCreator && <PostVersion editor={data.editor} content={data.content}/>}
        </div>
    );
}

export default SingleVersionSection