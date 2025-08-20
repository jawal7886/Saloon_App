import React, { useState, useEffect } from 'react';

interface AdminProps {
    onBack?: () => void;
}

interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: string;
    category: string;
    image: string;
    isActive: boolean;
}

interface SalonDetails {
    name: string;
    tagLine: string;
    logo: string;
    address: string;
    phone1: string;
    phone2: string;
    email1: string;
    email2: string;
    hours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    description: string;
    socialMedia: {
        facebook: string;
        instagram: string;
        twitter: string;
    };
    services: Service[];
}

const SECTIONS = [
    { key: 'basic', label: 'Store Information' },
    { key: 'Services', label: 'Services' },
    { key: 'Pricing', label: 'Pricing' },
    { key: 'Gallery', label: 'Gallery' },
    { key: 'About Us', label: 'About Us' },
    { key: 'Contact', label: 'Contact' },
];

const API_URL = 'salons';

function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') || '' : '';
}

const Admin = ({ onBack }: AdminProps) => {
    const [salonDetails, setSalonDetails] = useState({
        name: '', tagLine: '', logo: '', address: '', phone1: '', phone2: '', email1: '', email2: '',
        hours: { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
        description: '', socialMedia: { facebook: '', instagram: '', twitter: '' }, services: []
    });
    const [salonId, setSalonId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [activeSection, setActiveSection] = useState('basic');
    
    const [editingService, setEditingService] = useState(null);
    const [viewingService, setViewingService] = useState(null);
    const [deletingService, setDeletingService] = useState(null);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [showViewForm, setShowViewForm] = useState(false);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [serviceLoading, setServiceLoading] = useState(false);
    const [serviceFormData, setServiceFormData] = useState({
        name: '',
        category: '',
        price: '',
        duration: '',
        image: '',
        description: '',
        isActive: true
    });

    // Contact Management State
    const [contactInfo, setContactInfo] = useState({
        business_name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        business_hours: {
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',
            sunday: ''
        },
        additional_info: ''
    });
    const [contactMessages, setContactMessages] = useState([]);
    const [contactLoading, setContactLoading] = useState(false);

    useEffect(() => {
        fetchSalonDetails();
        fetchContactInfo();
        fetchContactMessages();
    }, []);

    const fetchSalonDetails = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/${API_URL}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                } as HeadersInit,
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    const salon = data[0];
                    // Fetch services from backend
                    const servicesRes = await fetch('/api/services', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        } as HeadersInit,
                    });
                    let services = [];
                    if (servicesRes.ok) {
                        const servicesData = await servicesRes.json();
                        // Transform the database structure to match frontend expectations
                        services = servicesData.map((service: any) => ({
                            id: service.id.toString(),
                            name: service.name,
                            description: service.description || '',
                            price: parseFloat(service.price),
                            duration: service.duration,
                            category: service.category,
                            image: service.image || '',
                            isActive: service.is_active || service.isActive || true
                        }));
                    }
                    setSalonId(salon.id);
                    setSalonDetails({
                        name: salon.name || '',
                        tagLine: salon.tag_line || '',
                        logo: salon.logo || '',
                        address: salon.address || '',
                        phone1: salon.phone1 || '',
                        phone2: salon.phone2 || '',
                        email1: salon.email1 || '',
                        email2: salon.email2 || '',
                        hours: salon.hours ? JSON.parse(salon.hours) : { monday: '', tuesday: '', wednesday: '', thursday: '', friday: '', saturday: '', sunday: '' },
                        description: salon.description || '',
                        socialMedia: salon.social_media ? JSON.parse(salon.social_media) : { facebook: '', instagram: '', twitter: '' },
                        services: services // <-- Set fetched services here!
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching salon details:', error);
            setMessage('Error loading salon details');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setSalonDetails(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setSalonDetails(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const payload = {
                name: salonDetails.name,
                tag_line: salonDetails.tagLine,
                logo: salonDetails.logo,
                address: salonDetails.address,
                phone1: salonDetails.phone1,
                phone2: salonDetails.phone2,
                email1: salonDetails.email1,
                email2: salonDetails.email2,
                description: salonDetails.description,
                social_media: JSON.stringify(salonDetails.socialMedia),
                hours: JSON.stringify(salonDetails.hours)
            };

            const url = salonId ? `/api/${API_URL}/${salonId}` : `/api/${API_URL}`;
            const method = salonId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                } as HeadersInit,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                if (!salonId) {
                    setSalonId(data.id);
                }
                setMessage(salonId ? 'Salon details updated successfully!' : 'Salon details added successfully!');
                setMessageType('success');
                
                setTimeout(() => {
                    setMessage('');
                    setMessageType('success');
                }, 3000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Error saving salon details');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Error saving salon details:', error);
            setMessage('Error saving salon details');
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const generateServiceId = () => {
        return 'service_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    const handleAddService = () => {
        setEditingService(null);
        setServiceFormData({
            name: '',
            category: '',
            price: '',
            duration: '',
            image: '',
            description: '',
            isActive: true
        });
        setShowServiceForm(true);
    };

    const handleEditService = (service: Service) => {
        console.log('Edit service called with:', service);
        setEditingService(service);
        setServiceFormData({
            name: service.name,
            category: service.category,
            price: service.price.toString(),
            duration: service.duration,
            image: service.image,
            description: service.description,
            isActive: service.isActive
        });
        setShowServiceForm(true);
    };

    const handleViewService = (service: Service) => {
        setViewingService(service);
        setShowViewForm(true);
    };

    const handleDeleteServiceClick = (service: Service) => {
        setDeletingService(service);
        setShowDeleteForm(true);
    };

    const handleDeleteService = async (serviceId: string) => {
        setServiceLoading(true);
        try {
            console.log('Deleting service:', serviceId);
            
            const response = await fetch(`/api/services/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                } as HeadersInit,
            });

            console.log('Delete response status:', response.status);

            if (response.ok) {
                // Refresh the services list
                await fetchSalonDetails();
                setMessage('Service deleted successfully!');
                setMessageType('success');
                
                // Clear message after 3 seconds
                setTimeout(() => {
                    setMessage('');
                }, 3000);
                
                // Close the delete form
                setShowDeleteForm(false);
                setDeletingService(null);
            } else {
                const errorData = await response.json();
                console.log('Delete error:', errorData);
                setMessage(errorData.error || errorData.message || 'Error deleting service');
                setMessageType('error');
                
                // Clear error message after 5 seconds
                setTimeout(() => {
                    setMessage('');
                }, 5000);
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            setMessage('Error deleting service');
            setMessageType('error');
            
            // Clear error message after 5 seconds
            setTimeout(() => {
                setMessage('');
            }, 5000);
        } finally {
            setServiceLoading(false);
        }
    };

    const handleServiceFormChange = (field: string, value: any) => {
        setServiceFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleServiceSubmit = async (e?: any) => {
        if (e) {
            e.preventDefault();
        }
        setServiceLoading(true);
        
        // Validate required fields
        const { name, price, duration, category } = serviceFormData;
        
        if (!name || !price || !duration || !category) {
            setMessage('Please fill in all required fields');
            setMessageType('error');
            setServiceLoading(false);
            return;
        }
        
        // Validate price is a valid number
        const priceValue = parseFloat(price);
        if (isNaN(priceValue) || priceValue < 0) {
            setMessage('Please enter a valid price');
            setMessageType('error');
            setServiceLoading(false);
            return;
        }
        
        // Check if salonId is available
        if (!salonId) {
            setMessage('Salon information not loaded. Please refresh the page.');
            setMessageType('error');
            setServiceLoading(false);
            return;
        }
        
        const serviceData = {
            name: name.trim(),
            description: serviceFormData.description || '',
            price: priceValue,
            duration: duration.trim(),
            category: category.trim(),
            image: serviceFormData.image || '',
            is_active: serviceFormData.isActive,
            salon_id: salonId
        };

        try {
            let response;
            if (editingService) {
                // Update existing service
                response = await fetch(`/api/services/${editingService.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    } as HeadersInit,
                    body: JSON.stringify(serviceData)
                });
            } else {
                // Create new service
                response = await fetch('/api/services', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    } as HeadersInit,
                    body: JSON.stringify(serviceData)
                });
            }

            if (response.ok) {
                const savedService = await response.json();
                
                // Show success message
                setMessage(editingService ? 'Service updated successfully!' : 'Service added successfully!');
                setMessageType('success');
                
                // Refresh the services list
                await fetchSalonDetails();
                
                // Close the form modal
                setShowServiceForm(false);
                setEditingService(null);
                
                // Clear message after 3 seconds
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            } else {
                const responseText = await response.text();
                
                let errorData;
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    errorData = { error: 'Invalid response from server' };
                }
                
                let errorMessage = 'Error saving service';
                
                if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.details) {
                    // Handle validation errors
                    const validationErrors = Object.values(errorData.details).flat();
                    errorMessage = validationErrors.join(', ');
                }
                
                setMessage(errorMessage);
                setMessageType('error');
                
                // Clear error message after 5 seconds
                setTimeout(() => {
                    setMessage('');
                }, 5000);
            }
        } catch (error) {
            console.error('Error saving service:', error);
            setMessage('Error saving service');
            setMessageType('error');
            
            // Clear error message after 5 seconds
            setTimeout(() => {
                setMessage('');
            }, 5000);
        } finally {
            setServiceLoading(false);
        }
    };

    const toggleServiceStatus = async (serviceId: string) => {
        setServiceLoading(true);
        try {
            const service = salonDetails.services.find(s => s.id === serviceId);
            if (!service) return;

            const response = await fetch(`/api/services/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                } as HeadersInit,
                body: JSON.stringify({
                    is_active: !service.isActive
                })
            });

            if (response.ok) {
                // Refresh the services list
                await fetchSalonDetails();
                setMessage('Service status updated successfully!');
                setMessageType('success');
                
                // Clear message after 3 seconds
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || errorData.message || 'Error updating service status');
                setMessageType('error');
                
                // Clear error message after 5 seconds
                setTimeout(() => {
                    setMessage('');
                }, 5000);
            }
        } catch (error) {
            console.error('Error updating service status:', error);
            setMessage('Error updating service status');
            setMessageType('error');
            
            // Clear error message after 5 seconds
            setTimeout(() => {
                setMessage('');
            }, 5000);
        } finally {
            setServiceLoading(false);
        }
    };

    // Contact Management Functions
    const fetchContactInfo = async () => {
        try {
            const response = await fetch('/api/contact/info', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                } as HeadersInit,
            });

            if (response.ok) {
                const data = await response.json();
                setContactInfo(data);
            } else {
                console.error('Failed to fetch contact info:', response.status);
            }
        } catch (error) {
            console.error('Error fetching contact info:', error);
        }
    };

    const fetchContactMessages = async () => {
        try {
            const response = await fetch('/api/contact/messages', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                } as HeadersInit,
            });

            if (response.ok) {
                const data = await response.json();
                setContactMessages(data);
            }
        } catch (error) {
            console.error('Error fetching contact messages:', error);
        }
    };

    const handleContactInfoSubmit = async (e: any) => {
        alert('Form submission function called!'); // Test alert
        console.log('Form submission started');
        e.preventDefault(); // Prevent default form submission
        e.stopPropagation(); // Stop event bubbling
        
        console.log('Contact info to submit:', contactInfo);
        console.log('CSRF Token:', getCsrfToken());
        
        setContactLoading(true);
        setMessage('');

        try {
            console.log('Making API call to /api/contact/info');
            const response = await fetch('/api/contact/info', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // Temporarily removing CSRF token to test
                    // 'X-CSRF-TOKEN': getCsrfToken(),
                } as HeadersInit,
                body: JSON.stringify(contactInfo)
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('Update successful:', result);
                setMessage('Contact information updated successfully!');
                setMessageType('success');
                
                // Refresh the contact info to get the latest data
                await fetchContactInfo();
                
                setTimeout(() => setMessage(''), 3000);
            } else {
                const errorData = await response.json();
                console.log('Update failed:', errorData);
                setMessage(errorData.error || 'Error updating contact information');
                setMessageType('error');
                setTimeout(() => setMessage(''), 5000);
            }
        } catch (error) {
            console.error('Error updating contact info:', error);
            setMessage('Error updating contact information');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
        } finally {
            setContactLoading(false);
        }
    };

    const handleContactInputChange = (field: string, value: string) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setContactInfo(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setContactInfo(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const updateMessageStatus = async (messageId: string, status: string) => {
        try {
            const response = await fetch(`/api/contact/messages/${messageId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                } as HeadersInit,
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                await fetchContactMessages();
                setMessage('Message status updated successfully!');
                setMessageType('success');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error updating message status:', error);
            setMessage('Error updating message status');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
        }
    };

    const deleteMessage = async (messageId: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const response = await fetch(`/api/contact/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                } as HeadersInit,
            });

            if (response.ok) {
                await fetchContactMessages();
                setMessage('Message deleted successfully!');
                setMessageType('success');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            setMessage('Error deleting message');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
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
            
            <main className="flex-1 flex flex-col items-center py-10 px-4">
                <div className="w-full max-w-3xl">
                    <h1 className="text-3xl font-bold text-[#8B4513] mb-2 flex items-center gap-3">
                        <svg className="w-9 h-9 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Dashboard
                    </h1>
                    <p className="text-[#D4AF37] mb-8">Manage your salon details</p>
                    
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${
                            messageType === 'success' 
                                ? 'bg-green-100 border border-green-400 text-green-700' 
                                : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {activeSection === 'basic' && (
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="flex items-center space-x-3">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
                                            <span className="text-gray-600 font-medium">Loading salon details...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                            <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            Store Information
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                                                <input
                                                    type="text"
                                                    value={salonDetails.name}
                                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Enter store name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Tag Line</label>
                                                <input
                                                    type="text"
                                                    value={salonDetails.tagLine}
                                                    onChange={(e) => handleInputChange('tagLine', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Enter tag line or slogan"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Phone</label>
                                                <input
                                                    type="tel"
                                                    value={salonDetails.phone1}
                                                    onChange={(e) => handleInputChange('phone1', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Enter primary phone number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Phone</label>
                                                <input
                                                    type="tel"
                                                    value={salonDetails.phone2}
                                                    onChange={(e) => handleInputChange('phone2', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Enter secondary phone number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Email</label>
                                                <input
                                                    type="email"
                                                    value={salonDetails.email1}
                                                    onChange={(e) => handleInputChange('email1', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Enter primary email address"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Email</label>
                                                <input
                                                    type="email"
                                                    value={salonDetails.email2}
                                                    onChange={(e) => handleInputChange('email2', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Enter secondary email address"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                                <input
                                                    type="text"
                                                    value={salonDetails.address}
                                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Enter full address"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Salon Logo (Image URL):</label>
                                                {/* File upload for logo only */}
                                                <label className="block mb-2 font-semibold">Upload Logo:</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async e => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const formData = new FormData();
                                                            formData.append('logo', file);
                                                            const response = await fetch('/upload-logo', {
                                                                method: 'POST',
                                                                body: formData,
                                                                headers: {
                                                                    'X-CSRF-TOKEN': getCsrfToken(),
                                                                },
                                                            });
                                                            const data = await response.json();
                                                            if (data.url) {
                                                                setSalonDetails({ ...salonDetails, logo: data.url });
                                                            } else {
                                                                alert('Image upload failed');
                                                            }
                                                        }
                                                    }}
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                                {salonDetails.logo && (
                                                    <div className="mt-4">
                                                        <span className="block text-sm text-gray-600 mb-1">Current Logo:</span>
                                                        <img src={salonDetails.logo} alt="Logo Preview" className="h-20 rounded border" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        
                        {activeSection === 'Services' && (
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                {/* 
                                    Service Management Section
                                    Features:
                                    - Add new services with validation
                                    - Edit existing services
                                    - View service details in modal
                                    - Delete services with confirmation
                                    - Toggle service active/inactive status
                                    - Real-time updates and error handling
                                */}
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                        <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        Services Management
                                    </h2>
                                    <button
                                        onClick={handleAddService}
                                        className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Add Service
                                    </button>
                                </div>

                                {showServiceForm && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {editingService ? 'Edit Service' : 'Add New Service'}
                                                </h3>
                                                <button
                                                    onClick={() => {
                                                        setShowServiceForm(false);
                                                        setEditingService(null);
                                                        setServiceFormData({
                                                            name: '',
                                                            category: '',
                                                            price: '',
                                                            duration: '',
                                                            image: '',
                                                            description: '',
                                                            isActive: true
                                                        });
                                                    }}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <form 
                                                id="serviceForm"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    e.stopImmediatePropagation();
                                                    handleServiceSubmit(e);
                                                    return false;
                                                }}
                                                className="space-y-4" 
                                                noValidate
                                                action="javascript:void(0)"
                                                method="POST"
                                            >

                                                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <p className="text-sm text-blue-700">
                                                        <span className="text-red-500">*</span> Required fields
                                                    </p>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Service Name <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={serviceFormData.name}
                                                            onChange={(e) => handleServiceFormChange('name', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                            placeholder="Enter service name"
                                                            required
                                                            minLength={2}
                                                            maxLength={255}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Category <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={serviceFormData.category}
                                                            onChange={(e) => handleServiceFormChange('category', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                            placeholder="e.g., Haircut, Beard, Spa"
                                                            required
                                                            minLength={2}
                                                            maxLength={255}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Price ($) <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={serviceFormData.price}
                                                            onChange={(e) => handleServiceFormChange('price', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                            placeholder="0.00"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Duration <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={serviceFormData.duration}
                                                            onChange={(e) => handleServiceFormChange('duration', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                            placeholder="e.g., 30 min, 1 hour"
                                                            required
                                                            minLength={2}
                                                            maxLength={255}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                                        <input
                                                            type="url"
                                                            value={serviceFormData.image}
                                                            onChange={(e) => handleServiceFormChange('image', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                            placeholder="Enter image URL"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                                        <textarea
                                                            rows={3}
                                                            value={serviceFormData.description}
                                                            onChange={(e) => handleServiceFormChange('description', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                            placeholder="Describe the service..."
                                                            maxLength={1000}
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={serviceFormData.isActive}
                                                                onChange={(e) => handleServiceFormChange('isActive', e.target.checked)}
                                                                className="mr-2 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                                                            />
                                                            <span className="text-sm font-medium text-gray-700">Active Service</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-3 pt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setShowServiceForm(false);
                                                            setEditingService(null);
                                                            setServiceFormData({
                                                                name: '',
                                                                category: '',
                                                                price: '',
                                                                duration: '',
                                                                image: '',
                                                                description: '',
                                                                isActive: true
                                                            });
                                                        }}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={serviceLoading}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            handleServiceSubmit(e);
                                                        }}
                                                        className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {serviceLoading ? (
                                                            <>
                                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                {editingService ? 'Updating...' : 'Adding...'}
                                                            </>
                                                        ) : (
                                                            editingService ? 'Update Service' : 'Add Service'
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {/* View Service Form Modal */}
                                {showViewForm && viewingService && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Service Details
                                                </h3>
                                                <button
                                                    onClick={() => {
                                                        setShowViewForm(false);
                                                        setViewingService(null);
                                                    }}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-6">
                                                {/* Service Image */}
                                                {viewingService.image && (
                                                    <div className="text-center">
                                                        <img 
                                                            src={viewingService.image} 
                                                            alt={viewingService.name}
                                                            className="w-full max-w-md h-48 object-cover rounded-lg mx-auto"
                                                        />
                                                    </div>
                                                )}
                                                
                                                {/* Service Information */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                                                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                                            {viewingService.name}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                                            {viewingService.category}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                                            ${viewingService.price}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                                                            {viewingService.duration}
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 min-h-[60px]">
                                                            {viewingService.description || 'No description available'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                viewingService.isActive 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {viewingService.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Service ID</label>
                                                        <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 font-mono text-sm">
                                                            {viewingService.id}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Action Buttons */}
                                                <div className="flex justify-end gap-3 pt-4 border-t">
                                                    <button
                                                        onClick={() => {
                                                            setShowViewForm(false);
                                                            setViewingService(null);
                                                        }}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        Close
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowViewForm(false);
                                                            setViewingService(null);
                                                            handleEditService(viewingService);
                                                        }}
                                                        className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                                                    >
                                                        Edit Service
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Delete Service Confirmation Modal */}
                                {showDeleteForm && deletingService && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                    Delete Service
                                                </h3>
                                                <button
                                                    onClick={() => {
                                                        setShowDeleteForm(false);
                                                        setDeletingService(null);
                                                    }}
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                {/* Service Preview */}
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <div className="flex items-center gap-3">
                                                        {deletingService.image && (
                                                            <img 
                                                                src={deletingService.image} 
                                                                alt={deletingService.name}
                                                                className="w-16 h-16 object-cover rounded-lg"
                                                            />
                                                        )}
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{deletingService.name}</h4>
                                                            <p className="text-sm text-gray-600">{deletingService.category}</p>
                                                            <p className="text-sm text-gray-600">${deletingService.price} • {deletingService.duration}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                        </svg>
                                                        <div>
                                                            <h4 className="font-medium text-red-800">Warning</h4>
                                                            <p className="text-sm text-red-700 mt-1">
                                                                Are you sure you want to delete "{deletingService.name}"? This action cannot be undone and will permanently remove the service from your salon.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Action Buttons */}
                                                <div className="flex justify-end gap-3 pt-4">
                                                    <button
                                                        onClick={() => {
                                                            setShowDeleteForm(false);
                                                            setDeletingService(null);
                                                        }}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteService(deletingService.id)}
                                                        disabled={serviceLoading}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {serviceLoading ? (
                                                            <>
                                                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Deleting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                Delete Service
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    {salonDetails.services.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            <p className="text-lg font-medium">No services added yet</p>
                                            <p className="text-sm">Click "Add Service" to get started</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {salonDetails.services.map((service) => (
                                                <div
                                                    key={service.id}
                                                    className="relative rounded-xl overflow-hidden shadow-lg group flex flex-col justify-end min-h-[220px] h-full"
                                                    style={{
                                                        backgroundImage: `url(${service.image || '/assets/placeholder.jpg'})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                    }}
                                                >
                                                    {/* Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity group-hover:opacity-90"></div>
                                                    
                                                    {/* Default state - just service name */}
                                                    <div className="absolute bottom-4 left-4 right-4 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                                                        <h3 className="text-white font-bold text-lg drop-shadow">{service.name}</h3>
                                                    </div>
                                                    {/* Admin action buttons */}
                                                    <div className="absolute top-2 right-2 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleViewService(service);
                                                            }}
                                                            disabled={serviceLoading}
                                                            className="bg-white/90 hover:bg-blue-500 text-blue-500 hover:text-white rounded-full p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                                            title="View Service Details"
                                                        >
                                                            {serviceLoading ? (
                                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleEditService(service);
                                                            }}
                                                            disabled={serviceLoading}
                                                            className="bg-white/90 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-white rounded-full p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                                            title="Edit Service"
                                                        >
                                                            {serviceLoading ? (
                                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleDeleteServiceClick(service);
                                                            }}
                                                            disabled={serviceLoading}
                                                            className="bg-white/90 hover:bg-red-500 text-red-500 hover:text-white rounded-full p-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                                            title="Delete Service"
                                                        >
                                                            {serviceLoading ? (
                                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    </div>
                                                    {/* Card content - only visible on hover */}
                                                    <div className="relative z-10 p-4 flex flex-col justify-end h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <h3 className="text-white font-bold text-lg mb-1 drop-shadow">{service.name}</h3>
                                                        <p className="text-white text-sm mb-2 drop-shadow">{service.category}</p>
                                                        <p className="text-white text-xs mb-2">{service.description}</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[#D4AF37] font-semibold">${service.price}</span>
                                                            <span className="text-white text-xs ml-2">{service.duration}</span>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    toggleServiceStatus(service.id);
                                                                }}
                                                                disabled={serviceLoading}
                                                                className={`ml-2 px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                                                            >
                                                                {serviceLoading ? (
                                                                    <svg className="w-3 h-3 animate-spin inline" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                ) : (
                                                                    service.isActive ? 'Active' : 'Inactive'
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        {activeSection === 'Pricing' && (
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    Pricing Management
                                </h2>
                                <p className="text-gray-600">Pricing management section coming soon...</p>
                            </div>
                        )}
                        
                        {activeSection === 'Gallery' && (
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Gallery Management
                                </h2>
                                <p className="text-gray-600">Gallery management section coming soon...</p>
                            </div>
                        )}
                        
                        {activeSection === 'About Us' && (
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    About Us Management
                                </h2>
                                <p className="text-gray-600">About Us management section coming soon...</p>
                            </div>
                        )}
                        
                        {activeSection === 'Contact' && (
                            <div className="space-y-8">
                                {/* Contact Information Management */}
                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                        Contact Information
                                </h2>
                                    
                                    <form onSubmit={handleContactInfoSubmit} className="space-y-6" noValidate>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                                <input
                                                    type="text"
                                                    value={contactInfo.business_name}
                                                    onChange={(e) => handleContactInputChange('business_name', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Enter business name"
                                                />
                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={contactInfo.phone}
                                                    onChange={(e) => handleContactInputChange('phone', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={contactInfo.email}
                                                    onChange={(e) => handleContactInputChange('email', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Enter email address"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                                <input
                                                    type="url"
                                                    value={contactInfo.website}
                                                    onChange={(e) => handleContactInputChange('website', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Enter website URL"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                                <textarea
                                                    value={contactInfo.address}
                                                    onChange={(e) => handleContactInputChange('address', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                    placeholder="Enter full address"
                                                />
                                            </div>
                                        </div>

                                        {/* Business Hours */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Hours</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Object.entries(contactInfo.business_hours).map(([day, hours]) => (
                                                    <div key={day}>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{day}</label>
                                                        <input
                                                            type="text"
                                                            value={hours}
                                                            onChange={(e) => handleContactInputChange(`business_hours.${day}`, e.target.value)}
                                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                            placeholder="e.g., 9:00 AM - 7:00 PM"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                                            <textarea
                                                value={contactInfo.additional_info}
                                                onChange={(e) => handleContactInputChange('additional_info', e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                placeholder="e.g., Walk ins Welcome"
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                onClick={(e) => {
                                                    alert('Button clicked!'); // Test alert
                                                    e.preventDefault();
                                                    handleContactInfoSubmit(e);
                                                }}
                                                disabled={contactLoading}
                                                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                            >
                                                {contactLoading ? (
                                                    <>
                                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    'Update Contact Information'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Contact Messages Management */}
                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                        <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        Contact Messages
                                    </h2>

                                    {contactMessages.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <p className="text-lg font-medium">No messages yet</p>
                                            <p className="text-sm">Messages from the contact form will appear here</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {contactMessages.map((message: any) => (
                                                <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">{message.name}</h3>
                                                            <p className="text-sm text-gray-600">{message.email} • {message.phone}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                message.status === 'unread' ? 'bg-red-100 text-red-800' :
                                                                message.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-green-100 text-green-800'
                                                            }`}>
                                                                {message.status}
                                                            </span>
                                                            <button
                                                                onClick={() => deleteMessage(message.id)}
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                                title="Delete message"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    
                                                    {message.subject && (
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            <span className="font-medium">Subject:</span> {message.subject}
                                                        </p>
                                                    )}
                                                    
                                                    <div className="flex gap-4 mb-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            message.urgency === 'high' ? 'bg-red-100 text-red-800' :
                                                            message.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {message.urgency} priority
                                                        </span>
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {message.appointment_type}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="text-gray-700 mb-3">{message.message}</p>
                                                    
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(message.created_at).toLocaleString()}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            {message.status !== 'read' && (
                                                                <button
                                                                    onClick={() => updateMessageStatus(message.id, 'read')}
                                                                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                                                                >
                                                                    Mark as Read
                                                                </button>
                                                            )}
                                                            {message.status !== 'replied' && (
                                                                <button
                                                                    onClick={() => updateMessageStatus(message.id, 'replied')}
                                                                    className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                                                                >
                                                                    Mark as Replied
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </form>
                    
                    {/* Contact section - outside main form */}
                    {activeSection === 'Contact' && (
                        <div className="space-y-8">
                            {/* Contact Information Management */}
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contact Information
                                </h2>
                                
                                <form onSubmit={handleContactInfoSubmit} className="space-y-6" noValidate>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                                            <input
                                                type="text"
                                                value={contactInfo.business_name}
                                                onChange={(e) => handleContactInputChange('business_name', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                placeholder="Enter business name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={contactInfo.phone}
                                                onChange={(e) => handleContactInputChange('phone', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                placeholder="Enter phone number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={contactInfo.email}
                                                onChange={(e) => handleContactInputChange('email', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                            <input
                                                type="url"
                                                value={contactInfo.website}
                                                onChange={(e) => handleContactInputChange('website', e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                placeholder="Enter website URL"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                            <textarea
                                                value={contactInfo.address}
                                                onChange={(e) => handleContactInputChange('address', e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                placeholder="Enter full address"
                                            />
                                        </div>
                                    </div>

                                    {/* Business Hours */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Hours</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(contactInfo.business_hours).map(([day, hours]) => (
                                                <div key={day}>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{day}</label>
                                                    <input
                                                        type="text"
                                                        value={hours}
                                                        onChange={(e) => handleContactInputChange(`business_hours.${day}`, e.target.value)}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                        placeholder="e.g., 9:00 AM - 7:00 PM"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Information</label>
                                        <textarea
                                            value={contactInfo.additional_info}
                                            onChange={(e) => handleContactInputChange('additional_info', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                            placeholder="e.g., Walk ins Welcome"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            onClick={(e) => {
                                                alert('Button clicked!'); // Test alert
                                                e.preventDefault();
                                                handleContactInfoSubmit(e);
                                            }}
                                            disabled={contactLoading}
                                            className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {contactLoading ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Updating...
                                                </>
                                            ) : (
                                                'Update Contact Information'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Contact Messages Management */}
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Contact Messages
                                </h2>

                                {contactMessages.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <p className="text-lg font-medium">No messages yet</p>
                                        <p className="text-sm">Messages from the contact form will appear here</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {contactMessages.map((message: any) => (
                                            <div key={message.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{message.name}</h3>
                                                        <p className="text-sm text-gray-600">{message.email} • {message.phone}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            message.status === 'unread' ? 'bg-red-100 text-red-800' :
                                                            message.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {message.status}
                                                        </span>
                                                        <button
                                                            onClick={() => deleteMessage(message.id)}
                                                            className="text-red-500 hover:text-red-700 transition-colors"
                                                            title="Delete message"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {message.subject && (
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        <span className="font-medium">Subject:</span> {message.subject}
                                                    </p>
                                                )}
                                                
                                                <div className="flex gap-4 mb-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        message.urgency === 'high' ? 'bg-red-100 text-red-800' :
                                                        message.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                        {message.urgency} priority
                                                    </span>
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {message.appointment_type}
                                                    </span>
                                                </div>
                                                
                                                <p className="text-gray-700 mb-3">{message.message}</p>
                                                
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(message.created_at).toLocaleString()}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        {message.status !== 'read' && (
                                                            <button
                                                                onClick={() => updateMessageStatus(message.id, 'read')}
                                                                className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                                                            >
                                                                Mark as Read
                                                            </button>
                                                        )}
                                                        {message.status !== 'replied' && (
                                                            <button
                                                                onClick={() => updateMessageStatus(message.id, 'replied')}
                                                                className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                                                            >
                                                                Mark as Replied
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* Main form submit button - only show for non-contact sections */}
                    {activeSection !== 'Contact' && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] hover:from-[#B8941F] hover:to-[#A0851A] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Admin;

