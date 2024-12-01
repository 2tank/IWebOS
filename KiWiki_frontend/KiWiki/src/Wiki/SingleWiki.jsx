import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import apiEndpoint from '../assets/apiEndpoints.json';

function SingleWiki({ item }) {
  
    const navigate = useNavigate()

    const clickWiki = () => {

        navigate('/wikis/'+`${item.name}`+'/entries' , {
            state: { "id": item._id },
          });
    }
    
  
  
    return (
    
    <div onClick={clickWiki} tabIndex={0} className="flex w-full hover:cursor-pointer flex-col bg-white shadow-md rounded-lg p-6 m-4 hover:shadow-xl transition-shadow duration-300 hover:border-2 hover:border-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-900">
      <header className="flex items-center space-x-4 mb-4 ">

        <Avatar>{item.creator.charAt(0).toUpperCase()}</Avatar>

        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
          <p className="text-sm text-gray-500">Creado por: {item.creator}</p>
        </div>
      </header>

      <section className="mb-4">
        <p className="text-gray-700">{item.description}</p>
      </section>

      <footer className="flex justify-between items-center text-gray-600 text-sm border-t pt-2">
        <span>Fecha: {new Date(item.date).toLocaleDateString()}</span>
        <span>Entradas: {item.entries ? (Array.isArray(item.entries) ? item.entries.length : item.entries.size) : 0}</span>
      </footer>
    </div>
  );
}


export default SingleWiki;
