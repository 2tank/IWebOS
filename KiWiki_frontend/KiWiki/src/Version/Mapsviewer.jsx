function MapsViewer({ maps }) {
    return (
        <div>
            {maps.length > 0 ? (
                maps.map((map) => (
                    <div key={map.id} className="bg-gray-300 my-4 p-4">
                         <p><strong>Latitud:</strong> {map.location?.latitude || "A rellenar"}</p>
                        <p><strong>Longitud:</strong> {map.location?.longitude || "A rellenar"}</p>
                        <p><strong>Descripcion:</strong> {map.description || "A rellenar"}</p>
                    </div>
                ))
            ) : (
                <div className="bg-gray-100 my-4 p-4 rounded-lg text-center text-gray-500">
                    No hay mapas asociados.
                </div>
            )}
        </div>
    );
}

export default MapsViewer;