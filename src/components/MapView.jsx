import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';

// Create a custom marker icon using a simple SVG to avoid Vite default icon issues
const customMarker = new L.DivIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#141414" viewBox="0 0 256 256"><path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"></path></svg>`,
  className: 'custom-map-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Component to dynamically update map center
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ center = [-9.43869006941101, 147.1810054779053], zoom = 13, markers = [], className = "w-full h-full z-0 relative" }) {
  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <ChangeView center={center} zoom={zoom} />
        
        {/* Render singular center marker if no markers are provided */}
        {markers.length === 0 && center && (
          <Marker position={center} icon={customMarker} />
        )}
        
        {/* Render provided markers */}
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position} icon={customMarker}>
            {marker.popup && <Popup>{marker.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
