import React, { useState, useRef } from 'react';
import axios from 'axios';

function PostCommentary({entryID, entryVersionID, reloadCommentaries}) {
  const [user, setUser] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const textareaRef = useRef(null);
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
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const cancel = (e) => {
    e.preventDefault();  // Prevenir que el botón de cancelar haga un submit
    setUser('');
    setContent('');
    setRating(0);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  return (
    <div>
      <div className='border-2 border-gray-200 rounded-xl pl-5 pr-2 pb-2 pt-5 hover:shadow-sm text-sm sm:text-base'>
        <h1 className='font-bold mb-2 underline'>Comenta sobre la entrada:</h1>
        <form onSubmit={handleSubmit} className='space-y-2'>
            <div className='flex flex-row flex-wrap'>
                <label>Usuario:</label>
                <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                    className='appearance-none caret-gray-800 border-gray-300 border-b-2 focus:outline-none
                    h-fit w-auto ml-2 flex-row flex-shrink flex-grow-0'
                />
            </div>
            <div className='flex flex-row flex-wrap'>
                <label>Contenido:</label>
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleContentChange}
                    required
                    rows={1}
                    className='appearance-none caret-gray-800 border-gray-300 border-b-2  focus:outline-none
                    h-fit w-auto ml-2 flex-row flex-grow flex-shrink-0 resize-none overflow-hidden'
                />
            </div>
          <div className=''>
            <div className='flex flex-row justify-end space-x-2 items-center flex-wrap'>
              <label className='flex-shrink flex-wrap w-auto'>Puntuacion de la entrada:</label>
              <input
                  type="range"
                  min="0"
                  max="10"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className='appearance-none bg-transparent caret-green-400 accent-green-400 rounded-full max-h-2'
                  style={{
                    background: `linear-gradient(to right, #60a5fa ${rating * 10}%, #d1d5db ${rating * 10}%)`,
                  }}
              />
              <span className='flex-shrink-0 w-12'>{rating} /10</span>
            </div>
          </div>
          <div className="flex justify-end gap-x-1">
            <div className="flex px-2 py-1 rounded-full text-black font-normal
            transition hover:duration-0 ease-out duration-300
          hover:bg-gray-100 hover:shadow-sm">
              <button onClick={cancel}>Cancelar</button>
            </div>
            <div className="flex px-2 py-1 rounded-full text-black font-semibold
            transition hover:duration-0 ease-out duration-300
          hover:bg-green-100 hover:shadow-sm">
              <button type="submit">Enviar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostCommentary;
