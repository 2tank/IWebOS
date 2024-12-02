import { useState } from 'react';
import FormNumberInput from '../Common/FormNumberInput';
import FormTextInput from '../Common/FormTextInput';
import TuneIcon from '@mui/icons-material/Tune';

function VersionFilter({handleFilterVersion}){

    const [showFilter,setShowFilter] = useState(false);

    const [formState,setFormState] = useState({
        year: "",
        month: "",
        day: "",
        editor: "",
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
        <>
        <TuneIcon className='hover:bg-gray-300 hover:cursor-pointer rounded-lg' onClick={() => setShowFilter(!showFilter)}/>
        {showFilter && (
            <form onSubmit={handleFilterVersion}>
                <div className='flex gap-2 mt-4 mb-2'>
                    <FormNumberInput name={"year"} value={formState.year} label={"Año: "}
                    onChange={handleInputChange} required={formState.month != "" || formState.day!= "" ? true : false} className={"bg-gray-300 rounded w-14"} max={new Date().getFullYear()} min={1900}/>
                    <FormNumberInput name={"month"} value={formState.month} label={"Mes: "}
                    onChange={handleInputChange} required={formState.day != "" ? true : false} className={"bg-gray-300 rounded w-10 text-black"} max={12} min={1}/>
                    <FormNumberInput name={"day"} value={formState.day} label={"Dia: "}
                    onChange={handleInputChange} required={false} className={"bg-gray-300 rounded w-10 text-black"} max={getMaxDay(formState.year,formState.month)} min={1}/>
                    <FormTextInput name={"editor"} value={formState.editor} label={"Editor: "}
                    onChange={handleInputChange} required={false} className={"bg-gray-300 rounded text-black"}/>
                </div>
                <button type='submit' className='bg-green-500 hover:bg-green-700 text-white font-bold py-1 mt-3 px-4 rounded-full' >Filtrar</button>
            </form>
        )}
        </>
    );
}

export default VersionFilter;