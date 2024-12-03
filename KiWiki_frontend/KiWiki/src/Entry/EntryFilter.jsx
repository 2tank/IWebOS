import { useState } from 'react';
import FormNumberInput from '../Common/FormNumberInput';
import FormTextInput from '../Common/FormTextInput';
import TuneIcon from '@mui/icons-material/Tune';

function EntryFilter({handleFilterEntry}){

    const [showFilter,setShowFilter] = useState(false);

    const [formState,setFormState] = useState({
        year: "",
        month: "",
        day: "",
        description: "",
    });

    // Manejo del cambio en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const getMaxDay = (year,month) => {
        if(!year || !month) return 31;
        return new Date(year,month,0).getDate();
    };

    return(
        <div className='flex bg-white shadow-md rounded-lg p-4 m-4 hover:shadow-xl transition-shadow duration-300'>
            <form onSubmit={handleFilterEntry} className='flex items-center gap-4'>
                <div className='flex gap-2'>
                    <FormNumberInput name={"year"} value={formState.year} label={"Año: "}
                    onChange={handleInputChange} required={formState.month != "" || formState.day!= "" ? true : false} className={"bg-gray-300 rounded w-14"} max={new Date().getFullYear()} min={1900}/>
                    <FormNumberInput name={"month"} value={formState.month} label={"Mes: "}
                    onChange={handleInputChange} required={formState.day != "" ? true : false} className={"bg-gray-300 rounded w-10 text-black"} max={12} min={1}/>
                    <FormNumberInput name={"day"} value={formState.day} label={"Dia: "}
                    onChange={handleInputChange} required={false} className={"bg-gray-300 rounded w-10 text-black"} max={getMaxDay(formState.year,formState.month)} min={1}/>
                    <FormTextInput name={"description"} value={formState.description} label={"Descripcion: "}
                    onChange={handleInputChange} required={false} className={"bg-gray-300 rounded text-black"}/>
                </div>
                <button type='submit' className='bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 rounded-full' >Filtrar</button>
            </form>
        </div>
    );
}

export default EntryFilter;