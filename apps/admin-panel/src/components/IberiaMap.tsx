import React, { useEffect, useRef } from "react";

export function IberiaMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Load Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;

    script.onload = () => {
      if (!mapRef.current || typeof window === "undefined") return;

      const L = (window as any).L;

      // Initialize the map centered on Portugal
      const map = L.map(mapRef.current).setView([39.5, -8.5], 5);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Spain Central region (Lime)
      const spainCentralBounds = [
        [38.5, -6.75],
        [42.2, -2],
      ];
      const spainCentralRectangle = L.rectangle(spainCentralBounds, {
        color: "#99cc00",
        weight: 3,
        fillColor: "#99cc00",
        fillOpacity: 0.2,
      }).addTo(map);
      spainCentralRectangle.bindPopup(`
        <strong>Spain Central Region</strong><br>
        Lat: 42.2° to 43.8°<br>
        Lng: -9.3° to -6.75°
      `);

      // North region (Blue)
      const northBounds = [
        [40.5, -9.0],
        [42.2, -6.75],
      ];
      const northRectangle = L.rectangle(northBounds, {
        color: "#0066cc",
        weight: 3,
        fillColor: "#0066cc",
        fillOpacity: 0.2,
      }).addTo(map);
      northRectangle.bindPopup(`
        <strong>North Region</strong><br>
        Lat: 40.5° to 42.2°<br>
        Lng: -9.0° to -6.2°
      `);

      // Galicia (Purple)
      const galicia = [
        [42.2, -9.3],
        [43.8, -6.75],
      ];
      const galiciaRectangle = L.rectangle(galicia, {
        color: "#800080",
        weight: 3,
        fillColor: "#800080",
        fillOpacity: 0.2,
      }).addTo(map);
      galiciaRectangle.bindPopup(`
        <strong>Galicia</strong><br>
        Lat: 42.2° to 43.0°<br>
        Lng: -9.0° to -6.2°
      `);

      // Asturias (Teal)
      const asturias = [
        [42.2, -6.75],
        [43.75, -2.0],
      ];
      const asturiasRectangle = L.rectangle(asturias, {
        color: "#008080",
        weight: 3,
        fillColor: "#008080",
        fillOpacity: 0.2,
      }).addTo(map);
      asturiasRectangle.bindPopup(`
        <strong>Asturias</strong><br>
        Lat: 42.2° to 43.0°<br>
        Lng: -6.2° to -4.5°
      `);

      // Andorra (Pink)
      const eastAsturiasBounds = [
        [40.5, -2.0],
        [43.4, 3.4],
      ];
      const eastAsturiasRectangle = L.rectangle(eastAsturiasBounds, {
        color: "#e75480",
        weight: 3,
        fillColor: "#e75480",
        fillOpacity: 0.2,
      }).addTo(map);
      eastAsturiasRectangle.bindPopup(`
        <strong>Andorra</strong><br>
        Lat: 40.5° to 43.4°<br>
        Lng: -2.0° to 3.4°
      `);

      // Valencia region (Light Blue)
      const valenciaBounds = [
        [36.85, -2.0],
        [40.5, 0.9],
      ];
      const valenciaRectangle = L.rectangle(valenciaBounds, {
        color: "#00bfff",
        weight: 3,
        fillColor: "#00bfff",
        fillOpacity: 0.2,
      }).addTo(map);
      valenciaRectangle.bindPopup(`
        <strong>Valencia</strong><br>
        Lat: 38.4° to 40.5°<br>
        Lng: -2.0° to 3.4°
      `);

      // Center region (Green)
      const centerBounds = [
        [38.4, -9.6],
        [40.5, -6.75],
      ];
      const centerRectangle = L.rectangle(centerBounds, {
        color: "#33aa33",
        weight: 3,
        fillColor: "#33aa33",
        fillOpacity: 0.2,
      }).addTo(map);
      centerRectangle.bindPopup(`
        <strong>Center Region</strong><br>
        Lat: 38.5° to 40.5°<br>
        Lng: -9.5° to -7.0°
      `);

      // South region (Orange)
      const southBounds = [
        [36.95, -9.1],
        [38.4, -6.75],
      ];
      const southRectangle = L.rectangle(southBounds, {
        color: "#ff8800",
        weight: 3,
        fillColor: "#ff8800",
        fillOpacity: 0.2,
      }).addTo(map);
      southRectangle.bindPopup(`
        <strong>South Region</strong><br>
        Lat: 36.8° to 38.5°<br>
        Lng: -9.0° to -8.0°
      `);

      // Andalucia region (Yellow)
      const andaluciaBounds = [
        [36.0, -6.75],
        [38.5, -2.0],
      ];
      const andaluciaRectangle = L.rectangle(andaluciaBounds, {
        color: "#ffe066",
        weight: 3,
        fillColor: "#ffe066",
        fillOpacity: 0.25,
      }).addTo(map);
      andaluciaRectangle.bindPopup(`
        <strong>Andalucia</strong><br>
        Lat: 36.0° to 37.5°<br>
        Lng: -7.5° to -2.0°
      `);

      // Balearic Islands region (Purple Pink)
      const balearicBounds = [
        [38.5, 1.0],
        [40.2, 4.5],
      ];
      const balearicRectangle = L.rectangle(balearicBounds, {
        color: "#c040c0",
        weight: 3,
        fillColor: "#c040c0",
        fillOpacity: 0.25,
      }).addTo(map);
      balearicRectangle.bindPopup(`
        <strong>Balearic Islands</strong><br>
        Lat: 38.5° to 40.2°<br>
        Lng: 1.0° to 4.5°
      `);
    };

    document.head.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Regional Boundaries</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#99cc00" }}></div>
              <span className="font-medium">Spain Central</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              38.5° to 42.2°, -6.75° to -2.0°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#800080" }}></div>
              <span className="font-medium">Galicia</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              42.2° to 43.8°, -9.3° to -6.75°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#008080" }}></div>
              <span className="font-medium">Asturias</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              42.2° to 43.75°, -6.75° to -2.0°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#e75480" }}></div>
              <span className="font-medium">Andorra</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              40.5° to 43.4°, -2.0° to 3.4°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#00bfff" }}></div>
              <span className="font-medium">Valencia</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              36.85° to 40.5°, -2.0° to 0.9°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#c040c0" }}></div>
              <span className="font-medium">Balearic Islands</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              38.5° to 40.2°, 1.0° to 4.5°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#0066cc" }}></div>
              <span className="font-medium">North</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              40.5° to 42.2°, -9.0° to -6.75°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#33aa33" }}></div>
              <span className="font-medium">Center</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              38.4° to 40.5°, -9.6° to -6.75°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#ff8800" }}></div>
              <span className="font-medium">South</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              36.95° to 38.4°, -9.1° to -6.75°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#ffe066" }}></div>
              <span className="font-medium">Andalucia</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              36.0° to 38.5°, -6.75° to -2.0°
            </div>
          </div>
        </div>
      </div>
      <div
        ref={mapRef}
        className="w-full h-[600px] rounded-lg border-2 border-gray-200"
      />
    </div>
  );
}
