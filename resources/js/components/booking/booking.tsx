import React, { useState } from 'react';
import axios from 'axios';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  barber: string;
  notes: string;
}

interface BookingProps {
  isOpen: boolean;
  onClose: () => void;
  onRequireLogin: (action?: () => void) => void;
  isLoggedIn: boolean;
}

const services = [
  { id: 'basic-cut', name: 'Basic Cut', price: 25, duration: '20 min' },
  { id: 'premium-cut', name: 'Premium Cut', price: 35, duration: '40 min' },
  { id: 'luxury-package', name: 'Luxury Package', price: 55, duration: '60 min' },
  { id: 'vip-experience', name: 'VIP Experience', price: 85, duration: '75 min' },
  { id: 'beard-trim', name: 'Beard Trim', price: 15, duration: '15 min' },
  { id: 'hair-color', name: 'Hair Color', price: 45, duration: '90 min' },
  { id: 'spa-treatment', name: 'Spa Treatment', price: 30, duration: '30 min' },
  { id: 'head-massage', name: 'Head Massage', price: 20, duration: '20 min' }
];

const barbers = [
  { id: 'mike', name: 'Mike Johnson', specialty: 'Classic Cuts' },
  { id: 'david', name: 'David Smith', specialty: 'Modern Styles' },
  { id: 'james', name: 'James Wilson', specialty: 'Beard Specialist' },
  { id: 'robert', name: 'Robert Brown', specialty: 'Hair Color Expert' }
];

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

interface BookingAllProps extends BookingProps {
  onLoginAndBook?: (action: () => void) => void;
}

const Booking = ({ isOpen, onClose, onRequireLogin, isLoggedIn, onLoginAndBook }: BookingAllProps) => {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    time: '',
    barber: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<BookingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingFormData> = {};
    const missingFields: string[] = [];

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      missingFields.push('Name');
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      missingFields.push('Email');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      missingFields.push('Valid Email');
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
      missingFields.push('Phone Number');
    }
    if (!formData.service) {
      newErrors.service = 'Please select a service';
      missingFields.push('Service');
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
      missingFields.push('Date');
    }
    if (!formData.time) {
      newErrors.time = 'Please select a time';
      missingFields.push('Time');
    }
    if (!formData.barber) {
      newErrors.barber = 'Please select a barber';
      missingFields.push('Barber');
    }

    setErrors(newErrors);
    
    // Show alert if there are missing fields
    if (missingFields.length > 0) {
      const alertMessage = `Please fill in the following required fields:\n\n${missingFields.join('\n')}`;
      alert(alertMessage);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      if (!isLoggedIn && onLoginAndBook) {
        // Ask for login, then retry booking after login
        onLoginAndBook(() => submitBooking());
      } else {
        submitBooking();
      }
    } else {
      // Scroll to the first error field
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        appointment_date: formData.date,
        appointment_time: formData.time,
        barber: formData.barber,
        notes: formData.notes,
      };

      const { data } = await axios.post('/api/appointments', payload);

      alert(data?.message || `Booking confirmed! We'll see you on ${formData.date} at ${formData.time}.`);
      handleClose();
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message;
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors) {
        // Map API validation errors back to form
        const mapped: Partial<BookingFormData> = {};
        const mapKey = (key: string): keyof BookingFormData => {
          if (key === 'appointment_date') return 'date';
          if (key === 'appointment_time') return 'time';
          return (key as keyof BookingFormData);
        };
        Object.keys(apiErrors).forEach((key) => {
          const targetKey = mapKey(key);
          const messages = apiErrors[key];
          const first = Array.isArray(messages) ? messages[0] : String(messages);
          mapped[targetKey] = first;
        });
        setErrors(mapped);
      }
      alert(apiMessage || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      date: '',
      time: '',
      barber: '',
      notes: ''
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // Book up to 30 days in advance
    return maxDate.toISOString().split('T')[0];
  };

  const selectedService = services.find(s => s.id === formData.service);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B4513] to-[#A0522D] text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Book Your Appointment</h2>
            <button
              onClick={handleClose}
              className="text-white hover:text-[#D4AF37] transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-[#F5F5DC] mt-2">Choose your service and preferred time slot</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Please complete the following required fields:
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.keys(errors).map((field) => (
                        <li key={field}>{errors[field as keyof BookingFormData]}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Date *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        min={getMinDate()}
                        max={getMaxDate()}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors ${
                          errors.date ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Time *
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) => handleInputChange('time', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors ${
                          errors.time ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Choose a time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Additional Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                      placeholder="Any special requests or notes..."
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Service Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Select Service *</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.service === service.id
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                            : 'border-gray-200 hover:border-[#D4AF37]/50'
                        }`}
                        onClick={() => handleInputChange('service', service.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{service.name}</h4>
                            <p className="text-sm text-gray-600">{service.duration}</p>
                          </div>
                          <span className="text-lg font-bold text-[#D4AF37]">${service.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                </div>

                {/* Barber Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Select Barber *</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {barbers.map((barber) => (
                      <div
                        key={barber.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.barber === barber.id
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                            : 'border-gray-200 hover:border-[#D4AF37]/50'
                        }`}
                        onClick={() => handleInputChange('barber', barber.id)}
                      >
                        <h4 className="font-semibold text-gray-900">{barber.name}</h4>
                        <p className="text-sm text-gray-600">{barber.specialty}</p>
                      </div>
                    ))}
                  </div>
                  {errors.barber && <p className="text-red-500 text-sm mt-1">{errors.barber}</p>}
                </div>

                {/* Summary */}
                {selectedService && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Booking Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Service:</span> {selectedService.name}</p>
                        <p><span className="font-medium">Duration:</span> {selectedService.duration}</p>
                        <p><span className="font-medium">Price:</span> ${selectedService.price}</p>
                        {formData.date && <p><span className="font-medium">Date:</span> {formData.date}</p>}
                        {formData.time && <p><span className="font-medium">Time:</span> {formData.time}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white rounded-lg font-semibold hover:from-[#B8860B] hover:to-[#D4AF37] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Booking...
                  </div>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Booking;
