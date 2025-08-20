import React, { useState, useEffect } from 'react';

interface Offer {
  id: number;
  title: string;
  description: string;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  is_popular: boolean;
  features: string[];
  duration: string;
  sort_order: number;
  is_active: boolean;
}

interface PricingProps {
  onRequireLogin: (action?: () => void) => void;
  isLoggedIn: boolean;
}

const Pricing = ({ onRequireLogin, isLoggedIn }: PricingProps) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [billingCycle] = useState<'single' | 'monthly'>('single'); // Not used for offers, but kept for compatibility

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers');
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (err) {
      // handle error
    }
  };

  return (
    <section id="pricing" className="bg-gradient-to-br from-[#FAFAFA] via-[#F5F5F5] to-[#EEEEEE] py-20 px-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#D4AF37] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#B8860B] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-[#D4AF37] rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold font-serif text-[#2F2F2F] mb-4 relative inline-block">
            Our Pricing
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full"></div>
          </h2>
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
            Transparent pricing for exceptional service. Choose the perfect package for your grooming needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, index) => (
            <div
              key={offer.id}
              className={`relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] ${
                selectedTier === index ? 'ring-4 ring-[#D4AF37] shadow-2xl' : ''
              } ${offer.is_popular ? 'border-2 border-[#D4AF37]' : ''}`}
              style={{
                background: 'linear-gradient(145deg, #ffffff, #f8f8f8)',
                boxShadow: selectedTier === index 
                  ? '0 25px 50px rgba(212, 175, 55, 0.3), 0 0 0 3px rgba(212, 175, 55, 0.5)' 
                  : offer.is_popular 
                  ? '0 15px 35px rgba(212, 175, 55, 0.2), 0 0 0 2px rgba(212, 175, 55, 0.3)'
                  : '0 10px 30px rgba(0, 0, 0, 0.1)',
              }}
              onClick={() => setSelectedTier(index)}
              onMouseEnter={() => setSelectedTier(index)}
              onMouseLeave={() => setSelectedTier(null)}
            >
              {/* Popular Badge */}
              {offer.is_popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2F2F2F] px-4 py-1.5 rounded-full font-bold text-xs shadow-lg border-2 border-white">
                    MOST POPULAR
                  </div>
                </div>
              )}
              {/* Discount Badge */}
              {offer.discount_percentage > 0 && (
                <div className="absolute top-3 right-3 z-20">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-full font-bold text-xs shadow-lg border border-red-400">
                    -{offer.discount_percentage}%
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-[#2F2F2F] mb-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{offer.description}</p>
                  <div className="mb-4">
                    {offer.original_price > offer.discounted_price ? (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center space-x-2 mb-1">
                          <span className="text-3xl font-bold text-[#D4AF37]">${offer.discounted_price}</span>
                          <span className="text-lg text-gray-500 line-through">${offer.original_price}</span>
                        </div>
                        <div className="text-xs text-red-500 font-semibold">
                          Save ${offer.original_price - offer.discounted_price}
                        </div>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-[#D4AF37]">${offer.discounted_price}</div>
                    )}
                    <div className="text-sm text-gray-500">{offer.duration}</div>
                  </div>
                </div>
                <div className="space-y-2.5 mb-6">
                  {offer.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-4 h-4 bg-[#D4AF37] rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    selectedTier === index
                      ? 'bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white shadow-lg'
                      : 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2F2F2F] hover:from-[#B8860B] hover:to-[#D4AF37]'
                  }`}
                  onClick={e => {
                    e.stopPropagation();
                    // You can add booking logic here
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-br from-[#8B4513] to-[#A0522D] rounded-2xl p-8 max-w-4xl mx-auto shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4">Why Choose Our Pricing?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#F5F5DC]">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#2F2F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Transparent Pricing</h4>
                <p className="text-sm">No hidden fees or surprises</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#2F2F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Premium Quality</h4>
                <p className="text-sm">Professional service guaranteed</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-[#2F2F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-2">Satisfaction Guaranteed</h4>
                <p className="text-sm">Your satisfaction is our priority</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
