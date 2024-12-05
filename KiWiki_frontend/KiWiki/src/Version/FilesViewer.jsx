import DeleteIcon from '@mui/icons-material/Delete';

function FilesViewer({attachments, setFormState}){

    const handleDelete = (indexToRemove) => {
        setFormState((prevState) => ({
            ...prevState,
            attachments: prevState.attachments.filter((_, index) => index !== indexToRemove),
        }));
    };  

    return (
        <div>
            {attachments.length > 0 ? (
                attachments.map((attachment,index) => (
                    <>
                    <div key={index} className="bg-gray-300 w-5/6 rounded my-4 p-4">
                        <div className='flex justify-between'>
                            <div>
                            <p><strong>Nombre:</strong> {attachment.file_name}</p>
                            <p><strong>Tipo:</strong> .{attachment.type}</p>
                            <p><strong>url:</strong> {attachment.url}</p>
                            </div>
                        <div onClick={() => handleDelete(index)}>
                            <DeleteIcon className='hover:cursor-pointer mt-10' color='error' fontSize='large'></DeleteIcon>  
                        </div>
                        </div>  
                    </div>
                    </>
                ))
            ) : (
                <div className="bg-gray-200 my-4 p-4 rounded-lg text-center text-gray-500">
                    No hay archivos asociados.
                </div>  
            )}
        </div>
    );
}

export default FilesViewer;