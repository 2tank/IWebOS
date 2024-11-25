import React, { useState } from 'react';
import axios from 'axios';

function PostCommentary({entryID, entryVersionID, commentaryInReply, parentCommentaryPostReaction}) {
  const [user, setUser] = useState('');
  const [content, setContent] = useState('');
//  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
        content: content,
        entry: entryID,
        entry_version: entryVersionID,
        user: user,
        commentaryInReply: commentaryInReply,
    };

    try {
      const response = await axios.post('http://localhost:8000/commentaries/', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      //setResponseMessage(response.data.message);  // Get message from FastAPI response
    } catch (error) {
      console.error("Error posting data:", error);
      //setResponseMessage('An error occurred.');
    } finally {
        parentCommentaryPostReaction();
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
            <label>Usuario:</label>
            <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
            />
        </div>
        <div>
            <label>Contenido:</label>
            <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            />
        </div>
        <button type="submit">Submit</button>
      </form>
      {/*<p>{responseMessage}</p>*/}
    </div>
  );
}

export default PostCommentary;
