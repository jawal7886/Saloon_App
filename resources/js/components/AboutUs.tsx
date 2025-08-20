import React, { useState, useEffect } from 'react';

interface Barber {
  id: number;
  name: string;
  position: string;
  bio: string;
  image: string | null;
  experience: string | null;
  specialties: string[] | null;
  phone: string | null;
  email: string | null;
  social_media: Record<string, string> | null;
  is_active: boolean;
  sort_order: number;
  salon_id: number | null;
  created_at: string;
  updated_at: string;
}

const AboutUs = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aboutHeading, setAboutHeading] = useState('About Our Barbershop');
  const [aboutParagraph, setAboutParagraph] = useState('Where traditional craftsmanship meets modern style. We create more than just haircuts – we craft confidence, style, and unforgettable experiences in our sanctuary of grooming excellence.');
  const [features, setFeatures] = useState([
    // fallback default values
    {
      icon: <span role="img" aria-label="Team" className="text-3xl">👥</span>,
      title: "Expert Craftsmen",
      description: "Our master barbers bring decades of combined experience, staying current with the latest trends and timeless techniques.",
      gradient: "from-[#D4AF37] to-[#B8860B]"
    },
    {
      icon: <span role="img" aria-label="Star" className="text-3xl">⭐</span>,
      title: "Premium Experience",
      description: "We use only the finest products and tools to ensure your hair and skin receive the luxury treatment they deserve.",
      gradient: "from-[#B8860B] to-[#D4AF37]"
    },
    {
      icon: <span role="img" aria-label="Heart" className="text-3xl">💚</span>,
      title: "Sanctuary Space",
      description: "Step into our carefully curated environment designed for relaxation, comfort, and personal rejuvenation.",
      gradient: "from-[#D4AF37] to-[#FAFAFA]"
    }
  ]);

  useEffect(() => {
    fetchBarbers();
    fetchAboutUsContent();
    fetchFeatures(); // <-- add this
  }, []);

  const fetchBarbers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/admin/barbers', {
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch barbers');
      }
      const data = await response.json();
      // Filter only active barbers and sort by sort_order
      const activeBarbers = data
        .filter((barber: Barber) => barber.is_active)
        .sort((a: Barber, b: Barber) => a.sort_order - b.sort_order);
      setBarbers(activeBarbers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching barbers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAboutUsContent = async () => {
    try {
      const response = await fetch('/api/aboutus', {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.heading) setAboutHeading(data.heading);
        if (data.paragraph) setAboutParagraph(data.paragraph);
      }
    } catch (err) {
      // fallback to default content
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/aboutus/all', {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setFeatures(data.map((item, idx) => ({
          icon: idx === 0 ? <span role="img" aria-label="Team" className="text-3xl">👥</span> :
                idx === 1 ? <span role="img" aria-label="Star" className="text-3xl">⭐</span> :
                <span role="img" aria-label="Heart" className="text-3xl">💚</span>,
          title: item.heading,
          description: item.paragraph,
          gradient: idx === 0 ? "from-[#D4AF37] to-[#B8860B]" :
                    idx === 1 ? "from-[#B8860B] to-[#D4AF37]" :
                    "from-[#D4AF37] to-[#FAFAFA]"
        })));
      }
    } catch (err) {
      // fallback to default features
    }
  };

  // Generate gradient colors for barber cards
  const getGradientColor = (index: number) => {
    const gradients = [
      "from-[#D4AF37] to-[#B8860B]",
      "from-[#B8860B] to-[#D4AF37]",
      "from-[#D4AF37] to-[#FAFAFA]",
      "from-[#B8860B] to-[#D4AF37]",
      "from-[#D4AF37] to-[#B8860B]"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section id="aboutus" className="relative bg-gradient-to-br from-[#FAFAFA] via-[#F5F5F5] to-[#EEEEEE] py-20 px-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-[#B8860B]/20 to-[#D4AF37]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-[#D4AF37]/20 to-[#FAFAFA]/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/70 backdrop-blur-sm rounded-full border border-[#D4AF37]/50 shadow-lg">
            <span className="text-2xl">✂️</span>
            <span className="text-[#D4AF37] font-semibold tracking-wide">CRAFTING EXCELLENCE</span>
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-[#2F2F2F] mb-6 leading-tight">
            {aboutHeading}
          </h2>
          <p className="text-xl md:text-2xl text-[#2F2F2F] leading-relaxed max-w-4xl mx-auto font-light">
            {aboutParagraph}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-[#D4AF37]/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#2F2F2F] mb-4 group-hover:text-[#B8860B] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#2F2F2F] leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="text-center">
          <div className="mb-12">
            <h3 className="text-4xl md:text-5xl font-bold text-[#2F2F2F] mb-4">
              Meet Our
              <span className="block text-[#2F2F2F]">
                Master Craftsmen
              </span>
            </h3>
            <p className="text-xl text-[#2F2F2F] max-w-2xl mx-auto">
              Our passionate team of artists brings years of expertise and dedication to every cut, style, and service.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-lg">{error || "Failed to load barbers. Please try again later."}</p>
            </div>
          ) : barbers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#2F2F2F] text-lg">No barbers available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {barbers.map((barber, index) => (
                <div 
                  key={barber.id}
                  className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-[#D4AF37]/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    {/* Avatar with gradient border */}
                    <div className="relative mb-6">
                      <div className={`w-28 h-28 mx-auto rounded-full bg-gradient-to-r ${getGradientColor(index)} p-1 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          {barber.image ? (
                            <img 
                              src={
                                barber.image.startsWith('http') || barber.image.startsWith('data:image')
                                  ? barber.image
                                  : `http://127.0.0.1:8000/${barber.image}`
                              } 
                              alt={barber.name}
                              className="w-20 h-20 rounded-full object-cover shadow-inner"
                            />
                          ) : (
                            <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${getGradientColor(index)} flex items-center justify-center text-[#2F2F2F] text-2xl font-bold shadow-inner`}>
                              {barber.name[0]}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Floating award badge */}
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-lg">🏅</span>
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-bold text-[#2F2F2F] mb-2 group-hover:text-[#B8860B] transition-colors">
                      {barber.name}
                    </h4>
                    <p className="text-lg font-semibold text-[#2F2F2F] mb-3">
                      {barber.position}
                    </p>
                    
                    <div className="space-y-3">
                      {barber.experience && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAFAFA] rounded-full">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="text-[#2F2F2F] text-sm font-medium">{barber.experience}</span>
                        </div>
                      )}
                      
                      {barber.specialties && barber.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {barber.specialties.map((specialty, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 text-[#2F2F2F] text-xs font-medium rounded-full border border-[#D4AF37]/30"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {barber.bio && (
                        <p className="text-[#2F2F2F] text-sm leading-relaxed mt-3">
                          {barber.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Call to action */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2F2F2F] rounded-full shadow-2xl hover:shadow-[#D4AF37]/25 hover:scale-105 transition-all duration-300 cursor-pointer font-bold">
              <span className="text-lg font-semibold">Ready for your transformation?</span>
              <span className="text-2xl animate-pulse">✨</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;