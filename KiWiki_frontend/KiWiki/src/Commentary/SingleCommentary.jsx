import { useEffect, useState } from "react"
import axios from "axios"
import defaultPicture from "../assets/image.png"

function SingleCommentary({id, reply = 0}) {

    const urlCommentaryID = "http://localhost:8000/commentaries/" + id;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasResponses, setHasResponses] = useState(false);
    const [showResponses, setShowResponses] = useState(false);
    const [responses, setResponses] = useState([]);
    const [grade, setGrade] = useState(-1);
    const [commentaryReplyDependantStyling, setCommentaryReplyDependantStyling] = useState(null);

    const setStyling = () => {
        if(reply == 0) {
            setCommentaryReplyDependantStyling('mt-8');
        } else {
            setCommentaryReplyDependantStyling('mt-4');
        }
    };

    const loadResponses = () => {
        const responsesComponented = data.replies.map((replyCommentaryID) => <SingleCommentary id={replyCommentaryID} reply={reply + 1}/>);
        setResponses(responsesComponented);
        setShowResponses(true);
    };

    useEffect(() => {
        const fetchData = async() => {
            try {
                const response = await axios.get(urlCommentaryID);
                setData(response.data);
                if(response.data.replies.length > 0) setHasResponses(true);
                if(response.data.commentaryInReply == null && reply == 0 && response.data.entryRating != null) {
                    setGrade(response.data.entryRating);
                }
                setStyling();
                const dateSplitted = response.data.date.split('T');
                const timeSplitted = dateSplitted[1].split('.');
                const formattedDate = dateSplitted[0] + ' ' + timeSplitted[0];
                setData({
                    ...response.data,
                    date: formattedDate
                });
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
            <div className='container'> {/*ml-10*/}
                <div className={`flex flex-row flex-wrap bg-white text-black justify-start space-x-4 mx-auto ${commentaryReplyDependantStyling}`}>
                    <div className='flex flex-col'>
                        <img src={defaultPicture} className='h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-grey'/>
                    </div>
                    <div className="flex flex-col flex-wrap">
                        <div className="flex flex-row flex-wrap space-x-4">
                            <p className="text-sm sm:text-base font-bold">{data.user}</p>
                            {grade > -1 ?
                                <p className="text-sm sm:text-base">Puntuacion: {grade}/10</p>
                                :
                                null
                            }
                            <p className="text-sm sm:text-base text-gray-700">{data.date}</p>
                        </div>
                        <p className="text-sm sm:text-base">{data.content}</p>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap bg-white text-black py-2 justify-start space-x-4 ml-14 sm:ml-16">
                    {hasResponses ? 
                        showResponses ?
                            <div>{responses}</div>
                            :
                            <button onClick={loadResponses}>Mostrar respuestas</button>
                        :
                        null}
                </div>
            </div>
        </div>
    )

}

export default SingleCommentary