import axios from 'axios';
import apiEndpoint from '../assets/apiEndpoints.json'


async function GetInfoEntry(id){

    const {data} = await axios.get(apiEndpoint.api + '/entries/' + id)
    const newData = {
        title: data.title,
        creator: data.creator,
        description: data.description,
        tags: data.tags,
        wiki: data.wiki
        
    }
    console.log(data)
    return newData;
}

export default GetInfoEntry;