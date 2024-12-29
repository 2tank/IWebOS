import { useEffect, useState } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from 'axios';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { format, parse } from "@formkit/tempo"
import { useSession } from '../Common/SessionProvider'


import SingleWiki from './SingleWiki.jsx';
import apiEndpoint from '../assets/apiEndpoints.json';
import Navbar from '../Common/NavBar.jsx';

function Wiki(){

    const { user } = useSession();


    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {selectedOption, query, dateOption} = useParams();
    let urlApi = ''

    useEffect(() =>{
        if(dateOption == undefined){
            urlApi = apiEndpoint.api + '/wikis/' + `${selectedOption}/${query}`;
        }else{
            urlApi = apiEndpoint.api + '/wikis/get_by_date/';
        }
        getData()
    },[query, dateOption])


    const getData = async() => {
        try{
            if(dateOption == undefined){
                const response = await axios.get(urlApi)
                setData(response.data);
            }else{

                const dataDate = {
                    content: format(query, 'DD/MM/YYYY'),
                    condition: dateOption
                }
                const response = await axios.post(urlApi, dataDate)
                setData(response.data)

            }
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
                        <h1 className='w-full text-left text-2xl font-bold'>Listado de wikis:</h1>
                    {
                    data != null &&  data.map(item => (
                                <SingleWiki key={item._id} item={item}></SingleWiki>
                            ))
                    }
                </section>

                {((user?.rol === 'ADMIN') || (user?.rol === 'EDITOR'))&& (
                <Link className='w-16 h-16 m-16 fixed bottom-0 right-0' to='/wikis/create'>
                    <AddCircleIcon style={{width:'100%', height:'100%'}}fontSize="large" color='success'></AddCircleIcon>
                </Link>
                )}

            </section>
            </>

    )
}

export default Wiki