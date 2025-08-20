import React, { useState, useEffect } from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  category: string;
}

interface ServicesProps {
  onRequireLogin: (action?: () => void) => void;
  isLoggedIn: boolean;
}

const Services = ({ onRequireLogin, isLoggedIn }: ServicesProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => {
        setServices([]);
        // Optionally handle error
      });
  }, []);

  // Handler for service click
  const handleServiceClick = (idx: number) => {
    onRequireLogin(() => {
      setActiveCard(activeCard === idx ? null : idx);
    });
  };

  // Handler for Book Now button
  const handleBookNow = (service: Service) => {
    onRequireLogin(() => {
      // Place your booking logic here
      alert(`Booking for: ${service.name}`);
    });
  };

  return (
    <section id="services" className="bg-gradient-to-br from-[#FAFAFA] via-[#F5F5F5] to-[#EEEEEE] py-20 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#D4AF37] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#B8860B] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#D4AF37] rounded-full blur-2xl"></div>
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold font-serif text-[#2F2F2F] mb-4 relative inline-block">
            Our Services
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full"></div>
          </h2>
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
            Discover our premium grooming services designed to make you look and feel your absolute best
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-xl py-12">No services available.</div>
          ) : (
            services.map((service, idx) => (
              <div
                key={service.id}
                className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer h-72 transform transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                  boxShadow: activeCard === idx 
                    ? '0 25px 50px rgba(212, 175, 55, 0.3), 0 0 0 3px rgba(212, 175, 55, 0.5)' 
                    : '0 10px 30px rgba(0, 0, 0, 0.1)',
                }}
                onClick={() => handleServiceClick(idx)}
                onMouseEnter={() => setActiveCard(idx)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Service Image */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      activeCard === idx ? 'scale-110 brightness-110' : 'scale-100'
                    }`}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTE5IDEzaC02djZoLTJ2LTZINXYtMmg2VjVoMnY2aDZ2MnoiLz48L3N2Zz4=';
                    }}
                  />
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>
                {/* Persistent Title with enhanced styling */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6">
                  <h3 className={`text-white font-bold text-xl transition-all duration-500 ${
                    activeCard === idx ? 'transform -translate-y-2' : ''
                  }`}>
                    {service.name}
                  </h3>
                  {/* Decorative line */}
                  <div className={`mt-2 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent transition-all duration-500 ${
                    activeCard === idx ? 'w-16' : 'w-8'
                  }`}></div>
                </div>
                {/* Interactive Overlay with enhanced animations */}
                <div
                  className={`absolute inset-0 transition-all duration-500 flex flex-col items-center justify-end p-6 ${
                    activeCard === idx
                      ? 'bg-gradient-to-t from-black/85 via-black/60 to-black/30 backdrop-blur-sm opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                  aria-hidden={activeCard !== idx}
                >
                  {/* Description slides up from bottom with stagger effect */}
                  <div
                    className={`w-full transition-all duration-700 transform ${
                      activeCard === idx
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-12 opacity-0'
                    }`}
                  >
                    <h3 className="text-2xl font-bold text-white mb-3 text-center tracking-wide">
                      {service.name}
                    </h3>
                    <p className="text-white/95 text-center text-sm md:text-base mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex justify-center">
                      <button
                        className={`px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:from-[#B8860B] hover:to-[#D4AF37] text-[#2F2F2F] font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md ${
                          activeCard === idx ? 'animate-pulse' : ''
                        }`}
                        style={{
                          boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                        }}
                        aria-label={`Book ${service.name} service`}
                        onClick={e => {
                          e.stopPropagation();
                          handleBookNow(service);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
                {/* Active Indicator with glow effect */}
                <div
                  className={`absolute inset-0 border-4 border-[#D4AF37] rounded-2xl pointer-events-none transition-all duration-500 ${
                    activeCard === idx ? 'opacity-100 shadow-lg' : 'opacity-0'
                  }`}
                  style={{
                    boxShadow: activeCard === idx ? '0 0 30px rgba(212, 175, 55, 0.6)' : 'none',
                  }}
                />
                {/* Corner accent */}
                <div className={`absolute top-4 right-4 w-8 h-8 transition-all duration-500 ${
                  activeCard === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}>
                  <div className="w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full shadow-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                {/* Floating particles effect */}
                {activeCard === idx && (
                  <>
                    <div className="absolute top-8 left-8 w-1 h-1 bg-[#D4AF37] rounded-full animate-ping"></div>
                    <div className="absolute top-12 right-12 w-1 h-1 bg-[#B8860B] rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-20 left-12 w-1 h-1 bg-[#D4AF37] rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Services;