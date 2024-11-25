import { useEffect, useState } from "react"
import axios from "axios"
import CommentarySection from "./CommentarySection"
import PostCommentary from "./PostCommentary"

function CommentaryComponent({entryID, entryVersionID}) {

    const [tokenUpdate, setTokenUpdate] = useState(true);

    const updateCommentaries = () => {
        setTokenUpdate(false); //Desmontar comentarios para recargar
        setTimeout(() => {
            setTokenUpdate(true);
        }, 0); //Montar el componente de nuevo para recargar comentarios
    }

    return(
        <div>
            <div className="container ml-0 sm:ml-6">
                <PostCommentary entryID={entryID} entryVersionID={entryVersionID} reloadCommentaries={updateCommentaries}/>
                {tokenUpdate && <CommentarySection entryID={entryID} entryVersionID={entryVersionID}/>}
            </div>
        </div> 
    )
}

export default CommentaryComponent