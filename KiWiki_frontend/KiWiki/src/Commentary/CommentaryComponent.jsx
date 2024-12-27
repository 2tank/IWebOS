import { useEffect, useState } from "react"
import CommentarySection from "./CommentarySection"
import PostCommentary from "./PostCommentary"
import CommentaryFilters from "./CommentaryFilters";
import { useSession } from '../Common/SessionProvider';

function CommentaryComponent({entryID, entryVersionID}) {

    const { isLoggedIn } = useSession();

    const [tokenUpdate, setTokenUpdate] = useState(true);
    const [orderByNewest, setOrderByNewest] = useState(false);
    const [orderByOldest, setOrderByOldest] = useState(false);
    const [filterUser, setFilterUser] = useState(null);

    const updateCommentaries = () => {
        setTokenUpdate(false); //Desmontar comentarios para recargar
        setTimeout(() => {
            setTokenUpdate(true);
        }, 0); //Montar el componente de nuevo para recargar comentarios
    }

    useEffect(() => {
        updateCommentaries();
    }, [filterUser, orderByNewest, orderByOldest]);

    return(
        <div>
            <div className="container mt-2 sm:mt-6">
                <CommentaryFilters setOrderByNewest={setOrderByNewest} setOrderByOldest={setOrderByOldest} 
                    setFilterUser={setFilterUser} />
                {isLoggedIn && <PostCommentary entryID={entryID} entryVersionID={entryVersionID} reloadCommentaries={updateCommentaries}/>}
                {tokenUpdate && <CommentarySection entryID={entryID} entryVersionID={entryVersionID} 
                    sort_by_newest={orderByNewest} sort_by_oldest={orderByOldest} username={filterUser} />}
            </div>
        </div> 
    )
}

export default CommentaryComponent