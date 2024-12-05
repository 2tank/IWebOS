import { useState } from 'react';
import { useNavigate } from "react-router";
import apiEndpoints from '../assets/apiEndpoints.json';
import SearchIcon from '@mui/icons-material/Search';

import typeSearch from '../Common/TypeSearch.json';

function SearchBar(){
    
    const [selectedOption, setSelectedOption] = useState('name')
    const [query, setQuery] = useState('')
    const [dateInput, setDateInput] = useState(false)
    const [dateOption, setDateOption] = useState('')

    const navigate = useNavigate()

    const search = async(event) => {
        if(query.trim() === "") return;

        event.preventDefault();

        if(dateInput == false){
            navigate('/wikis/'+`${selectedOption}/${query}`)
        }else{
            navigate('/wikis/'+`${selectedOption}/${query}/${dateOption}`)
        }
    }

    const handlerChange = (event) =>{
        const {value} = event.target
        setQuery(value)
    }

    const selectChange = (event) => {
        const {value} = event.target

        value === 'date' ? setDateInput(true) : setDateInput(false)

        setSelectedOption(value)
    }

    const handlerChangeDate = (event) =>{
        const {value} = event.target
        setDateOption(value)
    }

    return (
            <form onSubmit={search} className='h-10 flex flex-col gap-3 justify-center space-x-1'>
                <section className='row'>
                    <select className='text-black h-full'
                    id='selectOption'
                    value={selectedOption}
                    onChange={selectChange}
                    required
                    >
                    {
                        Object.entries(typeSearch).map(([key, value]) =>  (
                            <option key={key} value={value[1]}>
                                {value[0]}
                            </option>
                        ))
                    }
                    </select>
                    <input 
                        type={dateInput ? 'date' : 'text'}
                        value={query}
                        onChange={handlerChange}
                        className='text-2xl border-2 border-black rounded-s-md w-full sm:w-96 text-black'
                    ></input>
                    
                    <button><SearchIcon fontSize='large'/></button>

                </section>
                
                {
                    dateInput == true && (
                    <div className='row'>
                        <input onChange={handlerChangeDate} type='radio' name='option' value='lower'/><label className='mr-3'>Menor</label>
                        <input onChange={handlerChangeDate} type='radio' name='option' value='same'/><label className='mr-3'>Igual</label>
                        <input onChange={handlerChangeDate} type='radio' name='option' value='higher'/><label>Mayor</label>
                    </div>)
                }
            </form>
    );
}

export default SearchBar;