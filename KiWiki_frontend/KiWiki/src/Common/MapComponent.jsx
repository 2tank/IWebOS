import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ coordinates }) => {
  // Verifica si hay coordenadas antes de renderizar el mapa
  if (!coordinates || coordinates.length === 0) {
    return <div>No hay coordenadas para mostrar el mapa.</div>;
  }

  const position = [coordinates[0].location.latitude, coordinates[0].location.longitude]; // Usar la primera coordenada

  return (
    <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Mostrar marcador para cada coordenada */}
      {coordinates.map((coord, index) => (
        <Marker key={index} position={[coord.location.latitude, coord.location.longitude]}>
          <Popup>{coord.description}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
