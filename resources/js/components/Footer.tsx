import React from 'react';

const iconClass = "w-5 h-5 inline-block align-text-bottom mx-1 text-[#D4AF37]";

interface FooterProps {
    onAdminClick?: () => void;
}

const Footer = ({ onAdminClick }: FooterProps) => {
    return (
        <footer className="bg-gradient-to-b from-[#8B4513] to-[#654321] border-t-4 border-[#D4AF37] shadow-[0_-8px_32px_0_rgba(212,175,55,0.15)] mt-auto text-[#FAFAFA] relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#D4AF37] rounded-full blur-3xl transform -translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#D4AF37] rounded-full blur-3xl transform translate-x-20 translate-y-20"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#D4AF37] rounded-full blur-2xl opacity-30"></div>
            </div>
            <div className="relative z-10 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-[#D4AF37] border-b border-[#D4AF37]/30 pb-1">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243z" />
                            </svg> 
                            Visit Us
                        </h3>
                        <div className="space-y-1">
                            <p className="flex items-center group hover:text-[#D4AF37] transition-all duration-300 cursor-pointer">
                                <svg className="w-5 h-5 mr-3 text-[#D4AF37] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243z" />
                                </svg> 
                                <span className="text-sm leading-relaxed">123 Main St, Downtown City</span>
                            </p>
                            <p className="flex items-center group">
                                <svg className="w-5 h-5 mr-3 text-[#D4AF37] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.3 1.2a2 2 0 01-.45 1.95l-.7.7a16.001 16.001 0 006.36 6.36l.7-.7a2 2 0 011.95-.45l1.2.3A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" />
                                </svg> 
                                <a href="tel:+1234567890" className="text-sm hover:text-[#D4AF37] transition-all duration-300 hover:underline font-medium">(123) 456-7890</a>
                            </p>
                            <p className="flex items-center group">
                                <svg className="w-5 h-5 mr-3 text-[#D4AF37] group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg> 
                                <a href="mailto:info@barbershop.com" className="text-sm hover:text-[#D4AF37] transition-all duration-300 hover:underline font-medium">info@barbershop.com</a>
                            </p>
                        </div>
                    </div>
                    {/* Business Hours */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-[#D4AF37] border-b border-[#D4AF37]/30 pb-1">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12,6 12,12 16,14"/>
                            </svg> 
                            Business Hours
                        </h3>
                        <div className="bg-[#654321]/50 rounded-lg p-2 backdrop-blur-sm border border-[#D4AF37]/20">
                            <table className="text-sm w-full">
                                <tbody>
                                    <tr className="flex justify-between py-1 border-b border-[#D4AF37]/10">
                                        <td className="font-medium">Mon-Fri</td>
                                        <td className="text-[#D4AF37] font-semibold">9:00am - 7:00pm</td>
                                    </tr>
                                    <tr className="flex justify-between py-1 border-b border-[#D4AF37]/10">
                                        <td className="font-medium text-[#D4AF37]">Saturday</td>
                                        <td className="text-[#D4AF37] font-bold">9:00am - 5:00pm</td>
                                    </tr>
                                    <tr className="flex justify-between py-1">
                                        <td className="font-medium text-[#FAFAFA]/60">Sunday</td>
                                        <td className="text-[#FAFAFA]/60">Closed</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="mt-2 text-xs text-[#D4AF37] bg-[#D4AF37]/10 rounded px-2 py-0.5 text-center font-semibold animate-pulse">
                                ✨ Walk-ins welcome! ✨
                            </div>
                        </div>
                    </div>
                    {/* Services Menu */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-[#D4AF37] border-b border-[#D4AF37]/30 pb-1">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg> 
                            Services
                        </h3>
                        <ul className="space-y-1">
                            {[
                                'Classic Haircut',
                                'Hot Shave',
                                'Beard Trim & Styling',
                                'Hair Washing',
                                'Grooming Packages',
                                'View All Services'
                            ].map((service, index) => (
                                <li key={index} className="group">
                                    <a href="#" className="flex items-center text-sm hover:text-[#D4AF37] transition-all duration-300 hover:translate-x-2 hover:font-medium">
                                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                        {service}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Quick Links & Social */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-[#D4AF37] border-b border-[#D4AF37]/30 pb-1">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg> 
                            Quick Links
                        </h3>
                        <ul className="space-y-1 mb-2">
                            {[
                                'Online Booking',
                                'Pricing',
                                'Gallery',
                                'About Us',
                                'Gift Cards',
                                'Customer Reviews'
                            ].map((link, index) => (
                                <li key={index} className="group">
                                    <a href="#" className="flex items-center text-sm hover:text-[#D4AF37] transition-all duration-300 hover:translate-x-2 hover:font-medium">
                                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                        {link}
                                    </a>
                                </li>
                            ))}
                            <li className="group">
                                <button 
                                    onClick={onAdminClick}
                                    className="flex items-center text-sm hover:text-[#D4AF37] transition-all duration-300 hover:translate-x-2 hover:font-medium w-full text-left bg-[#D4AF37]/10 px-2 py-1 "
                                >
                                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                                    🔧 Admin Dashboard
                                </button>
                            </li>
                        </ul>
                        {/* Social Media */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-[#D4AF37]">Follow Us</h4>
                            <div className="flex gap-2">
                                {[
                                    { icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z", label: "Facebook" },
                                    { icon: "M2 2h20v20H2z M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M17.5 6.5h0", label: "Instagram" },
                                    { icon: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z", label: "Reviews" }
                                ].map((social, index) => (
                                    <a key={index} href="#" aria-label={social.label} className="group p-2 bg-[#654321]/50 rounded-lg hover:bg-[#D4AF37]/20 transition-all duration-300 hover:scale-110 hover:rotate-3">
                                        <svg className="w-5 h-5 text-[#FAFAFA] group-hover:text-[#D4AF37] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d={social.icon} />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                        {/* Badges */}
                        <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                                {['Licensed', '25+ Years', 'Premium Products'].map((badge, index) => (
                                    <span key={index} className="border-2 border-[#D4AF37] rounded-full px-2 py-0.5 text-xs text-[#D4AF37] font-semibold bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 transition-colors cursor-default">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                            <div className="bg-[#654321]/50 rounded-lg p-2 border-l-4 border-[#D4AF37]">
                                <div className="text-xs text-[#FAFAFA]/90 italic flex items-center">
                                    <svg className="w-4 h-4 text-[#D4AF37] mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    "Best barbershop in town! Always professional."
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Bottom Section */}
                <div className="border-t border-[#D4AF37]/40 mt-6 pt-3">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-2 text-xs text-[#FAFAFA]/80">
                        <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-[#D4AF37]">Accepted:</span>
                                <div className="flex gap-1">
                                    {['Visa', 'Mastercard', 'Cash'].map((payment, index) => (
                                        <span key={index} className="bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded text-xs font-medium">
                                            {payment}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="hidden lg:block w-1 h-1 bg-[#D4AF37] rounded-full"></div>
                            <span className="text-[#D4AF37] font-medium">Same-day booking available</span>
                            <div className="hidden lg:block w-1 h-1 bg-[#D4AF37] rounded-full"></div>
                            <span className="text-[#D4AF37] font-medium">Professional Licensed Barbers</span>
                        </div>
                        <div className="text-center lg:text-right">
                            <div className="text-[#FAFAFA]/60">© {new Date().getFullYear()} Barbershop. All rights reserved.</div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;