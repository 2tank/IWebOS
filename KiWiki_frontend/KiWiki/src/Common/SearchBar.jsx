
import { useState } from 'react';
import apiEndpoints from '../assets/apiEndpoints.json';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';

function SearchBar(){
    
    const apiEndpoint = apiEndpoints.api;

    const [query, setQuery] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const search = async(event) => {

        event.preventDefault();

        if(query.trim() === "") return;

        try{
            console.log(apiEndpoint)
            const response = await axios.get(apiEndpoint);
            setData(response.data);
            console.log(response);
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    }

    const handlerChange = (event) =>{
        const {value} = event.target;
        setQuery(value);
    }

    return (
            <form onSubmit={search} className='h-10 flex flex-row justify-center'>
                <input 
                    type="text" 
                    value={query}
                    onChange={handlerChange}
                    className='text-2xl border-2 border-black rounded-s-md w-96'
                ></input>
                <button><SearchIcon fontSize='large'/></button>
            </form>
    );
}

export default SearchBar;