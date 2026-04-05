import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Create a custom marker icon using a simple SVG to avoid Vite default icon issues
const customMarker = new L.DivIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#141414" viewBox="0 0 256 256"><path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"></path></svg>`,
  className: 'custom-map-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Component to dynamically update map center and bounds
function ChangeView({ center, zoom, route }) {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map, route]);
  return null;
}

function MapEvents({ onMapClick, onMapMove }) {
  useMapEvents({
    click(e) {
      if (onMapClick) onMapClick(e);
    },
    move(e) {
      if (onMapMove) onMapMove(e);
    }
  });
  return null;
}

export default function MapView({ 
  center = [-9.43869006941101, 147.1810054779053], 
  zoom = 13, 
  markers = [], 
  route = null,
  routeMeta = null, // { distance, duration }
  className = "w-full h-full z-0 relative", 
  onMapClick, 
  onMapMove 
}) {
  
  // Find middle point of route for metadata label
  const middlePoint = route && route.length > 0 ? route[Math.floor(route.length / 2)] : null;

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
        <ChangeView center={center} zoom={zoom} route={route} />
        <MapEvents onMapClick={onMapClick} onMapMove={onMapMove} />
        
        {route && (
          <Polyline 
            positions={route} 
            pathOptions={{ color: '#D9483E', weight: 5, opacity: 0.8 }} 
          />
        )}

        {middlePoint && routeMeta && (
          <Marker 
            position={middlePoint} 
            icon={new L.DivIcon({
              html: `
                <div class="bg-white text-[#141414] px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2 whitespace-nowrap text-sm font-bold border-2 border-[#D9483E] animate-fade-in">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#D9483E" viewBox="0 0 256 256">
                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
                  </svg>
                  ${routeMeta.duration} · ${routeMeta.distance}
                </div>
              `,
              className: 'route-meta-label',
              iconSize: [0, 0],
              iconAnchor: [60, 20]
            })}
          />
        )}
        
        {markers.length === 0 && center && !route && (
          <Marker position={center} icon={customMarker} />
        )}
        
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position} icon={customMarker}>
            {marker.popup && <Popup>{marker.popup}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
