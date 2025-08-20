import React, { useState } from 'react';

const iconClass = "w-4 h-4 inline-block align-text-bottom mr-1 text-[#D4AF37]";

interface SalonHeaderProps {
    salon?: {
        name?: string;
        logo?: string;
    };
    onLoginClick?: () => void;
    onSignupClick?: () => void;
    onBookingClick?: () => void;
    onAdminClick?: () => void;
}

const Header = ({ salon, onLoginClick, onSignupClick, onBookingClick, onAdminClick }: SalonHeaderProps) => {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [active, setActive] = useState<string>('home');
    const [logoError, setLogoError] = useState(false);
    
    React.useEffect(() => {
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = '';
        };
    }, []);

    const handleLogoError = () => {
        setLogoError(true);
    };

    return (
        <header className="bg-[#8B4513] shadow-lg rounded-b-xl sticky top-0 z-50 border-b border-[#D4AF37]">
            <div className="max-w-7xl mx-auto flex flex-nowrap items-center justify-between py-2 px-4 sm:px-8 lg:px-12">
                {/* Logo/Name */}
                <a href="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2 text-[#FAFAFA] hover:text-[#D4AF37] transition-colors duration-150 whitespace-nowrap">
                    {salon?.logo && !logoError && (
                        <img 
                            src={salon.logo} 
                            alt="Salon Logo" 
                            width={40}
                            height={40}
                            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full object-cover mr-2"
                            onError={handleLogoError}
                        />
                    )}
                    <span className="mr-1">{salon?.name || 'Barbershop'}</span>
                    <span className="text-[#D4AF37] text-3xl leading-none">•</span>
                </a>
                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-4 font-medium items-center whitespace-nowrap">
                    <a href="#home" onClick={() => setActive('home')} className={`${active==='home' ? 'bg-[#D4AF37] text-[#8B4513] font-bold shadow-sm' : 'text-[#FAFAFA]'} px-3 py-1 rounded transition-all duration-150 hover:bg-[#654321] hover:text-[#D4AF37]`}>Home</a>
                    <a href="#services" onClick={() => setActive('services')} className={`${active==='services' ? 'bg-[#D4AF37] text-[#8B4513] font-bold shadow-sm' : 'text-[#FAFAFA]'} px-3 py-1 rounded transition-all duration-150 hover:bg-[#654321] hover:text-[#D4AF37]`}>Services</a>
                    <a href="#pricing" onClick={() => setActive('pricing')} className={`${active==='pricing' ? 'bg-[#D4AF37] text-[#8B4513] font-bold shadow-sm' : 'text-[#FAFAFA]'} px-3 py-1 rounded transition-all duration-150 hover:bg-[#654321] hover:text-[#D4AF37]`}>Pricing</a>
                    <a href="#gallery" onClick={() => setActive('gallery')} className={`${active==='gallery' ? 'bg-[#D4AF37] text-[#8B4513] font-bold shadow-sm' : 'text-[#FAFAFA]'} px-3 py-1 rounded transition-all duration-150 hover:bg-[#654321] hover:text-[#D4AF37]`}>Gallery</a>
                    <a href="#aboutus" onClick={() => setActive('aboutus')} className={`${active==='aboutus' ? 'bg-[#D4AF37] text-[#8B4513] font-bold shadow-sm' : 'text-[#FAFAFA]'} px-3 py-1 rounded transition-all duration-150 hover:bg-[#654321] hover:text-[#D4AF37]`}>About Us</a>
                    <a href="#contact" onClick={() => setActive('contact')} className={`${active==='contact' ? 'bg-[#D4AF37] text-[#8B4513] font-bold shadow-sm' : 'text-[#FAFAFA]'} px-3 py-1 rounded transition-all duration-150 hover:bg-[#654321] hover:text-[#D4AF37]`}>Contact</a>
                </nav>
                {/* Right Side: Book Appointment (desktop only) & Hamburger */}
                <div className="flex items-center gap-2 ml-auto">
                    {/* Book Appointment only on desktop */}
                    <button 
                        onClick={onBookingClick}
                        className="hidden md:flex bg-[#D4AF37] text-[#2F2F2F] px-5 py-2 rounded-full shadow-lg hover:bg-[#B8860B] font-semibold transition-all duration-200 border border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] items-center whitespace-nowrap"
                    >
                        BOOK APPOINTMENT
                    </button>
                    {/* Hamburger Button for Mobile */}
                    <button
                        className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-[#D4AF37] bg-[#8B4513] text-[#D4AF37]"
                        aria-label="Toggle navigation"
                        onClick={() => setMobileNavOpen((open) => !open)}
                    >
                        <span className="block w-6 h-0.5 bg-[#D4AF37] mb-1"></span>
                        <span className="block w-6 h-0.5 bg-[#D4AF37] mb-1"></span>
                        <span className="block w-6 h-0.5 bg-[#D4AF37]"></span>
                    </button>
                </div>
                {/* Divider */}
                <div className="hidden lg:block h-8 border-l border-[#D4AF37] mx-4"></div>
                {/* Actions & Quick Info (hidden on mobile) */}
                <div className="hidden md:flex items-center gap-3 whitespace-nowrap">
                    {/* Phone */}
                    <a href="tel:+1234567890" className="items-center text-sm text-[#F5F5DC] hover:text-[#D4AF37] transition-colors px-2 whitespace-nowrap">
                        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.3 1.2a2 2 0 01-.45 1.95l-.7.7a16.001 16.001 0 006.36 6.36l.7-.7a2 2 0 011.95-.45l1.2.3A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" /></svg>
                        (123) 456-7890
                    </a>
                    {/* Login/Signup - fix alignment */}
                    <div className="flex flex-row items-center gap-x-2 whitespace-nowrap">
                        <button onClick={onLoginClick} className="text-[#FAFAFA] hover:text-[#D4AF37] font-semibold transition-colors px-2 py-1 flex items-center">Login</button>
                        <button onClick={onSignupClick} className="text-[#FAFAFA] hover:text-[#D4AF37] font-semibold transition-colors px-2 py-1 flex items-center">Sign Up</button>
                        <button onClick={onAdminClick} className="bg-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/30 font-semibold transition-colors px-3 py-1 rounded border border-[#D4AF37]/50 flex items-center text-sm">
                            🔧 Admin
                        </button>
                    </div>
                    {/* Quick Info */}
                    <div className="hidden xl:flex flex-col items-end ml-2 text-xs text-[#F5F5DC] gap-0.5 min-w-[120px] whitespace-nowrap">
                        <span className="flex items-center whitespace-nowrap">
                            <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                            <span className="text-[#F5F5DC]">Mon-Sat: 9am - 7pm</span>
                        </span>
                        <span className="flex items-center whitespace-nowrap">
                            <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243z" /></svg>
                            <span className="text-[#F5F5DC]">Downtown City</span>
                        </span>
                    </div>
                </div>
            </div>
            {/* Mobile nav (dropdown style) */}
            {mobileNavOpen && (
                <nav className="md:hidden flex flex-col gap-2 px-4 pb-2 bg-[#8B4513] rounded-b-xl shadow animate-fade-in-down">
                    <div className="flex flex-col gap-2 pt-2">
                        <a href="#home" className="bg-[#D4AF37] text-[#8B4513] font-bold px-2 py-1 rounded-lg shadow-sm transition-all duration-150 hover:bg-[#B8860B] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]">Home</a>
                        <a href="#services" className="text-[#FAFAFA] hover:bg-[#654321] hover:text-[#D4AF37] px-2 py-1 rounded transition-colors">Services</a>
                        <a href="#pricing" className="text-[#FAFAFA] hover:bg-[#654321] hover:text-[#D4AF37] px-2 py-1 rounded transition-colors">Pricing</a>
                        <a href="#gallery" className="text-[#FAFAFA] hover:bg-[#654321] hover:text-[#D4AF37] px-2 py-1 rounded transition-colors">Gallery</a>
                        <a href="#aboutus" className="text-[#FAFAFA] hover:bg-[#654321] hover:text-[#D4AF37] px-2 py-1 rounded transition-colors">About Us</a>
                        <a href="#contact" className="text-[#FAFAFA] hover:bg-[#654321] hover:text-[#D4AF37] px-2 py-1 rounded transition-colors">Contact</a>
                        <button 
                            onClick={onBookingClick}
                            className="bg-[#D4AF37] text-[#2F2F2F] px-4 py-1.5 rounded-full shadow-lg hover:bg-[#B8860B] font-semibold transition-all duration-200 border border-[#D4AF37] flex items-center whitespace-nowrap mt-2"
                        >
                            Book Appointment
                        </button>
                    </div>
                    <div className="flex flex-row items-center gap-x-2 justify-center mt-1 whitespace-nowrap">
                        <button onClick={onLoginClick} className="text-[#FAFAFA] hover:text-[#D4AF37] font-semibold transition-colors px-2 py-1 flex items-center">Login</button>
                        <button onClick={onSignupClick} className="text-[#FAFAFA] hover:text-[#D4AF37] font-semibold transition-colors px-2 py-1 flex items-center">Sign Up</button>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center text-xs text-[#F5F5DC] mt-1 pb-2 whitespace-nowrap">
                        <span className="flex items-center whitespace-nowrap">
                            <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                            <span className="text-[#F5F5DC]">Mon-Sat: 9am - 7pm</span>
                        </span>
                        <span className="flex items-center whitespace-nowrap">
                            <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243z" /></svg>
                            <span className="text-[#F5F5DC]">Downtown City</span>
                        </span>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Header;