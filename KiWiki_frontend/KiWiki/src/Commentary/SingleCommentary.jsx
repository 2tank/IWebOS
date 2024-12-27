import { useEffect, useState } from "react"
import axios from "axios"
import defaultPicture from "../assets/image.png"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PostCommentaryReply from "./PostCommentaryReply"
import {formatDateTime} from "../Common/CommonOperations"
import { useSession } from '../Common/SessionProvider';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function SingleCommentary({id, reply = 0, adminMode = false, handleDeleteCommentarySection, childDelete}) {

    const urlCommentaryID = "http://localhost:8000/commentaries/" + id;

    const { isLoggedIn } = useSession();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasResponses, setHasResponses] = useState(false);
    const [showResponses, setShowResponses] = useState(false);
    const [responses, setResponses] = useState([]);
    const [grade, setGrade] = useState(-1);
    const [commentaryReplyDependantStyling, setCommentaryReplyDependantStyling] = useState(null);
    const [replyFormActive, setReplyFormActive] = useState(false);
    const [tokenReloadCommentary, setTokenReloadCommentary] = useState(false);

    const [deletePermission, setDeletePermission] = useState(false);

    const childDeleteFather = (id) => {
        setResponses(data.replies.filter((replyCommentaryID) => replyCommentaryID !== id));
        if(responses.length == 0) {
            hideResponses();
            setHasResponses(false);
        }
    }

    const setStyling = () => {
        if(reply == 0) {
            setCommentaryReplyDependantStyling('mt-8');
        } else {
            setCommentaryReplyDependantStyling('mt-4');
        }
    };

    const reloadCommentary = () => {
        setTokenReloadCommentary((lastVal) => !lastVal);
    }

    const loadResponses = () => {
        const responsesComponented = data.replies.map((replyCommentaryID) => <SingleCommentary key={replyCommentaryID} id={replyCommentaryID} reply={reply + 1} adminMode={adminMode} childDelete={childDeleteFather}/>);
        setResponses(responsesComponented);
        setShowResponses(true);
    };

    const hideResponses = () => {
        setResponses([]);
        setShowResponses(false);
    };

    const activateReplyForm = () => {
        setReplyFormActive(true);
    };

    const hideReplyForm = () => {
        setReplyFormActive(false);
    };

    const responseCommentaryPosted = async() => {
        hideReplyForm();
        setHasResponses(true);
        reloadCommentary();
        hideResponses();
    }

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
                /*
                const dateSplitted = response.data.date.split('T');
                const timeSplitted = dateSplitted[1].split('.');
                const formattedDate = dateSplitted[0] + ' ' + timeSplitted[0];
                */
                const formattedDate = formatDateTime(response.data.date);
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
    }, [tokenReloadCommentary]);

    useEffect(() => {
        if (isLoggedIn && !loading) {
            const user = cookies.get('email');
            if (data.user === user) {
                setDeletePermission(true);
            } else {
                setDeletePermission(false);
            }
        } else {
            setDeletePermission(false);
        }
    }, [isLoggedIn]);

    const deleteCommentary = async() => {
        try {
            await axios.delete(urlCommentaryID);
            if(reply == 0) {
                handleDeleteCommentarySection(id);
            }
            else {
                childDelete(id);
            }
        } catch (err) {
            setError(err.message);
        } finally {
        
        }
    };

    //if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
    if (loading) return (
        <div>
        {reply == 0 ? 
            <div>
                <div className='container'>
                    <div className={`flex flex-row flex-wrap bg-white text-black justify-start space-x-4 mx-auto ${commentaryReplyDependantStyling}`}>
                        <div className="px-4 sm:max-w-sm w-full">
                            <div className="animate-pulse flex space-x-4">
                                <div className="rounded-full bg-slate-400 h-10 w-10 sm:h-12 sm:w-12"></div>
                                <div className="flex-1 py-1">
                                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                        <div className="h-4 bg-slate-400 rounded-full col-span-1"></div>
                                        <div className="h-4 bg-slate-400 rounded-full col-span-1"></div>
                                        <div className="h-4 bg-slate-400 rounded-full col-span-1"></div>
                                    </div>
                                    <div className="mb-3"></div>
                                    <div className="h-4 bg-slate-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
            <div>
                <div className='container'>
                    <div className={`flex flex-row flex-wrap bg-white text-black justify-start space-x-4 mx-auto ${commentaryReplyDependantStyling}`}>
                        <div className="px-4 sm:max-w-sm w-full">
                            <div className="animate-pulse flex space-x-4">
                                <div className="rounded-full bg-slate-400 h-10 w-10 sm:h-12 sm:w-12"></div>
                                <div className="flex-1 py-1">
                                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                        <div className="h-4 bg-slate-400 rounded-full col-span-1"></div>
                                        <div className="h-4 bg-slate-400 rounded-full col-span-2"></div>
                                    </div>
                                    <div className="mb-3"></div>
                                    <div className="h-4 bg-slate-400 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }
        </div>
    );
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div className='container'>
                <div className={`flex flex-row flex-wrap w-full bg-white text-black justify-start space-x-4 px-4 mx-auto ${commentaryReplyDependantStyling}`}>
                    {/* 
                    <div className='flex flex-col'>
                        <img src={defaultPicture} className='h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-grey'/>
                    </div>
                    */}
                    <div className="flex flex-col flex-wrap ml-12 sm:ml-14">
                        <div className="inline-flex flex-wrap items-center">
                            <p className="mr-2 sm:mr-4 text-sm sm:text-base font-bold">{data.user}</p>
                            {grade > -1 ?
                                <p className="mr-2 sm:mr-4 text-sm sm:text-base">Puntuacion: {grade}/10</p>
                                :
                                null
                            }
                            <p className="text-sm sm:text-base text-gray-700">{data.date}</p>
                            {adminMode || deletePermission ? 
                            <button onClick={deleteCommentary} className="bg-red-300 rounded-full px-2 py-1 ml-2 sm:ml-4">Borrar comentario</button>
                            :
                            null
                            }
                        </div>
                        <div className="inline-flex flex-wrap max-w-xs sm:max-w-sm md:max-w-lg xl:max-w-5xl 2xl:max-w-7xl">
                            <p className="text-sm sm:text-base w-full max-w-full break-words hyphens-auto">{data.content}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white text-black space-x-4 ml-14 sm:ml-16">
                    { isLoggedIn && (
                    <div>
                        {!replyFormActive ? 
                            (
                            <div className="justify-start inline-flex flex-row items-center rounded-full px-2 py-1 mb-1 ml-2 text-black font-semibold
                            transition hover:duration-0 ease-out duration-300
                            hover:bg-gray-200 hover:shadow-sm">
                                <button onClick={activateReplyForm}>Responder</button>
                            </div>
                            )
                            :
                            (
                            <div className="flex-col px-2 py-1 mb-1 ml-2 text-black">
                                <PostCommentaryReply entryID={data.entry} entryVersionID={data.entry_version} commentaryInReply={data._id} 
                                parentCommentaryPostReaction={responseCommentaryPosted} hideReplyForm={hideReplyForm}/>
                            </div>
                            )
                        }
                    </div>)}
                    {hasResponses ? 
                        showResponses ?
                            <div>
                                <div className="justify-start inline-flex flex-row items-center rounded-full px-2 py-1 text-blue-600 font-semibold 
                                transition hover:duration-0 ease-out duration-300
                                hover:bg-blue-100 hover:shadow-sm">
                                    <button className="align-text-bottom text-sm sm:text-base mt-1 pr-1" onClick={hideResponses}>
                                        <KeyboardArrowUpIcon color="blue" className="mb-1"/>
                                        Ocultar respuestas
                                    </button>
                                </div>
                                <div>
                                    {responses}
                                </div>
                            </div>
                            :
                            <div className="justify-start inline-flex flex-row items-center rounded-full px-2 py-1 text-blue-600 font-semibold
                            transition hover:duration-0 ease-out duration-300
                            hover:bg-blue-100 hover:shadow-sm">
                                <button className="align-text-bottom text-sm sm:text-base mt-1 pr-1" onClick={loadResponses}>
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