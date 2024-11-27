import { useEffect, useState } from "react";
import axios from "axios";
import CommentarySection from "../Commentary/CommentarySection";
import SingleVersionSection from "./SingleVersionSection";
import VersionHistory from "./VersionHistory";
import PostEntry from "./PostEntry";

function EntrySection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [entryCreator, setEntryCreator] = useState(false);

  // Fetch data for the entry
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/entries/67262c619313373162bacec9");
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
  if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;

  return (
    <div className='flex flex-wrap flex-col bg-black text-white'>
      <h1 className='flex justify-center'>PLACEHOLDER DEL FRONT DE ENTRY (todo este cuadrado negro)</h1>
      <button className="flex justify-end mr-5" onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? "Ocultar Historial" : "Ver Historial"}
      </button>
      <button className="flex justify-end mr-5" onClick={() => setEntryCreator(!entryCreator)}>
        {entryCreator ? "Cancelar" : "Añadir Entrada"}
      </button>

      {/* Formulario de creación de entrada */}
      {entryCreator && <PostEntry/>}

      {showHistory ? (
        <VersionHistory entryID={data._id} />
      ) : (
        <div>
          <h2>Data entrada test:</h2>
          <ul>
            <li>ID: {data._id}</li>
            <li>Título: {data.title}</li>
            <li>Creador: {data.creator}</li>
            <li>Fecha de creación: {data.creationDate}</li>
            <li>Descripción: {data.description}</li>
            <li>Version ID: {data.actual_version}</li>
          </ul>
          <div className="flex flex-wrap justify-center bg-yellow-300 text-black">
            <h1>Componente de versión comienza debajo</h1>
          </div>
          <SingleVersionSection entryVersionID={data.actual_version} />
          <div className="flex flex-wrap justify-center bg-yellow-300 text-black">
            <h1>Componente de comentarios comienza debajo</h1>
          </div>
          <CommentarySection entryID={data._id} entryVersionID={data.actual_version} />
        </div>
      )}
    </div>
  );
}

export default EntrySection;
