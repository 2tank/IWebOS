import React, { useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

import url from '../url.json';

function PostCommentary({entryID, entryVersionID, commentaryInReply, parentCommentaryPostReaction, hideReplyForm}) {
  //const [user, setUser] = useState('');
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);
//  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = cookies.get('email');

    const payload = {
        content: content,
        entry: entryID,
        entry_version: entryVersionID,
        user: user,
        commentaryInReply: commentaryInReply,
    };

    try {
      const response = await axios.post(`${url.active_urlBase}/commentaries/`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error("Error posting data:", error);
    } finally {
        parentCommentaryPostReaction();
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  return (
    <div>
      <div className='border-2 border-gray-200 rounded-xl pl-5 pr-2 pb-2 pt-5 hover:shadow-sm text-sm sm:text-base'>
        <form onSubmit={handleSubmit} className='space-y-2'>
            {/*
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
            */}
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
          <div className="flex justify-end gap-x-1">
              <div className="flex px-2 py-1 rounded-full text-black font-normal
              transition hover:duration-0 ease-out duration-300
            hover:bg-gray-100 hover:shadow-sm">
                <button onClick={hideReplyForm}>Cancelar</button>
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
