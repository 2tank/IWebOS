import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiEndpoint from '../assets/apiEndpoints.json'
import SingleEntry from './SingleEntry'

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
            <section>
                {
                data != null &&  data.map(item => (
                        <SingleEntry key={item._id} item={item}></SingleEntry>
                    ))
                }
            </section>
        </>
        
    );


}

export default ListEntries;