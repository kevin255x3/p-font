import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const SubmissionModal = ({ isOpen, onClose, locationData }) => {
    // Cloudinary configuration
    const CLOUDINARY_CLOUD_NAME = 'dwtsecytx';
    const CLOUDINARY_UPLOAD_PRESET = 'fontslocal';

    const [formData, setFormData] = useState({
        artist: '',
        location: 'NOT_AVAILABLE',
        email: '',
        imageUrl: null
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Load Cloudinary Upload Widget script
        const script = document.createElement('script');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.artist.trim()) {
            newErrors.artist = 'REQUIRED';
        }

        if (!formData.imageUrl) {
            newErrors.image = 'REQUIRED';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageUpload = () => {
        if (typeof window.cloudinary === 'undefined') {
            alert('Image upload is initializing. Please try again in a moment.');
            return;
        }

        const uploadWidget = window.cloudinary.createUploadWidget(
            {
                cloudName: CLOUDINARY_CLOUD_NAME,
                uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                sources: ['local', 'camera'],
                maxFiles: 1,
                maxFileSize: 10000000, // 10MB
                styles: {
                    palette: {
                        window: '#FFFFFF',
                        windowBorder: '#000000',
                        tabIcon: '#000000',
                        menuIcons: '#000000',
                        textDark: '#000000',
                        textLight: '#FFFFFF',
                        link: '#000000',
                        action: '#000000',
                        inactiveTabIcon: '#999999',
                        error: '#FF0000',
                        inProgress: '#0000FF',
                        complete: '#000000',
                        sourceBg: '#FFFFFF'
                    },
                    fonts: {
                        default: null,
                        "'Mono'": {
                            url: null,
                            active: true
                        }
                    }
                }
            },
            (error, result) => {
                if (!error && result && result.event === 'success') {
                    setFormData(prev => ({
                        ...prev,
                        imageUrl: result.info.secure_url
                    }));
                }
            }
        );

        uploadWidget.open();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Submit to Formspree with the Cloudinary URL
            const response = await fetch(
                'https://formspree.io/f/myzkdjjb',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        artist: formData.artist,
                        location: formData.location,
                        email: formData.email,
                        imageUrl: formData.imageUrl // This is the Cloudinary URL
                    })
                }
            );

            if (response.ok) {
                alert('SUBMISSION_SUCCESSFUL');
                handleClose();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('SUBMISSION_FAILED: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            artist: '',
            location: 'NOT_AVAILABLE',
            email: '',
            imageUrl: null
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleClose} />
            <div className="relative bg-white w-full max-w-md mx-4">
                <div className="border border-black">
                    <div className="border-b border-black p-4 flex justify-between items-center">
                        <h2 className="font-mono text-xs">SUBMIT_YOUR_FONT</h2>
                        <button onClick={handleClose} className="hover:opacity-50">
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4">
                        <p className="font-mono text-[10px] mb-4">CONTRIBUTE_TO_COLLECTION</p>
                        <div className="space-y-4">
                            <div>
                                <label className="font-mono text-xs block mb-1">ARTIST_NAME*</label>
                                <input
                                    type="text"
                                    value={formData.artist}
                                    onChange={(e) => setFormData(prev => ({ ...prev, artist: e.target.value }))}
                                    className="w-full border border-black p-2 font-mono text-xs"
                                />
                                {errors.artist && (
                                    <p className="font-mono text-xs text-red-500 mt-1">{errors.artist}</p>
                                )}
                            </div>

                            <div>
                                <label className="font-mono text-xs block mb-1">LOCATION*</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full border border-black p-2 font-mono text-xs"
                                />
                            </div>

                            <div>
                                <label className="font-mono text-xs block mb-1">EMAIL_OPTIONAL</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full border border-black p-2 font-mono text-xs"
                                />
                            </div>

                            <div>
                                <label className="font-mono text-xs block mb-1">UPLOAD_IMAGE*</label>
                                <button
                                    type="button"
                                    onClick={handleImageUpload}
                                    className="w-full border border-black p-2 font-mono text-xs hover:bg-gray-50"
                                >
                                    {formData.imageUrl ? 'CHANGE_IMAGE' : 'SELECT_IMAGE'}
                                </button>
                                {errors.image && (
                                    <p className="font-mono text-xs text-red-500 mt-1">{errors.image}</p>
                                )}

                                {formData.imageUrl && (
                                    <div className="mt-2 border border-black p-2">
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-40 object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full mt-6 border border-black p-2 font-mono text-xs hover:bg-gray-50 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                        </button>
                    </form>

                    <div className="border-t border-black p-2">
                        <p className="font-mono text-[10px] text-right">*_REQUIRED_FIELDS</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubmissionModal;