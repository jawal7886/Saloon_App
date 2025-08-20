import React, { useEffect } from 'react';

const Notification = ({ message, type = 'success', isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Auto dismiss after 3 seconds

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = type === 'success' ? '✓' : '✕';

    return (
        <div className="fixed top-4 right-4 z-[70] animate-slide-in">
            <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]`}>
                <div className="flex-shrink-0">
                    <span className="text-xl font-bold">{icon}</span>
                </div>
                <div className="flex-1">
                    <p className="font-semibold">
                        {type === 'success' ? 'Success!' : 'Error!'}
                    </p>
                    <p className="text-sm opacity-90">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Notification; 