import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4">
            <div className="relative flex flex-col gap-0 w-full max-w-[900px]">
                <h1 className="font-mono text-xs absolute top-0 left-0 border border-black p-2 bg-white -translate-y-full mb-4">
                    fonts.vancouver
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,3.5fr)_minmax(0,1fr)] border-t border-l border-black">
                    <div className="relative border-r border-b border-black aspect-square flex flex-col items-center justify-center p-4">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            src="/spray.mp4"
                            alt="Spray can icon"
                            className="w-24 h-24 object-contain mb-4"
                        />
                        <Link
                            to="/gallery"
                            className="font-mono text-xs hover:underline cursor-pointer transition-all duration-300"
                        >
                            fonts.vancouver
                        </Link>
                    </div>

                    <div className="border-r border-b border-black p-4 font-mono text-xs min-h-[200px] md:min-h-0 hidden md:block">
                        <div className="flex flex-col gap-4 h-full">
                            <p>ID_HOME</p>
                            <p>LOC_LANDING</p>
                            <p>STATUS_READY</p>
                            <p className="mt-auto">CLICK_TO_BEGIN</p>
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 divide-x divide-black border-r border-b border-black">
                        <p className="font-mono text-[10px] p-2">SYSTEM_READY</p>
                        <p className="font-mono text-[10px] p-2 text-right">CLICK_TO_BEGIN</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;