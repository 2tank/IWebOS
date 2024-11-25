import React, { useState } from 'react';
import axios from 'axios';

function PostCommentary({entryID, entryVersionID}) {
  const [user, setUser] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(-1);
//  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
        content: content,
        entry: entryID,
        entryRating: rating,
        entry_version: entryVersionID,
        user: user,
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
    }
  };

  const cancel = (e) => {
    e.preventDefault();  // Prevenir que el botón de cancelar haga un submit
    setUser('');
    setContent('');
    setRating(-1);
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
        <div>
            <label>Puntuacion de la entrada:</label>
            <input
                type="range"
                min="0"
                max="10"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
            />
            <span>{rating}</span>            
        </div>
        <button onClick={cancel}>Cancelar</button>
        <button type="submit">Submit</button>
      </form>
      {/*<p>{responseMessage}</p>*/}
    </div>
  );
}

export default PostCommentary;
