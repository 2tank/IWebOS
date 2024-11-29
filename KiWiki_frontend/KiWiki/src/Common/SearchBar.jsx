import { useState } from 'react';
import { useNavigate } from "react-router";
import apiEndpoints from '../assets/apiEndpoints.json';
import SearchIcon from '@mui/icons-material/Search';

import typeSearch from '../Common/TypeSearch.json';

function SearchBar(){
    
    const [selectedOption, setSelectedOption] = useState('name');
    const [query, setQuery] = useState('');
    
    const navigate = useNavigate()

    const search = async(event) => {
        if(query.trim() === "") return;

        event.preventDefault();

        navigate('/wikis/'+`${selectedOption}/${query}`)
    }

    const handlerChange = (event) =>{
        const {value} = event.target
        setQuery(value)
    }

    const selectChange = (event) => {
        const {value} = event.target
        console.log(value)
        setSelectedOption(value)
    }

    return (
            <form onSubmit={search} className='h-10 flex flex-row justify-center'>
                <select className='text-black'
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
                    type='text' 
                    value={query}
                    onChange={handlerChange}
                    className='text-2xl border-2 border-black rounded-s-md w-full sm:w-96 text-black'
                ></input>
                <button><SearchIcon fontSize='large'/></button>
            </form>
    );
}

export default SearchBar;