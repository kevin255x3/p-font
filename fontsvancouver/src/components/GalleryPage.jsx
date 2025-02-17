import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ImageData from '../data/ImageData';
import SubmissionModal from './SubmissionModal';

function GalleryPage() {
    const [currentCycle, setCurrentCycle] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [viewType, setViewType] = useState(null); // null, 'map', or 'street'
    const viewerRef = React.useRef(null);
    const [map, setMap] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Cleanup function for viewers
    const cleanupCurrentView = () => {
        if (map) {
            map.remove();
            setMap(null);
        }
        if (viewerRef.current) {
            viewerRef.current.innerHTML = '';
            viewerRef.current.className = 'h-full w-full';
        }
    };

    useEffect(() => {
        const initializeCycle = () => {
            const shuffled = [...ImageData].sort(() => Math.random() - 0.5);
            setCurrentCycle(shuffled);
            setCurrentIndex(0);
        };

        initializeCycle();

        // Load Leaflet CSS and JS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        document.head.appendChild(script);

        return () => {
            cleanupCurrentView();
            document.head.removeChild(link);
            if (script.parentNode) document.head.removeChild(script);
        };
    }, []);

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

    useEffect(() => {
        if (viewType === null) {
            cleanupCurrentView();
            return;
        }

        const currentImage = currentCycle[currentIndex];
        const coords = parseCoordinates(currentImage?.location);

        if (!coords || !window.L || !viewerRef.current) return;

        cleanupCurrentView();

        if (viewType === 'map') {
            // Initialize OpenStreetMap view using Leaflet
            const newMap = window.L.map(viewerRef.current).setView([coords.lat, coords.lng], 17);

            // Add the OpenStreetMap tiles
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap contributors'
            }).addTo(newMap);

            // Add marker
            window.L.marker([coords.lat, coords.lng]).addTo(newMap);

            setMap(newMap);

        } else if (viewType === 'street') {
            // Initialize a simple street view using Google Street View Static API
            // Note: This is a fallback solution that shows a static image
            const heading = 0; // Default heading (North)
            const pitch = 0; // Default pitch (straight ahead)

            // Create a simple street view display
            const streetViewContainer = document.createElement('div');
            streetViewContainer.className = 'flex items-center justify-center h-full bg-gray-100';

            // Create a display showing the coordinates
            const coordDisplay = document.createElement('div');
            coordDisplay.className = 'text-center font-mono text-sm';
            coordDisplay.innerHTML = `
                <p class="mb-2">LOCATION</p>
                <p>LAT: ${coords.lat.toFixed(6)}</p>
                <p>LNG: ${coords.lng.toFixed(6)}</p>
                <p class="mt-4 text-xs">STREET_VIEW_UNAVAILABLE</p>
                <p class="mt-2 text-xs">VIEWING_MAP_RECOMMENDED</p>
            `;

            streetViewContainer.appendChild(coordDisplay);
            viewerRef.current.appendChild(streetViewContainer);
        }

    }, [viewType, currentIndex, currentCycle]);

    const handleImageClick = () => {
        setViewType(null);
        setIsLoading(true);
        const nextIndex = currentIndex + 1;

        if (nextIndex >= currentCycle.length) {
            const newCycle = [...ImageData].sort(() => Math.random() - 0.5);
            setCurrentCycle(newCycle);
            setCurrentIndex(0);
        } else {
            setCurrentIndex(nextIndex);
        }
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        handleImageClick();
    };

    const toggleView = (type) => {
        const currentImage = currentCycle[currentIndex];
        const coords = parseCoordinates(currentImage?.location);
        if (!coords) return;

        if (type === 'street') {
            setIsModalOpen(true);
        } else {
            setViewType(viewType === type ? null : type);
        }
    };

    if (currentCycle.length === 0) return null;

    const currentImage = currentCycle[currentIndex];
    const hasLocation = parseCoordinates(currentImage?.location) !== null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="relative flex flex-col gap-0 w-full max-w-[900px]">
                <Link
                    to="/"
                    className="font-mono text-xs absolute top-0 left-0 border border-black p-2 bg-white -translate-y-full mb-4 hover:underline hover:text-red-500"
                >
                    fonts.local_v1
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,3.5fr)_minmax(0,1fr)] border-t border-l border-black">
                    <div className="relative border-r border-b border-black aspect-square">
                        {isLoading && viewType === null && (
                            <div className="absolute inset-0 bg-white">
                                <div className="h-full w-full animate-pulse" />
                            </div>
                        )}

                        {viewType === null ? (
                            <img
                                key={currentImage.id}
                                src={currentImage.src}
                                alt={`Image ${currentImage.id}`}
                                onClick={handleImageClick}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                loading="lazy"
                                className={`cursor-pointer h-full w-full object-cover hover:contrast-50 transition-all duration-300
                                    ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            />
                        ) : (
                            <div ref={viewerRef} className="h-full w-full" />
                        )}
                    </div>

                    <div className="border-r border-b border-black p-4 font-mono text-xs min-h-[200px] md:min-h-0">
                        <div className="flex flex-col gap-4 h-full">
                            <p>ID_{currentImage.id}</p>
                            <p>LOC_{currentImage.location}</p>
                            <p>ARTIST_{currentImage.artist}</p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => toggleView('map')}
                                    className={`w-16 h-16 ${!hasLocation ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-50'}`}
                                    disabled={!hasLocation}
                                >
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        src="/img/bird.mp4"
                                        alt="Map View"
                                        className="w-full h-full object-cover"
                                    />
                                </button>

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-16 h-16 hover:opacity-50"
                                    title="Submit Your Font"
                                >
                                    <video
                                        autoPlay
                                        loop
                                        muted
                                        src="/img/eye.mp4"
                                        alt="Submit Your Font"
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            </div>

                            <p className="mt-auto hover:text-green-500 cursor-pointer" onClick={handleImageClick} >
                                {viewType ? 'CLICK_ICON_TO_EXIT' : 'CLICK_TO_CYCLE'}
                            </p>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 divide-x divide-black border-r border-b border-black">
                        <p className="font-mono text-[10px] p-2">VIEWED_{currentIndex + 1}/{currentCycle.length}</p>
                        <p className="font-mono text-[10px] p-2 text-right">SYSTEM_ACTIVE</p>
                    </div>
                </div>
            </div>
            <SubmissionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                locationData={parseCoordinates(currentImage?.location)}
            />
        </div>
    );
}

export default GalleryPage;