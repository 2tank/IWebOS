import {useState } from "react";
import axios from "axios";
import FormInput from "../Common/FormInput";
import FormTextArea from "../Common/FormTextArea"
import AddLocationIcon from '@mui/icons-material/AddLocation';
import CancelIcon from '@mui/icons-material/Cancel';

function PostVersion({editor,content,maps,entryID}){

    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const formInputClassName = "block w-full resize-y p-2 text-black break-words bg-gray-300";
    const [showAddMap,setShowAddMap] = useState(false);


    // Inicializamos datos formulario
    const [formState, setFormState] = useState({
        editor: editor.toString(),
        content: content.toString(),
        longitude: "",
        latitude: "",
        mapdescription: "",
    });

    // Manejo del cambio en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    // Envío del formulario para crear una nueva entrada
    const handleCreateVersion = async (e) => {
        e.preventDefault();

        const latitude = parseFloat(formState.latitude);
        const longitude = parseFloat(formState.longitude);

        let map = {};
        let updatedMaps = maps;


        if (!isNaN(latitude) && !isNaN(longitude) && formState.latitude !== "" && formState.longitude !== "") {

            map = {
                location: {
                    latitude: latitude,
                    longitude: longitude,
                },
                description: formState.mapdescription,
            };

            updatedMaps = [...maps, map];
        }
        // Actualiza creationDate con la fecha y hora actual



        const updatedVersion = {
            ...formState,
            editDate: new Date().toISOString(),
            attachments: [],
            links: [],
            maps: updatedMaps,
            reverted: false,
            entry_id: entryID.toString(),
        };

        console.log(maps);

        try {
        const response = await axios.post("http://localhost:8000/entries/" + entryID.toString() + "/versions", updatedVersion, {
            headers: { "Content-Type": "application/json" },
        });
        setSubmitSuccess(true); // Marca el éxito
        setSubmitError(null); // Limpia errores previos
        setFormState({
            editor: "",
            content: "",
            latitude: "",
            longitude: "",
            mapdescription: "",
        }); // Resetea el formulario
        } catch (err) {
        setSubmitSuccess(false); // Marca fallo
        if (err.response?.status === 422) {
            setSubmitError("La entrada tiene un formato inválido. Por favor, revisa los datos." + err);
        } else if (err.response?.status === 500) {
            setSubmitError("Hubo un error en el servidor. Intenta nuevamente más tarde." + err);
        } else {
            setSubmitError("Ocurrió un error desconocido." + err);
        }
        }
    };

    return (
        <>
        <form onSubmit={handleCreateVersion} className="my-4">
        <div className="p-4 rounded-lg border-gray-300 border-2 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Version</h2>
            <div className="mb-2">
                <FormInput id={"editor"} name={"editor"} value={formState.editor} label={"Editor"}
                onChange={handleInputChange} required={true} className={formInputClassName}/>
            </div>
            <div className="mb-2">
                <FormTextArea id={"content"} name={"content"} value={formState.content} label={"Contenido"}
                onChange={handleInputChange} required={true} className={formInputClassName}/>
            </div>



            <div className="flex flex-col items-left mb-4">
                <button type="button" onClick={() => setShowAddMap(!showAddMap)}>
                    {showAddMap ?
                    <CancelIcon fontSize="large" className="cursor-pointer" /> :
                    <AddLocationIcon fontSize="large" className="cursor-pointer"/>}
                </button>

                { showAddMap && (
                    <div name="divAddMapa">
                        <div className="flex gap-4">
                            <div className="mb-2">
                                <FormInput id={"longitude"} name={"longitude"} value={formState.longitude} label={"Longitud"}
                                onChange={handleInputChange} required={false} className={formInputClassName}/>
                            </div>
                            <div className="mb-2">
                                <FormInput id={"latitude"} name={"latitude"} value={formState.latitude} label={"Latitud"}
                                onChange={handleInputChange} required={false} className={formInputClassName}/>
                            </div>
                        </div>
                        <div className="mb-2">
                            <FormTextArea id={"mapdescription"} name={"mapdescription"} value={formState.mapdescription } label={"Descripcion"}
                            onChange={handleInputChange} required={false} className={formInputClassName}/>
                        </div>
                    </div>)
                }

                {submitError && <p className="text-red-500">{submitError}</p>}
                {submitSuccess && <p className="text-green-500">Entrada creada con éxito.</p>}
                <button type="submit" className="bg-green-500 hover:bg-green-700 font-bold py-1 px-4 rounded-full text-white">
                Crear Version
                </button>
            </div>
        </div>
        </form>
        </>
    );
}

export default PostVersion;