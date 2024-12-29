import DeleteIcon from '@mui/icons-material/Delete';

function MapsViewer({ maps, setFormState }) {

    const handleDelete = (indexToRemove) => {
        setFormState((prevState) => ({
            ...prevState,
            originalMaps: prevState.originalMaps.filter((_, index) => index !== indexToRemove),
        }));
    };    

    return (
        <div>
            {maps.length > 0 ? (
                maps.map((map,index) => (
                    <div key={index} className="bg-gray-300 w-2/4 rounded my-4 p-4">
                        <div className='flex justify-between'>
                            <div className='w-5/6'>
                                <p><strong>Latitud:</strong> {map.location?.latitude || "A rellenar"}</p>
                                <p><strong>Longitud:</strong> {map.location?.longitude || "A rellenar"}</p>
                                <p><strong>Descripcion:</strong> {map.description || "A rellenar"}</p>
                            </div>
                            <div onClick={() => handleDelete(index)}>
                                <DeleteIcon className='hover:cursor-pointer mt-10' color='error' fontSize='large'></DeleteIcon>  
                            </div>
                        </div>
                    </div>  
                ))
            ) : (
                <div className="bg-gray-200 my-4 p-4 rounded-lg text-center text-gray-500">
                    No hay mapas asociados.
                </div>
            )}
        </div>
    );
}

export default MapsViewer;