import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // Removed useNavigate since we don't need it
import ImageData from '../data/ImageData';

function GalleryPage() {
    const [currentCycle, setCurrentCycle] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeCycle = () => {
            const shuffled = [...ImageData].sort(() => Math.random() - 0.5);
            setCurrentCycle(shuffled);
            setCurrentIndex(0);
        };

        initializeCycle();
    }, []);

    const handleImageClick = () => {
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

    if (currentCycle.length === 0) return null;

    const currentImage = currentCycle[currentIndex];

    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="relative flex flex-col gap-0 w-full max-w-[900px]">
                <Link
                    to="/"
                    className="font-mono text-xs absolute top-0 left-0 border border-black p-2 bg-white -translate-y-full mb-4 hover:underline"
                >
                    fonts.vancouver_v1
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,3.5fr)_minmax(0,1fr)] border-t border-l border-black">
                    <div className="relative border-r border-b border-black aspect-square">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white">
                                <div className="h-full w-full animate-pulse" />
                            </div>
                        )}
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
                    </div>

                    <div className="border-r border-b border-black p-4 font-mono text-xs min-h-[200px] md:min-h-0">
                        <div className="flex flex-col gap-4 h-full">
                            <p>ID_{currentImage.id}</p>
                            <p>LOC_{currentImage.location}</p>
                            <p>ARTIST_{currentImage.artist}</p>
                            <p className="mt-auto">CLICK_TO_CYCLE</p>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 divide-x divide-black border-r border-b border-black">
                        <p className="font-mono text-[10px] p-2">VIEWED_{currentIndex + 1}/{currentCycle.length}</p>
                        <p className="font-mono text-[10px] p-2 text-right">SYSTEM_ACTIVE</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GalleryPage;