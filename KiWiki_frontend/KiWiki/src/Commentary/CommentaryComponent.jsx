import { useEffect, useState } from "react"
import axios from "axios"
import CommentarySection from "./CommentarySection"
import PostCommentary from "./PostCommentary"

function CommentaryComponent({entryID, entryVersionID}) {

    return(
        <div>
            <PostCommentary entryID={entryID} entryVersionID={entryVersionID}/>
            <CommentarySection entryID={entryID} entryVersionID={entryVersionID} />
        </div> 
    )
}

export default CommentaryComponent