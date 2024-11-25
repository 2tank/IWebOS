import { useEffect, useState } from "react"
import axios from "axios"
import defaultPicture from "../assets/image.png"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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

    const hideResponses = () => {
        setResponses([]);
        setShowResponses(false);
    };

    useEffect(() => {
        const fetchData = async() => {
            try {
                setStyling();
                const response = await axios.get(urlCommentaryID);
                setData(response.data);
                if(response.data.replies.length > 0) setHasResponses(true);
                if(response.data.commentaryInReply == null && reply == 0 && response.data.entryRating != null) {
                    setGrade(response.data.entryRating);
                }
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

    //if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
    if (loading) return (
        <div>
            <div className='container'>
                <div className={`flex flex-row flex-wrap bg-white text-black justify-start space-x-4 mx-auto ${commentaryReplyDependantStyling}`}>
                    <div class="px-4 sm:max-w-sm w-full">
                        <div class="animate-pulse flex space-x-4">
                            <div class="rounded-full bg-slate-400 h-10 w-10 sm:h-12 sm:w-12"></div>
                            <div class="flex-1 py-1">
                                <div class="grid grid-cols-3 gap-2 sm:gap-4">
                                    <div class="h-4 bg-slate-400 rounded-full col-span-1"></div>
                                    <div class="h-4 bg-slate-400 rounded-full col-span-1"></div>
                                    <div class="h-4 bg-slate-400 rounded-full col-span-1"></div>
                                </div>
                                <div className="mb-3"></div>
                                <div class="h-4 bg-slate-400 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;

    return (
        <div>
            <div className='container'>
                <div className={`flex flex-row flex-wrap bg-white text-black justify-start space-x-4 px-4 mx-auto ${commentaryReplyDependantStyling}`}>
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
                <div className="bg-white text-black py-1 justify-start space-x-4 ml-10 sm:ml-16">
                    {hasResponses ? 
                        showResponses ?
                            <div>
                                <div className="inline-flex flex-row items-center rounded-full px-2 py-1 text-blue-600 font-semibold 
                                transition ease-out duration-300
                                hover:bg-blue-100 hover:shadow-sm">
                                    <button className="align-text-bottom mt-1 pr-1" onClick={hideResponses}>
                                        <KeyboardArrowUpIcon color="blue" className="mb-1"/>
                                        Ocultar respuestas
                                    </button>
                                </div>
                                <div>{responses}</div>
                            </div>
                            :
                            <div className="inline-flex flex-row items-center rounded-full px-2 py-1 text-blue-600 font-semibold
                            transition hover:duration-0 ease-out duration-300
                            hover:bg-blue-100 hover:shadow-sm">
                                <button className="align-text-bottom mt-1 pr-1" onClick={loadResponses}>
                                    <KeyboardArrowDownIcon color="blue" className="mb-1"/>
                                    Mostrar respuestas
                                </button>
                            </div>
                        :
                        null}
                </div>
            </div>
        </div>
    )

}

export default SingleCommentary