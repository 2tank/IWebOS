import axios from 'axios';
import apiEndpoint from '../assets/apiEndpoints.json'


function GetInfoWiki(id){
    
    const {data} = axios.get(apiEndpoint.api + '/wikis/id/' + id)
    console.log({data})
    console.log(data)

    const newData = {
        nombre: data.name,
        creador: data.creator,
        descripcion: data.description,
        fecha: data.date
    }

    return newData;
}

export default GetInfoWiki;