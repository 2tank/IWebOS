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
    const {selectedOpition, query} = useParams();

    let urlApi = ''    

    useEffect(() =>{

        console.log(selectedOpition);
        console.log(query);
        urlApi = apiEndpoint.api + `${selectedOpition}/${query}`;
        console.log(urlApi);

        const getData = async() => {
            try{
                const response = await axios.get(urlApi);
                setData(response.data);
                console.log(response);
            }catch(err){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        };
        getData();
    },[])

    return(
        <div>
            <Navbar/>
            {/* {Object.entries(data).map(([key, value]) => (

                <ul key=''>
                    <SingleWiki/>
                </ul>
                
            ))
            } */}
               
        </div>
    )
}

export default Wiki