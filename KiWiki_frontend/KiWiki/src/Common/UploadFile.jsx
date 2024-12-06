import React, { useState } from 'react';
import axios from 'axios';

const UploadFile = ({setFormState}) => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [uploadedUrl,setUploadedUrl] = useState("");

  const handleFileChange = (e) => {
    setError(false);
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(false);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'KiWiki_upload_preset');
    formData.append('cloud_name', 'dlj4y9vd3');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dlj4y9vd3/upload',
        formData
      );
      setLoading(false);
      alert('Archivo subido correctamente');
      console.log('Archivo subido:', response.data);
      //La url del archivo se saca con response.data.url
      console.log(response.data)
      setFormState((prev) => ({
        ...prev,
        attachments: [...prev.attachments, { type: response.data.format, url: response.data.url, file_name: response.data.display_name }]
      }));
      setUploadedUrl(response.data.url)
      setFileUrl(null);
      setFile(null);
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Subir un archivo a la versión</h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="border p-2 mb-4"
      />
      <br/>

      {file && !loading && (
        <div className="mt-4">
          <p><strong>Vista previa:</strong></p>
          {file.type.startsWith('image/') ? (
            <img src={fileUrl} alt="Vista previa" className="max-w-xs" />
          ) : (
            <p>Archivo seleccionado: {file.name}</p>
          )}

          <button
            onClick={handleUpload}
            className="mt-2 bg-green-500 text-white py-2 px-4 rounded"
          >
            Subir
          </button>
        </div>
      )}
      {loading && <p className="mt-4">Subiendo...</p>}
      {error && <p className='mt-4'>Error en la subida del archivo</p>}
    </div>
  );
};

export default UploadFile;
