import React from 'react';

const FileViewer = ({ fileUrl }) => {
  if (!fileUrl) {
    return <p>No se ha proporcionado una URL de archivo.</p>;
  }

  const fileType = fileUrl.split('.').pop().toLowerCase();

  const renderFilePreview = () => {
    if (fileType.startsWith('jpg') || fileType.startsWith('jpeg') || fileType.startsWith('png') || fileType.startsWith('gif') || fileType.startsWith('bmp') || fileType.startsWith('webp')) {
      return <img src={fileUrl} alt="Vista previa" className="max-w-full h-auto" />;
    }
    
    if (fileType.startsWith('mp4') || fileType.startsWith('mov') || fileType.startsWith('avi') || fileType.startsWith('webm')) {
      return (
        <video controls className="max-w-full h-auto">
          <source src={fileUrl} type={`video/${fileType}`} />
          Tu navegador no soporta el formato de video.
        </video>
      );
    }

    if (fileType.startsWith('pdf')) {
      return (
        <iframe
          src={fileUrl}
          title="Vista previa PDF"
          className="w-full h-96"
          frameBorder="0"
        />
      );
    }

    return (
      <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
        Ver archivo
      </a>
    );
  };

  return (
    <div className="p-4">
      {renderFilePreview()}
    </div>
  );
};

export default FileViewer;
