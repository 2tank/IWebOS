import {useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiEndpoint from '../assets/apiEndpoints.json'
import axios from "axios";
import Navbar from "../Common/NavBar";
import FormTextInput from "../Common/FormTextInput";
import FormCheckBox from "../Common/FormCheckBox";

function PostEntry() {

  const { wiki_id } = useParams();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const formInputClassName = "block w-full resize-y p-2 text-black break-words bg-gray-300";
  const checkBoxClassName = "flex w-fit pr-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-amber-950 " +
    "dark:border-amber-600 dark:text-white my-2";

  // Inicializamos datos formulario
  const [formState, setFormState] = useState({
      title: "",
      creator: "",
      description: "",
      tags: [],
      });

  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Cargamos los tags de las Entradas nada más cargar la página
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiEndpoint.api + "/entries/?getTags=True");
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

    // Actualiza creationDate con la fecha y hora actual
    const updatedEntry = {
        ...formState,
        wiki: "",
        actual_version: "",
        creationDate: new Date().toISOString(),
    };

    try {
      const response = await axios.post(apiEndpoint.api + "/entries", updatedEntry, {
        headers: { "Content-Type": "application/json" },
      });
      await axios.patch(apiEndpoint.api + "/wikis/" + wiki_id + "/add_entry/" + response.data._id)
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
  };

  if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
  if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-black">
      <Navbar/>
      <form onSubmit={handleCreateEntry} className="flex-grow p-5 w-4/6 mx-auto rounded-lg shadow-2xl bg-white">
        <h2 className="text-lg mb-4">Crear Nueva Entrada</h2>
        <div className="mb-2">
            <FormTextInput name={"title"} value={formState.title} label={"Título"}
            onChange={handleInputChange} required={true} className={formInputClassName}/>
        </div>
        <div className="mb-2">
          <FormTextInput name={"creator"} value={formState.creator} label={"Creador"}
            onChange={handleInputChange} required={true} className={formInputClassName}/>
        </div>
        <div className="mb-2">
          <FormTextInput name={"description"} value={formState.description} label={"Descripción"}
            onChange={handleInputChange} required={true} className={formInputClassName}/>
        </div>
        <FormCheckBox name={"tags"} className={checkBoxClassName} data={data} onChange={handleInputChange} selectedElems={formState.tags} label={"Tags: "}/>
        {submitError && <p className="text-red-500">{submitError}</p>}
        {submitSuccess && <p className="text-green-500">Entrada creada con éxito.</p>}
        <button type="submit" className="block bg-green-500 mx-auto hover:bg-green-700 font-bold py-1 px-4 rounded-full text-white">
          Crear Entrada
        </button>
      </form>
    </div>
  );
}

export default PostEntry;
