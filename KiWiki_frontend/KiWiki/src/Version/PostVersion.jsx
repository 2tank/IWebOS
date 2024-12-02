import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FormTextInput from "../Common/FormTextInput";
import FormTextArea from "../Common/FormTextArea";
import UploadFile from "../Common/UploadFile";
import Navbar from "../Common/NavBar";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddLocationIcon from '@mui/icons-material/AddLocationAlt';
import CancelLocationIcon from '@mui/icons-material/Cancel';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import HideSourceIcon from '@mui/icons-material/HideSource';

function PostVersion() {
  const location = useLocation();
  const { id } = location.state || {};

  const navigate = useNavigate();
  const handleBack = () => {
      navigate(-1);
  };

  const urlVersion = "http://localhost:8000/versions/";
  // URL para obtener la versión
  const finalUrl = `${urlVersion}${id}`;

  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showAddImage, setShowAddImage] = useState(false);
  const [buttonClass, setButtonClass] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const formInputClassName = "block w-full resize-y p-2 text-black break-words bg-gray-300";

  const [formState, setFormState] = useState({
    editor: "",
    content: "",
    maps: [],
  });

  useEffect(() => {
    console.log('ID:', id); // Verificar que el ID esté presente

    const fetchData = async () => {
      try {
        const response = await axios.get(finalUrl);
        console.log("Respuesta de la API:", response.data);
        setFormState({
          editor: response.data.editor,
          content: response.data.content,
          maps: response.data.maps,
        });
      } catch (err) {
        setError("Error al cargar los datos.");
      } finally {
        console.log("fail")
        setLoading(false); // Desactivar el estado de carga
      }
    };

    if (id) fetchData();
  }, [id]);


  const handleMapInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMaps = [...formState.maps];
    updatedMaps[index][name] = value;
    setFormState((prev) => ({ ...prev, maps: updatedMaps }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const addNewMap = () => {
    setButtonClass("bounce-animation");
    setTimeout(() => {
      setButtonClass("");
    }, 300);
    setFormState((prev) => ({
      ...prev,
      maps: [...prev.maps, { latitude: "", longitude: "", mapdescription: "" }]
    }));
  };

  const removeMap = (index) => {
    const updatedMaps = formState.maps.filter((_, i) => i !== index);
    setFormState((prev) => ({ ...prev, maps: updatedMaps }));
  };

  const handleCreateVersion = async (e) => {
    e.preventDefault();

    const updatedVersion = {
      ...formState,
      editDate: new Date().toISOString(),
      attachments: [],
      links: [],
      maps: formState.maps.map((map) => ({
        location: {
          latitude: parseFloat(map.latitude),
          longitude: parseFloat(map.longitude),
        },
        description: map.mapdescription,
      })),
      reverted: false,
      entry_id: id,
    };

    try {
      const response = await axios.post(
        `http://localhost:8000/entries/${id}/versions`, updatedVersion, {
        headers: { "Content-Type": "application/json" },
      });
      setSubmitSuccess(true);
      setSubmitError(null);
      setFormState({
        editor: "",
        content: "",
        maps: [],
      });
    } catch (err) {
      setSubmitSuccess(false);
      setSubmitError("Ocurrió un error al crear la versión.");
    }
  };

  
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="min-h-screen flex flex-col bg-gray-100 text-black">
          <Navbar/>
          <div className="flex-grow p-5 w-4/6 mx-auto rounded-lg shadow-2xl bg-white">
            <ArrowBackIcon className="hover:cursor-pointer" onClick={handleBack}/> 
            <form onSubmit={handleCreateVersion} className="my-4">
              <div className="p-4 rounded-lg border-gray-300 border-2 hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold mb-4">Crear Nueva Versión</h2>
                <div className="mb-2">
                  <FormTextInput name={"editor"} value={formState.editor} label={"Editor"}
                    onChange={handleInputChange} required={true} className={formInputClassName} />
                </div>
                <div className="mb-2">
                  <FormTextArea name={"content"} value={formState.content} label={"Contenido"}
                    onChange={handleInputChange} required={true} className={formInputClassName} />
                </div>

                <div className="flex flex-col items-left mb-4">
                  <div>
                    <button type="button" onClick={addNewMap} className="mb-4">
                      <AddLocationIcon fontSize="large" className={`cursor-pointer ${buttonClass}`} />
                    </button>
                    <button type="button" onClick={() => setShowAddImage(!showAddImage)}>
                      {showAddImage ? <HideSourceIcon fontSize="large" className="cursor-pointer" /> :
                        <AttachFileIcon fontSize="large" className="cursor-pointer" />}
                    </button>
                  </div>

                  {formState.maps.map((map, index) => (
                    <div key={index} className="mb-4 border p-4 rounded">
                      <button type="button" onClick={() => removeMap(index)}>
                        <CancelLocationIcon fontSize="large" className="cursor-pointer" />
                      </button>
                      <div className="mt-1 flex gap-4">
                        <div className="mb-2">
                          <FormTextInput name={"longitude"} value={map.longitude} label={"Longitud"}
                            onChange={(e) => handleMapInputChange(e, index)} required={false} className={formInputClassName} />
                        </div>
                        <div className="mb-2">
                          <FormTextInput name={"latitude"} value={map.latitude} label={"Latitud"}
                            onChange={(e) => handleMapInputChange(e, index)} required={false} className={formInputClassName} />
                        </div>
                      </div>
                      <div className="mb-2">
                        <FormTextArea name={"mapdescription"} value={map.mapdescription} label={"Descripción"}
                          onChange={(e) => handleMapInputChange(e, index)} required={false} className={formInputClassName} />
                      </div>
                    </div>
                  ))}

                  {showAddImage && (
                    <div>
                      <UploadFile />
                    </div>
                  )}

                  {submitError && <p className="text-red-500">{submitError}</p>}
                  {submitSuccess && <p className="text-green-500">Entrada creada con éxito.</p>}
                </div>
                <button type="submit" className="block bg-green-500 mx-auto hover:bg-green-700 font-bold py-1 px-4 rounded-full text-white">
                  Crear Versión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default PostVersion;