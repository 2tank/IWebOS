// Conversor Fecha
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

export const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false, // Si quieres 24 horas. Si prefieres formato de 12 horas, cambia a `true`
    };
  
    return new Date(dateString).toLocaleString(undefined, options);
  };