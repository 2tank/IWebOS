import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from "react-router-dom";
import axios from 'axios';
import Navbar from '../Common/NavBar.jsx';
import apiEndpoint from '../assets/apiEndpoints.json'
import GetInfoWiki from './GetInfoWiki.js';
import { format, parse } from "@formkit/tempo"


function CreateWiki(){


    const [formData, setFormData] = useState({
        nombre:"",
        creador:"",
        descripcion:""
    });

    const [modify, setModify] = useState(false)

    const [modifyData, setModifyData] = useState([])

    const [date, setDate] = useState('')



    const location = useLocation()

    const {id} = location.state || {} 
    
    useEffect(() => {
        if (id == null) {
            setDate(new Date()); 
        } else {
            setModify(true)
            const fetchData = async () => {
                try {
                    const {fecha, ...newDataConvert} = await GetInfoWiki(id)
                    setModifyData([newDataConvert.nombre, newDataConvert.descripcion])
                    setFormData(newDataConvert)
                    setDate(new Date(fecha));
                } catch (error) {
                    console.error('Error fetching wiki info:', error);
                }
            };

            fetchData();
        }
    }, [id]);
    
    const handleChange = (event) => {
        
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });  
    };

    async function formHandler(event){
        event.preventDefault()
        if(modify){

            const patchData = {}

            if(formData.nombre != modifyData[0]){
                patchData.name = formData.nombre
            }

            if(formData.descripcion != modifyData[1]){
                patchData.description = formData.descripcion
            }

            if(Object.keys(patchData).length > 0){
                await axios.patch(apiEndpoint.api+ '/wikis/' + id + '/modify_wiki/', patchData)
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                });

            }

        }else{
            await axios.post(apiEndpoint.api + '/wikis/',{
                name: formData.nombre,
                creator: formData.creador,
                description: formData.descripcion,
                date: date
            })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            });
        }

    }


    return(

        <>
            <Navbar/>

            <form onSubmit={formHandler} className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-6 mt-9">
                <h2 className="text-2xl font-bold text-gray-700">                        {id == null ? 'Crear Wiki' : 'Editar Wiki'}
                </h2>

                <div className="flex flex-col">
                    <label htmlFor="nombre" className="text-sm font-medium text-gray-600">Nombre</label>
                    <input 
                        type="text" 
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-900 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="creador" className="text-sm font-medium text-gray-600">Creador</label>
                    <input 
                        type="text" 
                        id="creador" 
                        name="creador"
                        value={formData.creador}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-900 focus:outline-none"
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="descripcion" className="text-sm font-medium text-gray-600">Descripción</label>
                    <textarea 
                        id="descripcion" 
                        name="descripcion" 
                        rows="3" 
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-900 focus:outline-none resize-none"
                    ></textarea>
                </div>

                <div className="flex flex-col">
                    <label htmlFor="fecha" className="text-sm font-medium text-gray-600">Fecha</label>
                    <input 
                        type="date" 
                        id="fecha" 
                        name="fecha" 
                        value={format(date, "YYYY-MM-DD", "en")} 
                        className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-900 focus:outline-none"
                        readOnly
                    />
                </div>

                <div className="flex justify-end">
                    <button 
                        className="bg-green-500 text-white font-medium py-2 px-4 rounded-md hover:bg-green-600 focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                    >
                        {id == null ? 'Crear Wiki' : 'Editar Wiki'}
                    </button>
                </div>
            </form>

        
        </>

    );

}

export default CreateWiki;


