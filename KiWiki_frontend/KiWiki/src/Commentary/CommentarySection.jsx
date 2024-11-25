import { useEffect, useState } from "react"
import axios from "axios"
import SingleCommentary from "./SingleCommentary";

function CommentarySection({entryID, entryVersionID, sort_by_newest = false, sort_by_oldest = false, username = null}) {

    const [urlCommentaries, setUrlCommentaries] = useState("");
    const [extraParam, setExtraParam] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentaries, setCommentaries] = useState([]);

    const setFilters = () => {
        let paramString = "";
        if (sort_by_newest) {
          paramString += "&sort_by_newest=true";
        } else if (sort_by_oldest) {
          paramString += "&sort_by_oldest=true";
        } else {
          paramString += "&sort_by_newest=true";
        }
        if(username !== null) {
            paramString += `&user_id=${username}`
        }
        setExtraParam(paramString);
      };
    
      useEffect(() => {
        if (extraParam) {
          setUrlCommentaries(
            `http://localhost:8000/commentaries/?entry_id=${entryID}&entry_version_id=${entryVersionID}&only_main_commentaries=true${extraParam}`
          );
        }
      }, [extraParam, entryID, entryVersionID]);

    useEffect(() => {
        const fetchData = async() => {
            try {
                if(urlCommentaries) {
                    const response = await axios.get(urlCommentaries);
                    setData(response.data);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [urlCommentaries]);

    useEffect(() => {
        if(data !== null) {
            console.log(data);
            const repliesComponented = data.map((commentary) => <SingleCommentary id={commentary._id} reply={0}/>);
            setCommentaries(repliesComponented);
        }
    }, [data]);

    useEffect(() => {
        setFilters();
    }, [entryID, entryVersionID]);

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