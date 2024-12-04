import { useState, useEffect } from 'react';
import axios from "axios";
import FormNumberInput from '../Common/FormNumberInput';
import FormTextInput from '../Common/FormTextInput';
import FormCheckBox from '../Common/FormCheckBox'
import TuneIcon from '@mui/icons-material/Tune';

function EntryFilter({formState, setFormState,handleFilterEntry}){

    const [showFilter,setShowFilter] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkBoxClassName = "flex w-fit pr-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-amber-950 " +
    "dark:border-amber-600 dark:text-white";

    // Cargamos los tags de las Entradas nada más cargar la página
    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/entries/?getTags=True");
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        console.log("ENTRO")
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

    const getMaxDay = (year,month) => {
        if(!year || !month) return 31;
        return new Date(year,month,0).getDate();
    };

    if (loading) return <p>Cargando... (ESTO ES UN PLACEHOLDER DE UN COMPONENTE DE CARGA)</p>;
    if (error) return <p>Error: {error} (ESTO ES UN PLACEHOLDER DE UN COMPONENTE ERROR)</p>;    

    return(
        <div className={`w-full pt-4`}>
            <TuneIcon className='hover:bg-gray-300 hover:cursor-pointer rounded-lg' onClick={() => setShowFilter(!showFilter)}/>
            {showFilter && (
            <div className='mb-4 mt-2'>
                <form onSubmit={handleFilterEntry} className='flex flex-col items-center gap-1'>
                    <FormCheckBox label={"Tags: "} className={checkBoxClassName} name={"tags"} data={data} onChange={handleInputChange} selectedElems={formState.tags}/>
                    <div>
                        <FormTextInput name={"description"} value={formState.description} label={"Descripcion: "}
                        onChange={handleInputChange} required={false} className={"bg-gray-300 w-full rounded text-black"}/>
                    </div>
                    <div className='flex gap-2 mb-2'>
                        <FormNumberInput name={"year"} value={formState.year} label={"Año: "}
                        onChange={handleInputChange} required={formState.month != "" || formState.day!= "" ? true : false} className={"bg-gray-300 rounded w-full sm:w-14"} max={new Date().getFullYear()} min={1900}/>
                        <FormNumberInput name={"month"} value={formState.month} label={"Mes: "}
                        onChange={handleInputChange} required={formState.day != "" ? true : false} className={"bg-gray-300 rounded w-full sm:w-14 text-black"} max={12} min={1}/>
                        <FormNumberInput name={"day"} value={formState.day} label={"Dia: "}
                        onChange={handleInputChange} required={false} className={"bg-gray-300 rounded w-full sm:w-14 text-black"} max={getMaxDay(formState.year,formState.month)} min={1}/>
                    </div>
                    <button type='submit' className='bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded-full' >Filtrar</button>
                </form>
            </div>
            )}
        </div>
    );
}

export default EntryFilter;