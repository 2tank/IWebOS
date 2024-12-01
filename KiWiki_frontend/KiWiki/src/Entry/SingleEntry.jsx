import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';


function SingleEntry({ item }){

    const navigate = useNavigate()

    const clickWiki = () => {

        navigate('/wikis/'+`${item.name}`+'/entries' , {
            state: { "id": item._id },
          });
    }
    console.log(item.creator)
  
    return (
    
    <div onClick={clickWiki} tabIndex={0} className="flex w-full flex-col bg-white shadow-md rounded-lg p-6 m-4 hover:shadow-xl transition-shadow duration-300 hover:border-2 hover:border-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-900">
      <header className="flex items-center space-x-4 mb-4 ">

        <Avatar>{item.creator.charAt(0).toUpperCase()}</Avatar>

        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
          <p className="text-sm text-gray-500">Creado por: {item.creator}</p>
        </div>
      </header>

      <section className="mb-4">
        <p className="text-gray-700">{item.description}</p>
      </section>

      <footer className="flex justify-between items-center text-gray-600 text-sm border-t pt-2">
        <span>Fecha de creación: {new Date(item.creationDate).toLocaleDateString()}</span>
        <span>Etiquetas: {item.tags ? item.tags : "-"}</span>
      </footer>
    </div>
  );

}

export default SingleEntry;