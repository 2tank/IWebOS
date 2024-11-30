import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const UploadFile = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => handleUpload(acceptedFiles[0]),
  });

  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');  // Asegúrate de tener un "upload preset" en Cloudinary
      formData.append('cloud_name', 'dlj4y9vd3'); // Tu nombre de nube

      // Subir el archivo a Cloudinary
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dlj4y9vd3/upload',
        formData
      );

      // URL del archivo subido
      setFileUrl(response.data.secure_url);
      setLoading(false);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div {...getRootProps()} className="border-dashed border-2 p-4 text-center cursor-pointer">
        <input {...getInputProps()} />
        <p>Arrastra o selecciona un archivo para subir</p>
      </div>
      {loading && <p>Subiendo...</p>}
      {fileUrl && (
        <div className="mt-4">
          <p>Archivo subido correctamente:</p>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            Ver archivo
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
