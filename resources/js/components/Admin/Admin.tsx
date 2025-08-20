import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import StoreInfo from './StoreInfo';
import Services from './Services';
import Contact from './Contact';
import BarberManagement from './BarberManagement';
import AboutUsAdmin from './about';
import OffersAdmin from './offers';
import Gallery from './gallery';
import AdminAppointments from './appointment';
import POS from './POS/POS';

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
    //{ key: 'BarberManagement', label: 'Barber Management' },
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
            {activeSection !== 'POS' && (
                <Sidebar 
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    onBack={onBack}
                />
            )}
            
            <main className={`flex-1 flex flex-col items-center py-10 px-4 ${activeSection === 'POS' ? 'w-full' : ''}`}>
                <div className={`w-full ${activeSection === 'POS' ? '' : 'max-w-3xl'}`}>
                    {activeSection !== 'POS' && (
                        <>
                            <h1 className="text-3xl font-bold text-[#8B4513] mb-2 flex items-center gap-3">
                                <svg className="w-9 h-9 text-[#D4AF37]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Admin Dashboard
                            </h1>
                            <p className="text-[#D4AF37] mb-8">Manage your salon details</p>
                        </>
                    )}
                    
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${
                            messageType === 'success' 
                                ? 'bg-green-100 border border-green-400 text-green-700' 
                                : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                            {message}
                        </div>
                    )}
                    
                    {/* Only wrap StoreInfo (basic section) in the form */}
                    {activeSection === 'basic' ? (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <StoreInfo 
                                salonDetails={salonDetails}
                                isLoading={isLoading}
                                handleInputChange={handleInputChange}
                                handleSubmit={handleSubmit}
                                getCsrfToken={getCsrfToken}
                            />
                            <div className="flex justify-end mt-6">
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
                        </form>
                    ) : null}

                    {/* Render all other sections outside the form */}
                    {activeSection === 'Services' && (
                        <Services 
                            salonDetails={salonDetails}
                            serviceLoading={serviceLoading}
                            showServiceForm={showServiceForm}
                            editingService={editingService}
                            viewingService={viewingService}
                            deletingService={deletingService}
                            showViewForm={showViewForm}
                            showDeleteForm={showDeleteForm}
                            serviceFormData={serviceFormData}
                            handleAddService={handleAddService}
                            handleEditService={handleEditService}
                            handleViewService={handleViewService}
                            handleDeleteServiceClick={handleDeleteServiceClick}
                            handleDeleteService={handleDeleteService}
                            handleServiceFormChange={handleServiceFormChange}
                            handleServiceSubmit={handleServiceSubmit}
                            toggleServiceStatus={toggleServiceStatus}
                            setShowServiceForm={setShowServiceForm}
                            setEditingService={setEditingService}
                            setShowViewForm={setShowViewForm}
                            setViewingService={setViewingService}
                            setShowDeleteForm={setShowDeleteForm}
                            setDeletingService={setDeletingService}
                        />
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
                        <Gallery salonDetails={salonDetails} />
                    )}
                    {activeSection === 'BarberManagement' && (
                        <BarberManagement getCsrfToken={getCsrfToken} />
                    )}
                    {activeSection === 'Appointments' && (
                        <AdminAppointments />
                    )}
                    {activeSection === 'POS' && (
                        <POS onBack={() => setActiveSection('basic')} />
                    )}
                    {activeSection === 'About Us' && (
                        <AboutUsAdmin />
                    )}
                    {activeSection === 'Contact' && (
                        <Contact 
                            contactInfo={contactInfo}
                            contactMessages={contactMessages}
                            contactLoading={contactLoading}
                            handleContactInfoSubmit={handleContactInfoSubmit}
                            handleContactInputChange={handleContactInputChange}
                            updateMessageStatus={updateMessageStatus}
                            deleteMessage={deleteMessage}
                        />
                    )}
                    {activeSection === 'Offers' && (
                        <OffersAdmin />
                    )}
                </div>
            </main>
        </div>
    );
};

export default Admin;
