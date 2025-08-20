import React, { useState } from 'react';
// @ts-ignore
import lottieData from './assets/CikZiGtadj.json';
import Lottie from 'lottie-react';

const heroImage = '/assets/4.jpg';

interface SalonHeroProps {
    salon?: {
        name?: string;
        tagLine?: string;
        phone1?: string;
        logo?: string;
    };
    onBookingClick?: () => void;
}

const Hero = ({ salon, onBookingClick }: SalonHeroProps) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <section id="home" className="relative w-full min-h-[750px] md:min-h-[900px] flex items-center justify-center overflow-hidden px-4 py-16 md:py-0 pb-32 bg-[#2F2F2F]">
            {/* Blurred background overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={heroImage} 
                    alt="Barbershop Hero Background" 
                    className="w-full h-full object-cover object-center opacity-60 blur-sm" 
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
            </div>
            <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row items-stretch justify-between gap-10 md:gap-5 relative z-10">
                {/* Left: Content (70% width) */}
                <div className="w-full md:w-[70%] flex flex-col items-start md:items-start gap-6 md:gap-8">
                    {/* Heading and Lottie in a row */}
                    <div className="flex flex-row items-start gap-50 md:gap-1 mb-2 md:mb-4 w-full">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-serif text-[#FAFAFA] whitespace-pre-line leading-tight">
                            {salon?.name ? (
                                <>{salon.name}<br /><span className="text-2xl font-normal">{salon.tagLine}</span></>
                            ) : (
                                <>Gentleman's Grooming<br />Since 1999</>
                            )}
                        </h1>
                    </div>
                    <p className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6 drop-shadow-sm text-[#F3E9D2] pl-2">
                        {salon?.tagLine || 'Walk-ins Welcome • Same Day Service • Master Barbers'}
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-start items-center pl-2">
                        <button 
                            onClick={onBookingClick}
                            className="bg-[#D4AF37] text-[#2F2F2F] font-bold px-8 md:px-10 py-3 md:py-4 rounded-full shadow-lg text-lg md:text-xl hover:bg-[#B8860B] transition-all duration-200"
                        >
                            BOOK YOUR APPOINTMENT
                        </button>
                        <a href={`tel:${salon?.phone1 || '5551234567'}`} className="text-[#2F2F2F] border-2 border-[#D4AF37] px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-lg md:text-xl hover:bg-[#D4AF37] hover:text-[#8B4513] transition-all duration-200 bg-[#FAFAFA]/80">
                            Call Now: {salon?.phone1 ? salon.phone1 : '(555) 123-4567'}
                        </a>
                    </div>
                </div>
                {/* Right: Image (30% width) */}
                <div className="w-full md:w-[30%] flex items-center justify-center md:justify-end mt-8 md:mt-0 relative z-10">
                    <img 
                        src={salon?.logo && !imageError ? salon.logo : heroImage} 
                        alt="Barbershop Hero" 
                        className="object-cover w-full h-full max-h-[500px] rounded-lg shadow-md"
                        onError={handleImageError}
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;