import React, { useState, useEffect } from 'react';

const MapViewer = ({ location }) => {
    const [viewType, setViewType] = useState(null);
    const mapRef = React.useRef(null);
    const streetViewRef = React.useRef(null);
    const [map, setMap] = useState(null);
    const [mly, setMly] = useState(null);

    // Parse coordinates function (same as before)
    const parseCoordinates = (location) => {
        if (!location || location === "Redacted" || location === "") {
            return null;
        }

        // Handle decimal format (e.g., "49.26911 N, 123.13826 W")
        const decimalMatch = location.match(/([\d.]+)\s*([NS])[,\s]*([\d.]+)\s*([EW])/);
        if (decimalMatch) {
            const [, lat, latDir, lng, lngDir] = decimalMatch;
            return {
                lat: latDir === 'S' ? -parseFloat(lat) : parseFloat(lat),
                lng: lngDir === 'W' ? -parseFloat(lng) : parseFloat(lng)
            };
        }

        // Handle DMS format
        const dmsMatch = location.match(/(\d+)°\s*(\d+)'\s*([\d.]+)"\s*([NS])[,\s]*(\d+)°\s*(\d+)'\s*([\d.]+)"\s*([EW])/);
        if (dmsMatch) {
            const [, latDeg, latMin, latSec, latDir, lngDeg, lngMin, lngSec, lngDir] = dmsMatch;
            const lat = (parseInt(latDeg) + parseInt(latMin) / 60 + parseFloat(latSec) / 3600) * (latDir === 'S' ? -1 : 1);
            const lng = (parseInt(lngDeg) + parseInt(lngMin) / 60 + parseFloat(lngSec) / 3600) * (lngDir === 'W' ? -1 : 1);
            return { lat, lng };
        }

        return null;
    };

    const coords = parseCoordinates(location);
    const isAvailable = coords !== null;

    useEffect(() => {
        // Load required scripts and styles
        const loadDependencies = async () => {
            // Load Leaflet
            if (!window.L) {
                const leafletCSS = document.createElement('link');
                leafletCSS.rel = 'stylesheet';
                leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(leafletCSS);

                const leafletScript = document.createElement('script');
                leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                await new Promise(resolve => {
                    leafletScript.onload = resolve;
                    document.head.appendChild(leafletScript);
                });
            }

            // Load Mapillary
            if (!window.mapillary) {
                const mapillaryScript = document.createElement('script');
                mapillaryScript.src = 'https://unpkg.com/mapillary-js@4.1.0/dist/mapillary.min.js';
                const mapillaryCSS = document.createElement('link');
                mapillaryCSS.rel = 'stylesheet';
                mapillaryCSS.href = 'https://unpkg.com/mapillary-js@4.1.0/dist/mapillary.min.css';
                document.head.appendChild(mapillaryCSS);
                await new Promise(resolve => {
                    mapillaryScript.onload = resolve;
                    document.head.appendChild(mapillaryScript);
                });
            }
        };

        loadDependencies();

        return () => {
            if (map) {
                map.remove();
                setMap(null);
            }
            if (mly) {
                mly.remove();
                setMly(null);
            }
        };
    }, []);

    useEffect(() => {
        if (!isAvailable || !viewType || !window.L) return;

        if (viewType === 'map' && !map) {
            // Initialize map
            const leafletMap = window.L.map(mapRef.current).setView([coords.lat, coords.lng], 17);

            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(leafletMap);

            window.L.marker([coords.lat, coords.lng]).addTo(leafletMap);
            setMap(leafletMap);
        }

        if (viewType === 'street' && !mly && window.mapillary) {
            // Initialize Mapillary viewer
            const mlyViewer = new window.mapillary.Viewer({
                apiClient: 'YOUR_MAPILLARY_API_KEY', // You'll need to get a free API key from Mapillary
                container: streetViewRef.current,
                component: {
                    cover: false,
                    bearing: false,
                }
            });

            mlyViewer.moveTo({
                lat: coords.lat,
                lon: coords.lng,
                zoom: 0
            }).then(() => {
                setMly(mlyViewer);
            });
        }
    }, [viewType, coords, isAvailable, window.mapillary]);

    const toggleView = (type) => {
        if (!isAvailable) return;
        setViewType(viewType === type ? null : type);
    };

    return (
        <div className="flex flex-col">
            <div className="flex gap-2 mb-2">
                {/* Bird Icon for Map View */}
                <button
                    onClick={() => toggleView('map')}
                    className={`w-8 h-8 ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-50'}`}
                    disabled={!isAvailable}
                >
                    <img
                        src="/img/t1.jpg"
                        alt="Map View"
                        className="w-full h-full object-contain"
                    />
                </button>

                {/* Street View Icon */}
                <button
                    onClick={() => toggleView('street')}
                    className={`w-8 h-8 ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-50'}`}
                    disabled={!isAvailable}
                >
                    <img
                        src="/img/t2.jpg"
                        alt="Street View"
                        className="w-full h-full object-contain"
                    />
                </button>
            </div>

            {viewType === 'map' && isAvailable && (
                <div className="border border-black mt-2" style={{ height: '300px' }}>
                    <div ref={mapRef} style={{ height: '100%' }} className="bg-white" />
                </div>
            )}

            {viewType === 'street' && isAvailable && (
                <div className="border border-black mt-2" style={{ height: '300px' }}>
                    <div ref={streetViewRef} style={{ height: '100%' }} className="bg-white" />
                </div>
            )}
        </div>
    );
};

export default MapViewer;