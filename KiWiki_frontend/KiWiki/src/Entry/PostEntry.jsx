import { useState } from "react";
import axios from "axios";

function PostEntry() {

const [newEntry, setNewEntry] = useState({
    title: "",
    creator: "",
    description: "",
    tags: [],
    wiki: "",
    creationDate: "",
    actual_version: "",
    });

  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Manejo del cambio en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({ ...prev, [name]: value }));
  };

  // Envío del formulario para crear una nueva entrada
  const handleCreateEntry = async (e) => {
    e.preventDefault();

    // Actualiza creationDate con la fecha y hora actual
     const updatedEntry = {
         ...newEntry,
         creationDate: new Date().toISOString(),
     };

    try {
      const response = await axios.post("http://localhost:8000/entries", updatedEntry, {
        headers: { "Content-Type": "application/json" },
      });
      setSubmitSuccess(true); // Marca el éxito
      setSubmitError(null); // Limpia errores previos
      setNewEntry({
        title: "",
        creator: "",
        description: "",
        tags: [],
        wiki: "",
      }); // Resetea el formulario
      console.log("Entrada creada:", response.data);
    } catch (err) {
      setSubmitSuccess(false); // Marca fallo
      if (err.response?.status === 422) {
        setSubmitError("La entrada tiene un formato inválido. Por favor, revisa los datos.");
      } else if (err.response?.status === 500) {
        setSubmitError("Hubo un error en el servidor. Intenta nuevamente más tarde.");
      } else {
        setSubmitError("Ocurrió un error desconocido.");
      }

      console.error("Error al crear la entrada:", err);
    }
  };

  return (
    <form onSubmit={handleCreateEntry} className="bg-gray-800 p-4">
      <h2 className="text-white text-lg mb-4">Crear Nueva Entrada</h2>
      <div className="mb-2">
        <label htmlFor="title" className="text-white">Título</label>
        <input
          id="title"
          name="title"
          type="text"
          value={newEntry.title}
          onChange={handleInputChange}
          required
          className="block w-full p-2 text-black"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="creator" className="text-white">Creador</label>
        <input
          id="creator"
          name="creator"
          type="text"
          value={newEntry.creator}
          onChange={handleInputChange}
          required
          className="block w-full p-2 text-black"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="description" className="text-white">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={newEntry.description}
          onChange={handleInputChange}
          required
          className="block w-full p-2 text-black"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="tags" className="text-white">Tags (separados por comas)</label>
        <input
          id="tags"
          name="tags"
          type="text"
          value={newEntry.tags.join(", ")}
          onChange={(e) =>
            setNewEntry((prev) => ({
              ...prev,
              tags: e.target.value.split(",").map((tag) => tag.trim()),
            }))
          }
          className="block w-full p-2 text-black"
        />
      </div>
      <div className="mb-2">
        <label htmlFor="wiki" className="text-white">Wiki (opcional)</label>
        <input
          id="wiki"
          name="wiki"
          type="text"
          value={newEntry.wiki}
          onChange={handleInputChange}
          className="block w-full p-2 text-black"
        />
      </div>
      {submitError && <p className="text-red-500">{submitError}</p>}
      {submitSuccess && <p className="text-green-500">Entrada creada con éxito.</p>}
      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        Crear Entrada
      </button>
    </form>
  );
}

export default PostEntry;
