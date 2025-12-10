import React, { useEffect, useRef } from "react";

export function UKMap() {
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

      // Initialize the map centered on the UK and Ireland
      const map = L.map(mapRef.current).setView([54.0, -4.5], 5);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Scotland region (Purple)
      const scotlandBounds = [
        [55.3, -7.7],
        [58.8, -1.5],
      ];
      const scotlandRectangle = L.rectangle(scotlandBounds, {
        color: "#800080",
        weight: 3,
        fillColor: "#800080",
        fillOpacity: 0.2,
      }).addTo(map);
      scotlandRectangle.bindPopup(`
        <strong>Scotland Region</strong><br>
        Lat: 54.6° to 60.9°<br>
        Lng: -7.7° to 2.0°
      `);

      // Northern Ireland region (Blue)
      const northernIrelandBounds = [
        [54.35, -8.9],
        [55.3, -5.4],
      ];
      const northernIrelandRectangle = L.rectangle(northernIrelandBounds, {
        color: "#0066cc",
        weight: 3,
        fillColor: "#0066cc",
        fillOpacity: 0.2,
      }).addTo(map);
      northernIrelandRectangle.bindPopup(`
        <strong>Northern Ireland Region</strong><br>
        Lat: 54.0° to 55.3°<br>
        Lng: -8.2° to -5.4°
      `);

      // Ireland (Republic of Ireland) (Green)
      const irelandBounds = [
        [51.4, -10.6],
        [54.35, -5.5],
      ];
      const irelandRectangle = L.rectangle(irelandBounds, {
        color: "#00aa44",
        weight: 3,
        fillColor: "#00aa44",
        fillOpacity: 0.2,
      }).addTo(map);
      irelandRectangle.bindPopup(`
        <strong>Ireland</strong><br>
        Lat: 51.4° to 55.4°<br>
        Lng: -10.5° to -6.0°
      `);

      // Wales (Red)
      const walesBounds = [
        [52.2, -5.3],
        [53.6, -2.7],
      ];
      const walesRectangle = L.rectangle(walesBounds, {
        color: "#cc2222",
        weight: 3,
        fillColor: "#cc2222",
        fillOpacity: 0.2,
      }).addTo(map);
      walesRectangle.bindPopup(`
        <strong>Wales</strong><br>
        Lat: 51.4° to 53.4°<br>
        Lng: -5.3° to -2.7°
      `);

      // Isle of Man (Yellow)
      const isleOfManBounds = [
        [54.0, -4.9],
        [54.45, -4.2],
      ];
      const isleOfManRectangle = L.rectangle(isleOfManBounds, {
        color: "#ffcc00",
        weight: 3,
        fillColor: "#ffcc00",
        fillOpacity: 0.2,
      }).addTo(map);
      isleOfManRectangle.bindPopup(`
        <strong>Isle of Man</strong><br>
        Lat: 54.05° to 54.42°<br>
        Lng: -4.8° to -4.3°
      `);

      // Galloway region (Lavender)
      const gallowayBounds = [
        [54.6, -5.4],
        [55.3, -3.7],
      ];
      const gallowayRectangle = L.rectangle(gallowayBounds, {
        color: "#9966cc",
        weight: 3,
        fillColor: "#9966cc",
        fillOpacity: 0.2,
      }).addTo(map);
      gallowayRectangle.bindPopup(`
        <strong>Galloway</strong><br>
        Lat: 54.45° to 55.3°<br>
        Lng: -5.4° to -3.7°
      `);

      // North England (Teal)
      const northEnglandBounds = [
        [53.6, -3.7],
        [55.3, 1.0],
      ];
      const northEnglandRectangle = L.rectangle(northEnglandBounds, {
        color: "#008080",
        weight: 3,
        fillColor: "#008080",
        fillOpacity: 0.2,
      }).addTo(map);
      northEnglandRectangle.bindPopup(`
        <strong>North England</strong><br>
        Lat: 53.4° to 54.6°<br>
        Lng: -3.1° to 2.0°
      `);

      // Midlands region (Lime)
      const midlandsBounds = [
        [52.2, -2.7],
        [53.6, 2.0],
      ];
      const midlandsRectangle = L.rectangle(midlandsBounds, {
        color: "#99cc00",
        weight: 3,
        fillColor: "#99cc00",
        fillOpacity: 0.2,
      }).addTo(map);
      midlandsRectangle.bindPopup(`
        <strong>Midlands</strong><br>
        Lat: 52.2° to 53.4°<br>
        Lng: -2.7° to 2.0°
      `);

      // London & South East region (Pink)
      const londonSouthEastBounds = [
        [50.7, -1.0],
        [52.2, 2.0],
      ];
      const londonSouthEastRectangle = L.rectangle(londonSouthEastBounds, {
        color: "#e75480",
        weight: 3,
        fillColor: "#e75480",
        fillOpacity: 0.2,
      }).addTo(map);
      londonSouthEastRectangle.bindPopup(`
        <strong>London & South East</strong><br>
        Lat: 50.7° to 51.4°<br>
        Lng: -1.0° to 2.0°
      `);

      // South West England region (Orange)
      const southWestBounds = [
        [49.9, -5.75],
        [52.2, -1.0],
      ];
      const southWestRectangle = L.rectangle(southWestBounds, {
        color: "#ff8800",
        weight: 3,
        fillColor: "#ff8800",
        fillOpacity: 0.2,
      }).addTo(map);
      southWestRectangle.bindPopup(`
        <strong>South West England</strong><br>
        Lat: 50.0° to 52.2°<br>
        Lng: -5.7° to -1.0°
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
              <div className="w-4 h-4 rounded" style={{ background: "#800080" }}></div>
              <span className="font-medium">Scotland</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              54.6° to 60.9°, -7.7° to 2.0°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#0066cc" }}></div>
              <span className="font-medium">Northern Ireland</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              54.0° to 55.3°, -8.2° to -5.4°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#00aa44" }}></div>
              <span className="font-medium">Ireland</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              51.4° to 55.4°, -10.5° to -6.0°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#cc2222" }}></div>
              <span className="font-medium">Wales</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              51.4° to 53.4°, -5.3° to -2.7°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#ffcc00" }}></div>
              <span className="font-medium">Isle of Man</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              54.05° to 54.42°, -4.8° to -4.3°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#9966cc" }}></div>
              <span className="font-medium">Galloway</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              54.45° to 55.3°, -5.4° to -3.7°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#008080" }}></div>
              <span className="font-medium">North England</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              53.4° to 54.6°, -3.1° to 2.0°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#99cc00" }}></div>
              <span className="font-medium">Midlands</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              52.2° to 53.4°, -2.7° to 2.0°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#e75480" }}></div>
              <span className="font-medium">London & South East</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              50.7° to 51.4°, -1.0° to 2.0°
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "#ff8800" }}></div>
              <span className="font-medium">South West England</span>
            </div>
            <div className="text-xs text-gray-600 ml-6">
              50.0° to 52.2°, -5.7° to -1.0°
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
