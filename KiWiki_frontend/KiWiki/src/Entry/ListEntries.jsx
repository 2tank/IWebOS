import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiEndpoint from '../assets/apiEndpoints.json'
import SingleEntry from './SingleEntry'
import Navbar from '../Common/NavBar'

import axios from "axios";

function ListEntries(){

    const location = useLocation()
    const {id} = location.state || {} 
      
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    let urlApi = ''

    useEffect(() => {

        console.log("HOLA")
        getData()

    },[id])

    const getData = async() => {
        urlApi = apiEndpoint.api + '/wikis/' + `${id}` + '/entries';
        console.log(urlApi)
        try{
            const response = await axios.get(urlApi)
            console.log(response)
            setData(response.data)
        }catch(err){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    };

    return(
        <>
            <Navbar/>
            <div className='w-screen min-h-screen bg-gray-100'>
            <section className='flex flex-grow items-center justify-center flex-col p-5 w-4/6 mx-auto'>
                {
                data != null &&  data.map(item => (
                        <SingleEntry key={item._id} item={item}></SingleEntry>
                    ))
                }
            </section>
            </div>
        </>
        
    );


}

export default ListEntries;