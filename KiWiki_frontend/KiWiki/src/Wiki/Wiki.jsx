import { useEffect, useState } from 'react';
import { useParams } from "react-router";
import axios from 'axios';
import SearchBar from '../Common/SearchBar.jsx';
import SingleWiki from './SingleWiki.jsx';
import apiEndpoint from '../assets/apiEndpoints.json';
import Navbar from '../Common/NavBar.jsx';

function Wiki(){
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {selectedOption, query} = useParams();
    console.log(selectedOption)
    let urlApi = ''

    useEffect(() =>{

        urlApi = apiEndpoint.api + '/wikis/' + `${selectedOption}/${query}`;
        getData()
    },[query])


    const getData = async() => {
        try{
            const response = await axios.get(urlApi)
            setData(response.data);
        }catch(err){
            setError(err.message);
        }finally{
            setLoading(false);
        }
    };

    return(
            <>
            <Navbar/>
            <section className='w-screen flex items-center justify-center flex-col'>
            {
               data != null &&  data.map(item => (
                        <SingleWiki key={item._id} item={item}></SingleWiki>
                    ))
            }

            </section>
            </>
            
    )
}

export default Wiki