'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useOracleStore } from '@/store/useOracleStore';
import { LayerControl } from './LayerControl';

// Fix Leaflet marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function LeafletMapInner() {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapCenter, mapZoom, setMapCenter, setLocation, location } = useOracleStore();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: true
    }).setView(mapCenter, mapZoom);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    map.on('moveend', () => {
      const center = map.getCenter();
      setMapCenter([center.lat, center.lng], map.getZoom());
    });

    map.on('click', async (e) => {
       const { lat, lng } = e.latlng;
       console.log("Map Click registered:", lat, lng);
       const { reverseGeocode } = await import('@/lib/data/nominatim');
       const loc = await reverseGeocode(lat, lng);
       if (loc) {
         setLocation(loc);
       }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map view when store center changes (e.g. from search)
  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.flyTo([location.lat, location.lon], 14, { animate: true, duration: 1.5 });
    }
  }, [location]);

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      <LayerControl />
      {!location && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[400]">
          <div className="font-display text-4xl text-text-dim/20 tracking-[0.2em] text-center select-none">
            CLICK ANYWHERE ON THE MAP<br/>OR SEARCH AN ADDRESS ABOVE
          </div>
        </div>
      )}
    </div>
  );
}
