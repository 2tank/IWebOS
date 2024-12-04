function FilesViewer({attachments}){
    return (
        <div>
            {attachments.length > 0 ? (
                attachments.map((attachment) => (
                    <div key={attachment.id} className="bg-gray-300 my-4 p-4">
                        <p><strong>Nombre:</strong> {attachment.file_name}</p>
                        <p><strong>Tipo:</strong> .{attachment.type}</p>
                        <p><strong>url:</strong> {attachment.url}</p>
                    </div>
                ))
            ) : (
                <div className="bg-gray-100 my-4 p-4 rounded-lg text-center text-gray-500">
                    No hay archivos asociados.
                </div>  
            )}
        </div>
    );
}

export default FilesViewer;