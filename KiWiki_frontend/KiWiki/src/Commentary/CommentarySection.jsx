import { useEffect, useState } from "react"
import axios from "axios"
import SingleCommentary from "./SingleCommentary";

function CommentarySection({entryID, entryVersionID}) {

    const urlCommentaries = "http://localhost:8000/commentaries/?entry_id=" + entryID + "&entry_version_id=" + entryVersionID + "&only_main_commentaries=true&sort_by_newest=true";

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentaries, setCommentaries] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axios.get(urlCommentaries);
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if(data !== null) {
            console.log(data);
            const repliesComponented = data.map((commentary) => <SingleCommentary id={commentary._id} reply={0}/>);
            setCommentaries(repliesComponented);
        }
    }, [data]);

    if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
    if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;

    return (
        <div>
            <div className="container ml-0 sm:ml-6">
                {commentaries}
            </div>
        </div>
    )
}

export default CommentarySection