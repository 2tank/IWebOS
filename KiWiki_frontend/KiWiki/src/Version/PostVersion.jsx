import { useState } from "react";
import axios from "axios";
import FormTextInput from "../Common/FormTextInput";
import FormTextArea from "../Common/FormTextArea";
import UploadFile from "../Common/UploadFile";

import AddLocationIcon from '@mui/icons-material/AddLocationAlt';
import CancelLocationIcon from '@mui/icons-material/Cancel';
import AddPhotoIcon from '@mui/icons-material/AddPhotoAlternate';
import CancelImageIcon from '@mui/icons-material/HideImage';

function PostVersion({ editor, content, maps, entryID }) {
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const formInputClassName = "block w-full resize-y p-2 text-black break-words bg-gray-300";
  const [showAddImage, setShowAddImage] = useState(false);
  const [buttonClass, setButtonClass] = useState("");

  const [formState, setFormState] = useState({
    editor: editor.toString(),
    content: content.toString(),
    maps: [],
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMaps = [...formState.maps];
    updatedMaps[index][name] = value;
    setFormState((prev) => ({ ...prev, maps: updatedMaps }));
  };

  const addNewMap = () => {

    // le he añadido una animacion al add map para que no parezca que no hace nada
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
        entry_id: entryID.toString(),
      };


    try {
      const response = await axios.post(
        `http://localhost:8000/entries/${entryID.toString()}/versions`, updatedVersion, {
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
      <form onSubmit={handleCreateVersion} className="my-4">
        <div className="p-4 rounded-lg border-gray-300 border-2 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-bold mb-4">Crear Nueva Versión</h2>
          <div className="mb-2">
            <FormTextInput name={"editor"} value={formState.editor} label={"Editor"}
              onChange={(e) => handleInputChange(e)} required={true} className={formInputClassName} />
          </div>
          <div className="mb-2">
            <FormTextArea name={"content"} value={formState.content} label={"Contenido"}
              onChange={(e) => handleInputChange(e)} required={true} className={formInputClassName} />
          </div>

          <div className="flex flex-col items-left mb-4">
            <div>
                    <button type="button" onClick={addNewMap} className="mb-4">

                    <AddLocationIcon fontSize="large" className={`cursor-pointer ${buttonClass}`} />
                    </button>

                    <button type="button" onClick={() => setShowAddImage(!showAddImage)}>
                        {showAddImage ?
                        <CancelImageIcon fontSize="large" className="cursor-pointer" /> :
                        <AddPhotoIcon fontSize="large" className="cursor-pointer"/>}
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
                      onChange={(e) => handleInputChange(e, index)} required={false} className={formInputClassName} />
                  </div>
                  <div className="mb-2">
                    <FormTextInput name={"latitude"} value={map.latitude} label={"Latitud"}
                      onChange={(e) => handleInputChange(e, index)} required={false} className={formInputClassName} />
                  </div>
                </div>
                <div className="mb-2">
                  <FormTextArea name={"mapdescription"} value={map.mapdescription} label={"Descripción"}
                    onChange={(e) => handleInputChange(e, index)} required={false} className={formInputClassName} />
                </div>
              </div>
            ))}

            { showAddImage && (
                <div>
                    <UploadFile/>
                </div>
                )
            }

            {submitError && <p className="text-red-500">{submitError}</p>}
            {submitSuccess && <p className="text-green-500">Entrada creada con éxito.</p>}
          </div>
          <button type="submit" className="block bg-green-500 mx-auto hover:bg-green-700 font-bold py-1 px-4 rounded-full text-white">
            Crear Versión
          </button>
        </div>
      </form>
    </>
  );
}

export default PostVersion;
