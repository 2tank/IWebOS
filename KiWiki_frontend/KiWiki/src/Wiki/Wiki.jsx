import { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';



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
            <section className='w-screen min-h-screen bg-gray-100 relative'>
            
                <Navbar/>
                <section className='flex flex-grow items-center justify-center flex-col p-5 w-4/6 mx-auto'>
                    {
                    data != null &&  data.map(item => (
                                <SingleWiki key={item._id} item={item}></SingleWiki>
                            ))
                    }
                </section>
            
                <Link className='w-16 h-16 m-16 fixed bottom-0 right-0' to='/wikis/create'>
                
                    <AddCircleIcon style={{width:'100%', height:'100%'}}fontSize="large" color='success'></AddCircleIcon>
                
                </Link>


            </section>
            </>
            
    )
}

export default Wiki