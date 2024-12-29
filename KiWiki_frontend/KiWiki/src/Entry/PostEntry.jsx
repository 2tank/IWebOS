import {useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import GetInfoEntry from './GetInfoEntry.js';
import apiEndpoint from '../assets/apiEndpoints.json'
import axios from "axios";
import Navbar from "../Common/NavBar";
import FormTextInput from "../Common/FormTextInput";
import FormCheckBox from "../Common/FormCheckBox";
import { useSession } from '../Common/SessionProvider';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import url from '../url.json';

function PostEntry() {


  const { wiki_id } = useParams();
  const { user } = useSession();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const navigate = useNavigate();

  const location = useLocation()

  const {entry_id} = location.state || {}

  const handleBack = () => {
    navigate(-1);
  };

  const formInputClassName = "block w-full resize-y p-2 text-black break-words bg-gray-300";
  const checkBoxClassName = "flex flex-wrap w-1/2 max-h-24 p-2 overflow-y-auto gap-2 border border-gray-300 " +
  "rounded-lg shadow-sm dark:bg-amber-950 dark:border-amber-600 dark:text-white";

  // Inicializamos datos formulario
  const [formState, setFormState] = useState({
      title: "",
      creator: user.email,
      description: "",
      tags: [],
      });

  const [noModifyData, setNoModifyData] = useState(null)

  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [modify, setModify] = useState(false)

  // Cargamos los tags de las Entradas nada más cargar la página
  useEffect(() => {

    if(entry_id != null){
        setModify(true)
            const fetchData1 = async () => {
                try {
                    const newDataConvert = await GetInfoEntry(entry_id)
                    setFormState(newDataConvert)
                    } catch (error) {
                    console.error('Error fetching wiki info:', error);
                }
            };
            fetchData1()
    }
      const fetchData = async () => {
        try {
          const response = await axios.get(url.active_urlBase + "/entries/?getTags=True");
          setData(response.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    
   
  }, [entry_id || wiki_id]);

  // Manejo del cambio en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if(name == "tags"){
      const selectedTags = new Set(formState.tags);
      if(checked){
        selectedTags.add(value);  
      }else{
        selectedTags.delete(value);
      }
      setFormState((prev) => ({ ...prev, tags: Array.from(selectedTags) }));
    }else{
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Envío del formulario para crear una nueva entrada
  const handleCreateEntry = async (e) => {
    e.preventDefault();

    if(modify){
      try {
 
        if(Object.keys(formState).length > 0){
          await axios.put(url.active_urlBase + '/entries/' + entry_id, formState)
          .then((response) => {
              console.log(response)
          })
          .catch((error) => {
              console.log(error)
          });

      }

      } catch (err) {
        setSubmitSuccess(false); // Marca fallo
        if (err.response?.status === 422) {
          setSubmitError("La entrada tiene un formato inválido. Por favor, revisa los datos." + err);
        } else if (err.response?.status === 500) {
          setSubmitError("Hubo un error en el servidor. Intenta nuevamente más tarde.");
        } else {
          setSubmitError("Ocurrió un error desconocido.");
        }
      }
    }
    else{
    // Actualiza creationDate con la fecha y hora actual
    const updatedEntry = {
      ...formState,
      wiki: "",
      actual_version: "",
      creationDate: new Date().toISOString(),
    };
    console.log(updatedEntry);

    try {
      const response = await axios.post(url.active_urlBase + "/entries", updatedEntry, {
        headers: { "Content-Type": "application/json" },
      });
      await axios.patch(url.active_urlBase + "/wikis/" + wiki_id + "/add_entry/" + response.data._id)
      setSubmitSuccess(true); // Marca el éxito
      setSubmitError(null); // Limpia errores previos
      setFormState({
        title: "",
        creator: "",
        description: "",
        tags: [],
      }); // Resetea el formulario
    } catch (err) {
      setSubmitSuccess(false); // Marca fallo
      if (err.response?.status === 422) {
        setSubmitError("La entrada tiene un formato inválido. Por favor, revisa los datos." + err);
      } else if (err.response?.status === 500) {
        setSubmitError("Hubo un error en el servidor. Intenta nuevamente más tarde.");
      } else {
        setSubmitError("Ocurrió un error desconocido.");
      }
    }
  }  
  };

  if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
  if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Navbar/>
      <form onSubmit={handleCreateEntry} className="p-5 w-full sm:w-5/6 md:w-5/6 lg:w-4/6 mx-auto rounded-lg shadow-2xl bg-white">
        <ArrowBackIcon className="hover:cursor-pointer" onClick={handleBack}/>
        <div className="p-4 my-4 rounded-lg border-gray-300 border-2 hover:shadow-xl transition-shadow">
          <h2 className="text-lg mb-4 font-bold">Crear Nueva Entrada</h2>
          <div className="mb-2">
              <FormTextInput name={"title"} value={formState.title} label={"Título"}
              onChange={handleInputChange} required={true} className={formInputClassName}/>
          </div>
          <div className="mb-2">
            <FormTextInput name={"creator"} value={formState.creator} label={"Creador"}
              onChange={handleInputChange} required={true} className={formInputClassName} readOnly={true}/>
          </div>
          <div className="mb-2">
            <FormTextInput name={"description"} value={formState.description} label={"Descripción"}
              onChange={handleInputChange} required={true} className={formInputClassName}/>
          </div>
          <FormCheckBox name={"tags"} className={checkBoxClassName} data={data} onChange={handleInputChange} selectedElems={formState.tags} label={"Tags: "}/>
          {submitError && <p className="text-red-500">{submitError}</p>}
          {submitSuccess && <p className="text-green-500">Entrada creada con éxito.</p>}
          <button type="submit" className="block bg-green-500 mx-auto hover:bg-green-700 mt-8 font-bold py-1 px-4 rounded-full text-white">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostEntry;
