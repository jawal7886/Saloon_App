import React, { useState, useEffect } from 'react';

const iconClass = "w-5 h-5 inline-block align-text-bottom mr-3 text-[#D4AF37]";

interface ContactInfo {
  business_name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  business_hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  additional_info: string;
}

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    urgency: 'medium',
    appointment_type: 'other',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');

  // Fetch contact information from API
  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact/info');
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      } else {
        console.error('Failed to fetch contact info');
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAnimating(true);
    setError('');

    try {
      const response = await fetch('/api/contact/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setSubmitted(true);
        setForm({
          name: '',
          phone: '',
          email: '',
          subject: '',
          urgency: 'medium',
          appointment_type: 'other',
          message: '',
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsAnimating(false);
    }
  };

  // Default contact info if API fails
  const defaultContactInfo: ContactInfo = {
    business_name: 'Dubai Saloon',
    address: 'Talwandi Bhindran\n12',
    phone: '03212328397',
    email: 'sajawalali7886@gmail.com',
    website: '',
    business_hours: {
      monday: '9:00 AM - 7:00 PM',
      tuesday: '9:00 AM - 7:00 PM',
      wednesday: '9:00 AM - 7:00 PM',
      thursday: '9:00 AM - 8:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '8:00 AM - 6:00 PM',
      sunday: 'CLOSED'
    },
    additional_info: 'Walk ins Welcome'
  };

  const displayContactInfo = contactInfo || defaultContactInfo;

  return (
    <section id="contact" className="relative bg-white py-20 px-4 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold font-serif text-[#2F2F2F] mb-4 tracking-wide">
            Get In <span className="text-[#D4AF37] relative">
              Touch
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full"></div>
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed font-sans">
            Ready for that perfect cut? Reach out to us and let's schedule your appointment at the finest barber shop in town.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Business Info Card */}
            <div className="bg-gradient-to-br from-[#fafafa] to-[#f5f5f5] rounded-2xl p-8 border border-[#D4AF37]/20 shadow-2xl backdrop-blur-sm hover:border-[#D4AF37]/40 transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-3 h-3 bg-[#D4AF37] rounded-full mr-4 animate-pulse"></div>
                <h3 className="text-2xl font-bold text-[#D4AF37] font-serif">{displayContactInfo.business_name}</h3>
              </div>
              
              <div className="space-y-4 font-sans">
                <div className="flex items-start group hover:translate-x-2 transition-transform duration-300">
                  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 1011.314-11.314l-4.243 4.243z" />
                  </svg>
                  <div>
                    <div className="text-[#2F2F2F] leading-relaxed whitespace-pre-line">{displayContactInfo.address}</div>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(displayContactInfo.address)}`} 
                       target="_blank" rel="noopener noreferrer" 
                       className="inline-flex items-center mt-2 text-[#D4AF37] font-semibold hover:text-[#B8860B] transition-colors duration-300">
                      Get Directions
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.3 1.2a2 2 0 01-.45 1.95l-.7.7a16.001 16.001 0 006.36 6.36l.7-.7a2 2 0 011.95-.45l1.2.3A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" />
                  </svg>
                  <div>
                    <a href={`tel:${displayContactInfo.phone.replace(/\D/g, '')}`} className="text-[#2F2F2F] hover:text-[#D4AF37] transition-colors duration-300 text-lg font-medium">
                      {displayContactInfo.phone}
                    </a>
                    <span className="ml-3 bg-[#D4AF37] text-[#1a1a1a] text-xs font-bold px-2 py-1 rounded-full">Text-enabled</span>
                  </div>
                </div>

                <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                  <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <a href={`mailto:${displayContactInfo.email}`} className="text-[#2F2F2F] hover:text-[#D4AF37] transition-colors duration-300">
                    {displayContactInfo.email}
                  </a>
                </div>

                {displayContactInfo.website && (
                  <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                    <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                    <a href={`https://${displayContactInfo.website}`} target="_blank" rel="noopener noreferrer" 
                       className="text-[#2F2F2F] hover:text-[#D4AF37] transition-colors duration-300">
                      {displayContactInfo.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Business Hours Card */}
            <div className="bg-gradient-to-br from-[#fafafa] to-[#f5f5f5] rounded-2xl p-8 border border-[#D4AF37]/20 shadow-2xl backdrop-blur-sm hover:border-[#D4AF37]/40 transition-all duration-300">
              <div className="flex items-center mb-6">
                <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-[#D4AF37] font-serif">Business Hours</h3>
              </div>
              
              <div className="space-y-3">
                {Object.entries(displayContactInfo.business_hours).map(([day, hours], index) => {
                  const isHighlight = day === 'saturday';
                  const isClosed = (hours as string).toUpperCase() === 'CLOSED';
                  const dayLabel = day === 'monday' ? 'Mon' : 
                                 day === 'tuesday' ? 'Tue' : 
                                 day === 'wednesday' ? 'Wed' : 
                                 day === 'thursday' ? 'Thu' : 
                                 day === 'friday' ? 'Fri' : 
                                 day === 'saturday' ? 'Saturday' : 'Sunday';
                  
                  return (
                    <div key={day} className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 ${
                      isHighlight ? 'bg-[#D4AF37]/10 border-l-4 border-[#D4AF37]' : 
                      isClosed ? 'bg-red-900/10 border-l-4 border-red-600' : 'hover:bg-white/5'
                    }`}>
                      <span className={`font-medium ${
                        isHighlight ? 'text-[#D4AF37]' : 
                        isClosed ? 'text-red-400' : 'text-[#2F2F2F]'
                      }`}>
                        {dayLabel}
                      </span>
                      <span className={`font-bold ${
                        isHighlight ? 'text-[#D4AF37]' : 
                        isClosed ? 'text-red-400' : 'text-[#2F2F2F]'
                      }`}>
                        {hours}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-6 border-t border-[#D4AF37]/20">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#D4AF37] font-semibold flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    {displayContactInfo.additional_info}
                  </span>
                </div>
                <p className="text-xs text-[#2F2F2F] mt-2">
                  Holiday hours may vary. <span className="text-[#D4AF37] font-semibold">Check our website for updates.</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <a href="#book" className="group bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-[#D4AF37]/25 transition-all duration-300 text-center transform hover:scale-105 font-sans">
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  BOOK NOW
                </div>
              </a>
              <a href={`tel:${displayContactInfo.phone.replace(/\D/g, '')}`} className="group bg-gradient-to-r from-[#f5f5f5] to-[#fafafa] text-[#D4AF37] font-bold py-4 px-6 rounded-xl border-2 border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all duration-300 text-center transform hover:scale-105 font-sans">
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.3 1.2a2 2 0 01-.45 1.95l-.7.7a16.001 16.001 0 006.36 6.36l.7-.7a2 2 0 011.95-.45l1.2.3A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" />
                  </svg>
                  CALL NOW
                </div>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl shadow-2xl border border-[#D4AF37]/30 p-8 lg:p-10 backdrop-blur-sm font-sans">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-xl flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-[#2F2F2F] font-serif">Send Us a Message</h3>
              </div>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-[#2F2F2F] mb-2">Message Sent Successfully!</h4>
                  <p className="text-[#2F2F2F]">Thank you for contacting us! We'll get back to you within 24 hours.</p>
                  <button 
                    onClick={() => {setSubmitted(false); setForm({name: '', phone: '', email: '', subject: '', urgency: 'medium', appointment_type: 'other', message: ''})}}
                    className="mt-6 text-[#D4AF37] font-semibold hover:text-[#B8860B] transition-colors duration-300"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-[#2F2F2F] font-bold mb-2 text-sm uppercase tracking-wide">Name*</label>
                    <input 
                      type="text" 
                      name="name" 
                      required 
                      value={form.name} 
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#2F2F2F] placeholder-gray-400"
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#2F2F2F] font-bold mb-2 text-sm uppercase tracking-wide">Phone*</label>
                      <input 
                        type="tel" 
                        name="phone" 
                        required 
                        value={form.phone} 
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#2F2F2F] placeholder-gray-400"
                        placeholder={displayContactInfo.phone}
                      />
                    </div>
                    <div>
                      <label className="block text-[#2F2F2F] font-bold mb-2 text-sm uppercase tracking-wide">Email*</label>
                      <input 
                        type="email" 
                        name="email" 
                        required 
                        value={form.email} 
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#2F2F2F] placeholder-gray-400"
                        placeholder={displayContactInfo.email}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#2F2F2F] font-bold mb-2 text-sm uppercase tracking-wide">Subject</label>
                    <input 
                      type="text" 
                      name="subject" 
                      value={form.subject} 
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#2F2F2F] placeholder-gray-400"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#2F2F2F] font-bold mb-2 text-sm uppercase tracking-wide">Urgency</label>
                      <select 
                        name="urgency" 
                        value={form.urgency} 
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#2F2F2F] bg-white"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#2F2F2F] font-bold mb-2 text-sm uppercase tracking-wide">Appointment Type</label>
                      <select 
                        name="appointment_type" 
                        value={form.appointment_type} 
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#2F2F2F] bg-white"
                      >
                        <option value="walk_in">Walk-in</option>
                        <option value="scheduled">Scheduled Appointment</option>
                        <option value="consultation">Consultation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#2F2F2F] font-bold mb-2 text-sm uppercase tracking-wide">Message / Special Requests</label>
                    <textarea 
                      name="message" 
                      value={form.message} 
                      onChange={handleChange}
                      rows={4}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/20 transition-all duration-300 text-[#2F2F2F] placeholder-gray-400 resize-none"
                      placeholder="Tell us about any special requests or preferences..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isAnimating}
                    className="group w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-[#D4AF37]/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center">
                      {isAnimating ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                      {isAnimating ? 'Sending...' : 'Send Message'}
                    </div>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;