import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FormTextInput from "../Common/FormTextInput";
import FormTextArea from "../Common/FormTextArea";
import UploadFile from "../Common/UploadFile";
import MapsViewer from './Mapsviewer';
import FilesViewer from "./FilesViewer";
import Navbar from "../Common/NavBar";
import LanguageSelector from "../Common/LanguageSelector";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddLocationIcon from '@mui/icons-material/AddLocationAlt';
import CancelLocationIcon from '@mui/icons-material/Cancel';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import HideSourceIcon from '@mui/icons-material/HideSource';

import apiEndPoints from '../assets/apiEndpoints.json'

import { useSession } from '../Common/SessionProvider'
import url from '../url.json';

import { v4 as uuidv4 } from 'uuid';

const azureTranslateKey = "89eRbsY6P8evCNoIoGbA9SBwrIGkwWWCg0Z7voA9ukagrzaLesM6JQQJ99ALACmepeSXJ3w3AAAbACOGkF3T";
const azureEndpoint = "https://api.cognitive.microsofttranslator.com";
const azureLocation = "uksouth";

function PostVersion() {
  const location = useLocation();
  const { id, redactor } = location.state || {};

  const navigate = useNavigate();
  const handleBack = () => {
      navigate(-1);
  };

  const { user,isLoggedIn } = useSession();


  const urlVersion = apiEndPoints.api +  "/versions/";

  const finalUrl = `${urlVersion}${id}`;

  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showAddImage, setShowAddImage] = useState(false);
  const [buttonClass, setButtonClass] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [entryId, setEntryId] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState("en");

  const formInputClassName = "block w-full resize-y p-2 text-black break-words bg-gray-300";
  const formTextAreaClassName = "block w-full p-2 text-black bg-gray-300 resize-none h-auto";

  const [formState, setFormState] = useState({
    maps: [],
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(finalUrl);
        setEntryId(response.data.entry_id);

        setFormState({
          editor: user.email,
          content: response.data.content || "",
          originalMaps: response.data.maps || [],
          attachments: response.data.attachments || [],
        });

      } catch (err) {
        setError("Error al cargar los datos.");
      } finally {
        console.log("fail")
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const detectLanguage = async (text) => {
    try {
      const response = await axios({
        baseURL: azureEndpoint,
        url: '/detect',
        method: 'post',
        headers: {
          'Ocp-Apim-Subscription-Key': azureTranslateKey,
          'Ocp-Apim-Subscription-Region': azureLocation,
          'Content-Type': 'application/json',
          'X-ClientTraceId': uuidv4().toString(),
        },
        params: {
          'api-version': '3.0',
        },
        data: [{ 'text': text }],
        responseType: 'json',
      });

      return response.data[0].language;
    } catch (error) {
      console.error('Error al detectar el idioma:', error);
      return null;
    }
  };

  const translateText = async (text) => {
    try {
      const detectedLang = await detectLanguage(text);

      if (!detectedLang) {
        console.warn('No se pudo detectar el idioma, usando "es" como predeterminado.');
      }

      const response = await axios({
        baseURL: azureEndpoint,
        url: '/translate',
        method: 'post',
        headers: {
          'Ocp-Apim-Subscription-Key': azureTranslateKey,
          'Ocp-Apim-Subscription-Region': azureLocation,
          'Content-Type': 'application/json',
          'X-ClientTraceId': uuidv4().toString()
        },
        params: {
          'api-version': '3.0',
          'from': detectedLang || 'es',
          'to': targetLanguage
        },
        data: [{ 'text': text }],
        responseType: 'json'
      });

      return response.data[0].translations[0].text;
    } catch (error) {
      console.error('Error al traducir el texto:', error);
      return text;
    }
  };

  const translateMapDescriptions = async (maps) => {
    return Promise.all(
      maps.map(async (map) => {
        const translatedDescription = await translateText(map.description, targetLanguage);
        return { ...map, description: translatedDescription };
      })
    );
  };

  const handleTranslate = async () => {
    const translatedContent = await translateText(formState.content);
    const translatedMaps = formState.maps ? await translateMapDescriptions(formState.maps) : [];
    const translatedOriginalMaps = formState.originalMaps ? await translateMapDescriptions(formState.originalMaps) : [];
    setFormState({
      ...formState,
      content: translatedContent,
      maps: translatedMaps,
      originalMaps: translatedOriginalMaps,
    });
  };

  const handleMapInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMaps = [...(formState.maps || [])];
    if (updatedMaps[index]) {
      updatedMaps[index][name] = value;
      setFormState((prev) => ({ ...prev, maps: updatedMaps }));
    }
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
      maps: [...(prev.maps || []), { latitude: "", longitude: "", mapdescription: "" }]
    }));
  };

  const removeMap = (index) => {
    const updatedMaps = formState.maps.filter((_, i) => i !== index);
    setFormState((prev) => ({ ...prev, maps: updatedMaps }));
  };

  const handleCreateVersion = async (e) => {
    e.preventDefault();

    let maps = [...(formState.maps || [])].map((map) => ({
      location: {
        latitude: parseFloat(map.latitude),
        longitude: parseFloat(map.longitude),
      },
      description: map.mapdescription,
    }));

    let combinedMaps = [...(maps || []), ...(formState.originalMaps || [])];

    const updatedVersion = {
      content: formState.content,
      editor: user.email,
      editDate: new Date().toISOString(),
      attachments: formState.attachments,
      maps: combinedMaps,
      attachments: formState.attachments.map((attachment) => ({
        type: attachment.type,
        url: attachment.url,
        file_name: attachment.file_name,
      })),
      reverted: false,
      entry_id: entryId,
    };

    console.log(updatedVersion);

    try {

      const payload = {
        approved: true,
        notifDate: new Date().toISOString(),
        notifType: "ENTRY_CREATION",
        read: false,
        title: "Notificación de creación de entrada de la Wiki Guerra",
        user: redactor,
      };

      const responseNotis = await axios.post(`${url.active_urlBase}/notification/`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(responseNotis)

      const response = await axios.post(
        `${apiEndPoints.api}/entries/${entryId}/versions`, updatedVersion, {
        headers: { "Content-Type": "application/json" },
      });
      setSubmitSuccess(true);
      setSubmitError(null);
      setFormState((prevState) => ({
        ...prevState,
        originalMaps: combinedMaps,
        maps: [],
      }));
    } catch (err) {
      setSubmitSuccess(false);
      setSubmitError("Ocurrió un error al crear la versión." + err);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const { selectionStart, selectionEnd } = event.target;

      if (event.shiftKey) {
        const contentBeforeCursor = formState.content.substring(0, selectionStart);
        const contentAfterCursor = formState.content.substring(selectionEnd);

        //Si había un tabulador lo elimina
        if (contentBeforeCursor.endsWith("\t")) {
          const updatedContent =
            contentBeforeCursor.slice(0, -1) + contentAfterCursor;

          setFormState((prevState) => ({
            ...prevState,
            content: updatedContent,
          }));

          // Ajusta la posición del cursor después de eliminar el tab
          requestAnimationFrame(() => {
            event.target.selectionStart = event.target.selectionEnd = selectionStart - 1;
          });
        }
      } else {

        // Inserta un tab en la posición actual
        const updatedContent =
          formState.content.substring(0, selectionStart) +
          "\t" +
          formState.content.substring(selectionEnd);

        setFormState((prevState) => ({
          ...prevState,
          content: updatedContent,
        }));

        // Ajusta la posición del cursor después del tab
        requestAnimationFrame(() => {
          event.target.selectionStart = event.target.selectionEnd = selectionStart + 1;
        }, 0);

      }
    }
  };



  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="min-h-screen bg-gray-100 text-black">
          <Navbar/>
          <div className="p-5 w-full sm:w-5/6 md:w-5/6 lg:w-4/6 mx-auto rounded-lg shadow-2xl bg-white">
            <ArrowBackIcon className="hover:cursor-pointer" onClick={handleBack}/>
            <form onSubmit={handleCreateVersion} className="my-4">
              <div className="p-4 rounded-lg border-gray-300 border-2 hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-bold mb-4">Crear Nueva Versión</h2>
                <div className="mb-2">
                  <FormTextInput name={"editor"} value={formState.editor} label={"Editor"}
                    onChange={handleInputChange} required={true} className={formInputClassName} readOnly={true}/>
                </div>
                <div className="mb-2">
                  <FormTextArea name={"content"} value={formState.content} label={"Contenido"}
                    onChange={handleInputChange} required={true} className={formTextAreaClassName} onKeyDown={handleKeyDown} />
                </div>

                <span className="font-bold" >Mapas</span>
                <MapsViewer maps={formState.originalMaps} setFormState={setFormState}/>

                <span className="font-bold" >Archivos</span>
                <FilesViewer attachments={formState.attachments} setFormState={setFormState}/>

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

                  {(formState.maps || []).map((map, index) => (
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
                      <UploadFile setFormState={setFormState}/>
                    </div>
                  )}

                  <div className="bg-gray-300 w-1/2 my-4 p-4 rounded">
                    <LanguageSelector setTargetLanguage={setTargetLanguage} />
                    <button type="button" className="block bg-green-500 hover:bg-green-700 font-bold mt-2 py-1 px-4 rounded-full text-white"
                     onClick={handleTranslate}>Traducir</button>
                  </div>

                  {submitError && <p className="text-red-500">{submitError}</p>}
                  {submitSuccess && <p className="text-green-500">Versión creada con éxito.</p>}
                </div>
                {(user?.rol === 'EDITOR' || user?.rol === 'ADMIN') && (
                <button type="submit" className="block bg-green-500 mx-auto hover:bg-green-700 font-bold py-1 px-4 rounded-full text-white">
                  Guardar Cambios
                </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default PostVersion;