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
            <div className='w-screen min-h-screen bg-gray-100'>
                <section className='flex flex-grow items-center justify-center flex-col p-5 w-4/6 mx-auto'>
                {
                data != null &&  data.map(item => (
                            <SingleWiki key={item._id} item={item}></SingleWiki>
                        ))
                }
                </section>
            </div>
            </>
            
    )
}

export default Wiki