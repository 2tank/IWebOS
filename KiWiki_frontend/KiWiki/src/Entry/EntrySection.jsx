import { useEffect, useState } from "react";
import axios from "axios";
import CommentarySection from "../Commentary/CommentarySection";
import SingleVersionSection from "../Version/SingleVersionSection";
import VersionHistory from "../Version/VersionHistory";
import PostEntry from "./PostEntry";
import PostVersion from "../Version/PostVersion";

function EntrySection() {
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showHistory, setShowHistory] = useState(false);
  const [entryCreator, setEntryCreator] = useState(false); 
  const [versionCreator, setVersionCreator] = useState(false);


  // Fetch data for the entry
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/entries/672f28bc819eda2c0728fab4");
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
      <h1 className='flex justify-center text-black bg-yellow-300'>PLACEHOLDER DEL FRONT DE ENTRY</h1>
      <div className="flex justify-center mt-2 mb-2 gap-3">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Ocultar Historial" : "Ver Historial"}
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setEntryCreator(!entryCreator)}>
          {entryCreator ? "Cancelar" : "Añadir Entrada"}
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setVersionCreator(!versionCreator)}>
          {versionCreator ? "Cancelar" : "Añadir Version"}
        </button>
      </div>

      {entryCreator && <PostEntry/>}

      {versionCreator && <PostVersion entry_id={data._id}/>}

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
