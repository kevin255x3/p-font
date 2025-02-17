import React from 'react';

const LocationIcons = ({ location }) => {
    // Function to parse different coordinate formats and convert to decimal
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

        // Handle DMS format (e.g., "25° 3' 48.79 N, 121° 30' 34.062 E")
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

    const getMapUrl = () => {
        if (!isAvailable) return '#';
        return `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    };

    const getStreetViewUrl = () => {
        if (!isAvailable) return '#';
        return `https://www.google.com/maps?q=${coords.lat},${coords.lng}&layer=c&cbll=${coords.lat},${coords.lng}`;
    };

    return (
        <div className="flex gap-2 mt-2">
            {/* Bird Icon for Map View */}
            <a
                href={getMapUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-6 h-6 ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-50'}`}
                onClick={(e) => !isAvailable && e.preventDefault()}
            >
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                        fill="currentColor"
                    />
                </svg>
            </a>

            {/* Street View Icon */}
            <a
                href={getStreetViewUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-6 h-6 ${!isAvailable ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-50'}`}
                onClick={(e) => !isAvailable && e.preventDefault()}
            >
                <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path
                        d="M12.5 7c0 .83-.67 1.5-1.5 1.5S9.5 7.83 9.5 7s.67-1.5 1.5-1.5 1.5.67 1.5 1.5z M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"
                        fill="currentColor"
                    />
                </svg>
            </a>
        </div>
    );
};

export default LocationIcons;