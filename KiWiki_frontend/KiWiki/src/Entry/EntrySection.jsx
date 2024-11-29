import { useEffect, useState } from "react";
import axios from "axios";
import SingleVersionSection from "../Version/SingleVersionSection";
import VersionHistory from "../Version/VersionHistory";
import Navbar from '../Common/NavBar';
import { formatDate } from "../Common/CommonOperations";
import "../Common/CSS/commonCSS.css";
import CommentaryComponent from "../Commentary/CommentaryComponent";

function EntrySection() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showHistory, setShowHistory] = useState(false);

  // Fetch data for the entry
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/entries/67499b921aa3cdbeefba9e6a");
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateActualVersion = (newVersionID) => {
    setData((prevData) => ({
      ...prevData,
      actual_version: newVersionID,
    }));
  };

  if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
  if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;

  return (
      <div className="min-h-screen flex flex-col bg-gray-100 text-black">
        <Navbar/>
       <div className="flex-grow p-5 w-4/6 mx-auto rounded-lg shadow-2xl bg-white">
          <h1 className="pt-4 text-3xl font-bold">{data.title}</h1>

          <div className="flex justify-end p-2 gap-3">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 mt-3 px-4 rounded-full" onClick={() => setShowHistory(!showHistory)}>
              {showHistory ? "Ocultar Historial" : "Ver Historial"}
            </button>
          </div>

          {showHistory ? (
            <VersionHistory entryID={data._id} onVersionChange={updateActualVersion}/>
          ) : (
            <div>
              <div className="flex gap-3">
                <span className="text-xs">Creado: {formatDate(data.creationDate)}</span><br/>
                <span className="text-xs" >Redactor: {data.creator}</span><br/>
              </div>
              <span className="block text-base text-gray-700">{data.description}</span>
              <hr className="w-1/4 h-1 mx-auto my-4 bg-gray-900 border-0 rounded md:my-10 dark:bg-gray-700"></hr>
              <SingleVersionSection entryVersionID={data.actual_version} entryID={data._id} />
              <CommentaryComponent entryID={data._id} entryVersionID={data.actual_version} />
            </div>
          )}
          </div>
      </div>
  );
}

export default EntrySection;
