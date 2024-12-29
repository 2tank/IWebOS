import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import apiEndpoint from '../assets/apiEndpoints.json';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSession } from '../Common/SessionProvider'


function SingleWiki({ item }) {

    const { user } = useSession();
    const navigate = useNavigate()

    const clickWiki = () => {

        navigate('/wikis/'+`${item.name}`+'/entries' , {
            state: { "id": item._id,
                    "name": item.name},
          });
    }

    const modifyHandler = (event) =>{
      event.stopPropagation()
      navigate('/wikis/'+`${item.name}`+'/modify' , {
        state: { "id": item._id },
      });
    }

    const deleteHandler = async(event) =>{
      event.stopPropagation()
      await axios.delete(apiEndpoint.api + '/wikis/' + item._id)

    }



    return (

    <div onClick={clickWiki} tabIndex={0} className="flex w-full flex-col bg-white shadow-md rounded-lg p-6 m-4 hover:shadow-xl transition-shadow duration-300 hover:border-2 hover:border-green-900 focus:outline-none focus:ring-2 focus:ring-green-900">
      <header className="flex items-center space-x-4 mb-4">

        <div className='flex'>
          <Avatar>{item.name.charAt(0).toUpperCase()}</Avatar>
        </div>

        <div className="flex flex-1 flex-col">
          <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
          <p className="text-sm text-gray-500 w-4/6 break-words">Creado por: {item.creator}</p>
        </div>
        <div className='flex-1 flex flex-row justify-end'>
          {((user?.rol === 'ADMIN'))&& (
          <button
            onClick={modifyHandler}
            className='m-3'
            tabIndex={0}
          >
            <EditIcon color='warning' fontSize='large'></EditIcon>
          </button>
          )}

          {((user?.rol === 'ADMIN'))&& (
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
        <span>Fecha: {new Date(item.date).toLocaleDateString()}</span>
        <span>Entradas: {item.entries ? (Array.isArray(item.entries) ? item.entries.length : item.entries.size) : 0}</span>
      </footer>
    </div>
  );
}


export default SingleWiki;
