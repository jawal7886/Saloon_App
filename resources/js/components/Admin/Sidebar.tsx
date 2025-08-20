import React from 'react';

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    onBack?: () => void;
}

const SECTIONS = [
    { key: 'basic', label: 'Store Information' },
    { key: 'Services', label: 'Services' },
    //{ key: 'Pricing', label: 'Pricing' },
    { key: 'Offers', label: 'Offers' },
    { key: 'Gallery', label: 'Gallery' },
    { key: 'BarberManagement', label: 'Barber Management' },
    { key: 'Appointments', label: 'Appointments' },
    { key: 'About Us', label: 'About Us' },
    { key: 'Contact', label: 'Contact' },
    { key: 'POS', label: 'POS' }
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, onBack }) => {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 shadow-lg flex flex-col py-8 px-4">
            <h2 className="text-xl font-bold text-[#8B4513] mb-8 flex items-center gap-2">
                <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin Menu
            </h2>
            <nav className="flex flex-col gap-2">
                {SECTIONS.map(section => (
                    <button
                        key={section.key}
                        onClick={() => setActiveSection(section.key)}
                        className={`text-left px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeSection === section.key ? 'bg-[#D4AF37] text-white shadow' : 'text-[#8B4513] hover:bg-[#D4AF37]/10'}`}
                    >
                        {section.label}
                    </button>
                ))}
            </nav>
            <div className="mt-auto pt-8">
                <button
                    onClick={onBack}
                    className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
            </div>
        </aside>
    );
};

export default Sidebar; 