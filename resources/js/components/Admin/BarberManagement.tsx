import React, { useState, useEffect } from 'react';

interface Barber {
    id: string;
    name: string;
    title: string;
    experience: string;
    specialty: string;
    image: string;
    isActive: boolean;
    bio?: string;
    social_media?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
}

interface BarberManagementProps {
    getCsrfToken: () => string;
}

const BarberManagement: React.FC<BarberManagementProps> = ({ getCsrfToken }) => {
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');
    
    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingBarber, setEditingBarber] = useState<Barber | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        experience: '',
        specialty: '',
        image: '',
        bio: '',
        isActive: true,
        social_media: {
            instagram: '',
            facebook: '',
            twitter: ''
        }
    });

    const resolveImageSrc = (image: string | undefined | null): string => {
        if (!image) return '';
        if (image.startsWith('data:image')) return image;
        if (image.startsWith('http')) {
            try {
                const u = new URL(image);
                if (u.pathname.startsWith('/storage/')) {
                    return `${window.location.origin}${u.pathname}`;
                }
                return image;
            } catch {
                return image;
            }
        }
        if (image.startsWith('/')) return `${window.location.origin}${image}`;
        if (image.includes('storage/')) return `${window.location.origin}/${image.replace(/^\/+/, '')}`;
        return image;
    };

    useEffect(() => {
        fetchBarbers();
    }, []);

    const fetchBarbers = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/barbers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                } as HeadersInit,
            });

            if (response.ok) {
                const data = await response.json();
                // Map database fields to React component fields
                const mappedBarbers = data.map((barber: any) => ({
                    id: barber.id.toString(),
                    name: barber.name,
                    title: barber.position || '', // Map position to title
                    experience: barber.experience || '',
                    specialty: barber.specialties && barber.specialties.length > 0 ? barber.specialties[0] : '', // Take first specialty
                    image: barber.image || '',
                    isActive: barber.is_active, // Map is_active to isActive
                    bio: barber.bio || '',
                    social_media: barber.social_media || {
                        instagram: '',
                        facebook: '',
                        twitter: ''
                    }
                }));
                setBarbers(mappedBarbers);
            } else {
                console.error('Failed to fetch barbers');
            }
        } catch (error) {
            console.error('Error fetching barbers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBarber = () => {
        setEditingBarber(null);
        setFormData({
            name: '',
            title: '',
            experience: '',
            specialty: '',
            image: '',
            bio: '',
            isActive: true,
            social_media: {
                instagram: '',
                facebook: '',
                twitter: ''
            }
        });
        setShowForm(true);
    };

    const handleEditBarber = (barber: Barber) => {
        setEditingBarber(barber);
        setFormData({
            name: barber.name,
            title: barber.title,
            experience: barber.experience,
            specialty: barber.specialty,
            image: barber.image,
            bio: barber.bio || '',
            isActive: barber.isActive,
            social_media: barber.social_media || {
                instagram: '',
                facebook: '',
                twitter: ''
            }
        });
        setShowForm(true);
    };

    const handleFormChange = (field: string, value: any) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("handleSubmit called");
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingBarber ? `/api/admin/barbers/${editingBarber.id}` : '/api/admin/barbers';
            const method = editingBarber ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage(editingBarber ? 'Barber updated successfully!' : 'Barber added successfully!');
                setMessageType('success');
                setShowForm(false);
                setEditingBarber(null);
                await fetchBarbers();
                
                setTimeout(() => setMessage(''), 3000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'Error saving barber');
                setMessageType('error');
                setTimeout(() => setMessage(''), 5000);
            }
        } catch (error) {
            console.error('Error saving barber:', error);
            setMessage('Error saving barber');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleImageFileSelect = async (file: File) => {
        try {
            if (!file.type || !file.type.startsWith('image/')) {
                alert('Please select a valid image');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64DataUrl = reader.result as string;
                handleFormChange('image', base64DataUrl);
            };
            reader.readAsDataURL(file);
        } catch (err: any) {
            alert(err?.message || 'Failed to read image');
        }
    };

    const handleDeleteBarber = async (barberId: string) => {
        if (!confirm('Are you sure you want to delete this barber?')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/barbers/${barberId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                setMessage('Barber deleted successfully!');
                setMessageType('success');
                await fetchBarbers();
                setTimeout(() => setMessage(''), 3000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'Error deleting barber');
                setMessageType('error');
                setTimeout(() => setMessage(''), 5000);
            }
        } catch (error) {
            console.error('Error deleting barber:', error);
            setMessage('Error deleting barber');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    const toggleBarberStatus = async (barberId: string) => {
        setLoading(true);
        try {
            const barber = barbers.find(b => b.id === barberId);
            if (!barber) return;

            const response = await fetch(`/api/admin/barbers/${barberId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    isActive: !barber.isActive
                })
            });

            if (response.ok) {
                await fetchBarbers();
                setMessage('Barber status updated successfully!');
                setMessageType('success');
                setTimeout(() => setMessage(''), 3000);
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'Error updating barber status');
                setMessageType('error');
                setTimeout(() => setMessage(''), 5000);
            }
        } catch (error) {
            console.error('Error updating barber status:', error);
            setMessage('Error updating barber status');
            setMessageType('error');
            setTimeout(() => setMessage(''), 5000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Barber Management
                </h2>
                <button
                    onClick={handleAddBarber}
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Barber
                </button>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                    messageType === 'success' 
                        ? 'bg-green-100 border border-green-400 text-green-700' 
                        : 'bg-red-100 border border-red-400 text-red-700'
                }`}>
                    {message}
                </div>
            )}

            {/* Barber Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingBarber ? 'Edit Barber' : 'Add New Barber'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingBarber(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleFormChange('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                        placeholder="Enter barber name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleFormChange('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                        placeholder="e.g., Master Barber, Creative Stylist"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Experience <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.experience}
                                        onChange={(e) => handleFormChange('experience', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                        placeholder="e.g., 5+ years, 8+ years"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Specialty <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.specialty}
                                        onChange={(e) => handleFormChange('specialty', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                        placeholder="e.g., Classic cuts & beard styling"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                                    <div className="flex items-start gap-3">
                                        <label className="inline-flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg cursor-pointer transition-colors">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const f = e.target.files && e.target.files[0];
                                                        if (f) handleImageFileSelect(f);
                                                    }}
                                                />
                                            Upload Photo
                                            </label>
                                        {formData.image && (
                                            <div className="flex items-center gap-3">
                                                <img src={resolveImageSrc(formData.image)} alt="Preview" className="h-20 w-20 object-cover object-center rounded-lg border" />
                                                <button type="button" className="px-3 py-2 border rounded hover:bg-gray-50" onClick={() => handleFormChange('image', '')}>Clear</button>
                                        </div>
                                        )}
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                    <textarea
                                        rows={3}
                                        value={formData.bio}
                                        onChange={(e) => handleFormChange('bio', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                        placeholder="Tell us about the barber..."
                                    />
                                </div>
                                
                                {/* Social Media */}
                                <div className="md:col-span-2">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Social Media</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                                            <input
                                                type="url"
                                                value={formData.social_media.instagram}
                                                onChange={(e) => handleFormChange('social_media.instagram', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                placeholder="Instagram URL"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                                            <input
                                                type="url"
                                                value={formData.social_media.facebook}
                                                onChange={(e) => handleFormChange('social_media.facebook', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                placeholder="Facebook URL"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                                            <input
                                                type="url"
                                                value={formData.social_media.twitter}
                                                onChange={(e) => handleFormChange('social_media.twitter', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                                placeholder="Twitter URL"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => handleFormChange('isActive', e.target.checked)}
                                            className="mr-2 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Active Barber</span>
                                    </label>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingBarber(null);
                                    }}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-[#D4AF37] text-white font-semibold hover:bg-[#B8941F]"
                                    disabled={loading}
                                >
                                    {editingBarber ? 'Update Barber' : 'Add Barber'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Barbers List */}
            <div className="space-y-4">
                {barbers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-lg font-medium">No barbers added yet</p>
                        <p className="text-sm">Click "Add Barber" to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {barbers.map((barber) => (
                            <div
                                key={barber.id}
                                className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow flex flex-col"
                            >
                                {/* Barber Image */}
                                <div className="h-48 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center relative">
                                    {barber.image ? (
                                        <div className="relative w-32 h-32">
                                        <img 
                                            src={resolveImageSrc(barber.image)} 
                                            alt={barber.name}
                                            className="w-32 h-32 object-cover object-center rounded-full border-4 border-white shadow-lg"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                    const fallback = (e.currentTarget.parentElement?.querySelector('.fallback-initial') as HTMLElement | null);
                                                    if (fallback) fallback.classList.remove('hidden');
                                                }}
                                            />
                                            <div className="fallback-initial hidden absolute inset-0 rounded-full bg-white/20 flex items-center justify-center">
                                                <span className="text-white text-4xl font-bold">
                                                    {barber.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                                            <span className="text-white text-4xl font-bold">
                                                {barber.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                {/* Status Badge */}
                                    <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow ${
                                        barber.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {barber.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                
                                {/* Barber Info */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{barber.name}</h3>
                                    <p className="text-[#D4AF37] font-semibold mb-2">{barber.title}</p>
                                    <div className="flex items-center text-sm text-gray-600 mb-1">
                                        <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
                                        {barber.experience}
                                    </div>
                                    <div className="text-gray-700 text-sm mb-2">{barber.specialty}</div>
                                    {barber.bio && (
                                        <p className="text-gray-600 text-xs mb-3 line-clamp-2">{barber.bio}</p>
                                    )}
                                    
                                    {/* Social Media Links */}
                                    {(barber.social_media?.instagram || barber.social_media?.facebook || barber.social_media?.twitter) && (
                                        <div className="flex gap-2 mb-3">
                                            {barber.social_media?.instagram && (
                                                <a href={barber.social_media.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-700">
                                                    {/* Instagram SVG */}
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                    </svg>
                                                </a>
                                            )}
                                            {barber.social_media?.facebook && (
                                                <a href={barber.social_media.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                                    {/* Facebook SVG */}
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                    </svg>
                                                </a>
                                            )}
                                            {barber.social_media?.twitter && (
                                                <a href={barber.social_media.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                                                    {/* Twitter SVG */}
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    
                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        <button
                                            onClick={() => handleEditBarber(barber)}
                                            disabled={loading}
                                            className="flex-1 min-w-[80px] bg-[#D4AF37] hover:bg-[#B8941F] text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => toggleBarberStatus(barber.id)}
                                            disabled={loading}
                                            className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                barber.isActive 
                                                    ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                            }`}
                                        >
                                            {barber.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBarber(barber.id)}
                                            disabled={loading}
                                            className="flex-1 min-w-[80px] bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BarberManagement; 