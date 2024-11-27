import React, { useState } from 'react';
import axios from 'axios';

function PostCommentary({entryID, entryVersionID, reloadCommentaries}) {
  const [user, setUser] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
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
      reloadCommentaries();
      //setResponseMessage(response.data.message);  // Get message from FastAPI response
    } catch (error) {
      console.error("Error posting data:", error);
      //setResponseMessage('An error occurred.');
    } finally {
      setUser('');
      setContent('');
      setRating(0);
    }
  };

  const cancel = (e) => {
    e.preventDefault();  // Prevenir que el botón de cancelar haga un submit
    setUser('');
    setContent('');
    setRating(0);
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
        <div className="flex justify-end gap-x-1">
          <div className="flex px-2 py-1 rounded-full text-black font-normal
          transition hover:duration-0 ease-out duration-300
        hover:bg-gray-100 hover:shadow-sm">
            <button onClick={cancel}>Cancelar</button>
          </div>
          <div className="flex px-2 py-1 rounded-full text-black font-semibold
          transition hover:duration-0 ease-out duration-300
        hover:bg-blue-100 hover:shadow-sm">
            <button type="submit">Enviar</button>
          </div>
        </div>
      </form>
      {/*<p>{responseMessage}</p>*/}
    </div>
  );
}

export default PostCommentary;