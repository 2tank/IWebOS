import { useNavigate, useParams} from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from "axios";
import apiEndpoint from '../assets/apiEndpoints.json'
import { useSession } from '../Common/SessionProvider'

function SingleEntry({item,wiki_id,setData}){

    const navigate = useNavigate()

    const { nameWiki } = useParams();
    const { user } = useSession();

    const clickEntry = () => {
        navigate('/wikis/'+`${nameWiki}`+'/entries/' + `${item.title.split(" ").slice(0, 2).join("")}` , {
            state: { "id": item._id },
          });
    }

    const modifyHandler = (event) =>{
      event.stopPropagation()
      navigate('/wikis/'+`${nameWiki}`+'/entries/' + `${item.title.split(" ").slice(0, 2).join("")}` + '/modify' , {
        state: { "entry_id": item._id},
      });
    }

    const deleteHandler = async(event) =>{
      event.stopPropagation();
      await axios.delete(apiEndpoint.api + '/entries/' + item._id);
      await axios.delete(apiEndpoint.api + '/wikis/' + wiki_id + '/delete_entry/' +  item._id);
      setData((prevData) => prevData.filter((entry) => entry._id !== item._id));
    }

    return (

    <div onClick={clickEntry} tabIndex={0} className="flex w-full hover:cursor-pointer border-2 border-gray-300 flex-col bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 hover:border-2 hover:border-green-900 focus:outline-none focus:ring-2 focus:ring-green-900">
      <header className="flex items-center space-x-4 mb-4 ">

        <Avatar>{item.creator.charAt(0).toUpperCase()}</Avatar>

        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
          <p className="text-sm text-gray-500">Creado por: {item.creator}</p>
        </div>
        <div className='flex-1 flex flex-row justify-end'>

          {((user?.rol === 'ADMIN') || (user?.rol === 'EDITOR') || (user?.rol === 'REDACTOR')) && (
          <button
            onClick={modifyHandler}
            className='m-3'
            tabIndex={0}
          >
            <EditIcon color='warning' fontSize='large'></EditIcon>
          </button>
          )}

          {((user?.rol === 'ADMIN') || (user?.rol === 'EDITOR'))&& (
          <button
            onClick={deleteHandler}
            className='m-3'
            tabIndex={0}
          >
            <DeleteIcon color='error' fontSize='large'></DeleteIcon>
          </button>
          )}

        </div>
      </header>

      <section className="mb-4">
        <p className="text-gray-700">{item.description}</p>
      </section>

      <footer className="flex justify-between items-center text-gray-600 text-sm border-t pt-2">
        <span>Fecha de creación: {new Date(item.creationDate).toLocaleDateString()}</span>
        <span>Etiquetas: {item.tags ? item.tags.join(' • ') : "-"}</span>
      </footer>
    </div>
  );

}

export default SingleEntry;