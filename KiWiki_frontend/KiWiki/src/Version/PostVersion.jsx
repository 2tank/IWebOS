import {useEffect, useState } from "react";
import axios from "axios";
import FormInput from "../Common/FormInput";
import FormTextArea from "../Common/FormTextArea"

function PostVersion({entry_id}){

    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const formInputClassName = "block w-full resize-y p-2 text-black break-words";

    // Inicializamos datos formulario
    const [formState, setFormState] = useState({
        editor: "",
        content: "",
    });

    // Manejo del cambio en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    // Envío del formulario para crear una nueva entrada
    const handleCreateVersion = async (e) => {
        e.preventDefault();

        // Actualiza creationDate con la fecha y hora actual
        const updatedVersion = {
            ...formState,
            editDate: new Date().toISOString(),
            attachments: [],
            links: [],
            maps: [],
            reverted: false,
            entry_id: entry_id.toString(),
        };

        try {
        const response = await axios.post("http://localhost:8000/entries/" + entry_id.toString() + "/versions", updatedVersion, {
            headers: { "Content-Type": "application/json" },
        });
        setSubmitSuccess(true); // Marca el éxito
        setSubmitError(null); // Limpia errores previos
        setFormState({
            editor: "",
            content: "",
        }); // Resetea el formulario
        } catch (err) {
        setSubmitSuccess(false); // Marca fallo
        if (err.response?.status === 422) {
            setSubmitError("La entrada tiene un formato inválido. Por favor, revisa los datos." + err);
        } else if (err.response?.status === 500) {
            setSubmitError("Hubo un error en el servidor. Intenta nuevamente más tarde." + err);
        } else {
            setSubmitError("Ocurrió un error desconocido.");
        }
        }
    };

    return (
        <>
        <form onSubmit={handleCreateVersion} className="bg-gray-800 p-4">
        <h2 className="text-white text-lg mb-4">Crear Nueva Version</h2>
        <div className="mb-2">
            <FormInput id={"editor"} name={"editor"} value={formState.editor} label={"Editor"}
            onChange={handleInputChange} required={true} className={formInputClassName}/>
        </div>
        <div className="mb-2">
            <FormTextArea id={"content"} name={"content"} value={formState.content} label={"content"}
            onChange={handleInputChange} required={true} className={formInputClassName}/>
        </div>
        {submitError && <p className="text-red-500">{submitError}</p>}
        {submitSuccess && <p className="text-green-500">Entrada creada con éxito.</p>}
        <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Crear Version
        </button>
        </form>
        </>
    );
}

export default PostVersion;