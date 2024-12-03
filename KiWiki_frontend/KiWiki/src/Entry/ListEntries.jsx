import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiEndpoint from '../assets/apiEndpoints.json'
import SingleEntry from './SingleEntry'
import Navbar from '../Common/NavBar'
import EntryFilter from "./EntryFilter";

import axios from "axios";

function ListEntries(){

    const location = useLocation()
    const {id, name} = location.state || {}

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    let urlApi = ''

    useEffect(() => {

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


    const handleFilterEntry = async(e) => {
        e.preventDefault();

        const year = e.target.year.value;
        const month = e.target.month.value;
        const day = e.target.day.value;
        const description = e.target.description.value;

        let filterURL = `http://localhost:8000/entries/?wiki=${id}`;

        if(year){
            filterURL += `&year=${year}`;
        }
        if(month){
            filterURL += `&month=${month}`;
        }
        if(day){
            filterURL += `&day=${day}`;
        }
        if(description){
            filterURL += `&description=${description}`;
        }

        // Usar axios para obtener los datos filtrados
        try {
            const response = await axios.get(filterURL);
            setData(response.data);
        } catch (err) {
            setError(err.message);
        }
    };


    return(
        <>
            <Navbar/>

            <div className='w-screen min-h-screen bg-gray-100'>
            <div className='flex justify-center pt-4'>
                    <EntryFilter handleFilterEntry={handleFilterEntry} />
            </div>

            <section className='flex flex-grow items-center justify-center flex-col p-5 w-4/6 mx-auto'>
                <h1 className='w-full text-left text-2xl font-bold'>Listado de entradas de {name} </h1>
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