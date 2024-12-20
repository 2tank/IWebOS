import { useEffect, useState } from "react"
import { useNavigate, useParams} from "react-router-dom";
import axios from "axios"
import DOMPurify from "dompurify";
import { formatDate } from "../Common/CommonOperations";
import './CSS/html.css'

import MapComponent from "../Common/MapComponent";

function SingleVersionSection({entryVersionID,entryID}){

    const navigate = useNavigate();

    const { nameWiki,entry_id } = useParams();

    const urlVersion = "http://localhost:8000/versions/" + entryVersionID;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const coordinates = [
        { latitude: 40.7128, longitude: -74.0060, description: 'Nueva York' },
        { latitude: 34.0522, longitude: -118.2437, description: 'Los Ángeles' },
        { latitude: 41.8781, longitude: -87.6298, description: 'Chicago' },
    ];

    const clickEditVersion = () => {

        navigate('/wikis/'+`${nameWiki}`+'/entries/' + `${entry_id}` + '/versionedit' , {
            state: { id: entryVersionID },
          });
    }

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
                <button className="bg-green-500 hover:bg-green-700 font-bold py-1 px-4 rounded-full text-white" onClick={clickEditVersion}>
                Editar Version
                </button>
            </div>
            <div className="flex gap-3 text-black">
                <span className="text-xs">Editado: {formatDate(data.editDate)}</span>
                <span className="text-xs">Editor: {data.editor}</span>
            </div>
            <div className="htmlcontent-container mt-2" dangerouslySetInnerHTML={{ __html: sanitizedHtmlContent }} />
            <div className="flex justify-center mt-4">
                <MapComponent coordinates={data.maps} />
            </div>
        </div>

    );
}

export default SingleVersionSection