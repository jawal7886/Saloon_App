import React from 'react';

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

interface ServicesProps {
    salonDetails: any;
    serviceLoading: boolean;
    showServiceForm: boolean;
    editingService: Service | null;
    viewingService: Service | null;
    deletingService: Service | null;
    showViewForm: boolean;
    showDeleteForm: boolean;
    serviceFormData: any;
    handleAddService: () => void;
    handleEditService: (service: Service) => void;
    handleViewService: (service: Service) => void;
    handleDeleteServiceClick: (service: Service) => void;
    handleDeleteService: (serviceId: string) => void;
    handleServiceFormChange: (field: string, value: any) => void;
    handleServiceSubmit: (e?: any) => void;
    toggleServiceStatus: (serviceId: string) => void;
    setShowServiceForm: (show: boolean) => void;
    setEditingService: (service: Service | null) => void;
    setShowViewForm: (show: boolean) => void;
    setViewingService: (service: Service | null) => void;
    setShowDeleteForm: (show: boolean) => void;
    setDeletingService: (service: Service | null) => void;
}

const Services: React.FC<ServicesProps> = ({
    salonDetails,
    serviceLoading,
    showServiceForm,
    editingService,
    viewingService,
    deletingService,
    showViewForm,
    showDeleteForm,
    serviceFormData,
    handleAddService,
    handleEditService,
    handleViewService,
    handleDeleteServiceClick,
    handleDeleteService,
    handleServiceFormChange,
    handleServiceSubmit,
    toggleServiceStatus,
    setShowServiceForm,
    setEditingService,
    setShowViewForm,
    setViewingService,
    setShowDeleteForm,
    setDeletingService
}) => {
    const handleImageFileSelect = (file: File | null) => {
        if (!file) {
            handleServiceFormChange('image', '');
            return;
        }
        if (!file.type || !file.type.startsWith('image/')) {
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64DataUrl = reader.result as string;
            handleServiceFormChange('image', base64DataUrl);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
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

            {/* Service Form Modal */}
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
                                    handleServiceFormChange('name', '');
                                    handleServiceFormChange('category', '');
                                    handleServiceFormChange('price', '');
                                    handleServiceFormChange('duration', '');
                                    handleServiceFormChange('image', '');
                                    handleServiceFormChange('description', '');
                                    handleServiceFormChange('isActive', true);
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageFileSelect(e.target.files && e.target.files.length > 0 ? e.target.files[0] : null)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors"
                                    />
                                    {serviceFormData.image && (
                                        <div className="mt-3 flex items-center gap-3">
                                            <img
                                                src={serviceFormData.image}
                                                alt="Selected preview"
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleServiceFormChange('image', '')}
                                                className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    )}
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
                                        handleServiceFormChange('name', '');
                                        handleServiceFormChange('category', '');
                                        handleServiceFormChange('price', '');
                                        handleServiceFormChange('duration', '');
                                        handleServiceFormChange('image', '');
                                        handleServiceFormChange('description', '');
                                        handleServiceFormChange('isActive', true);
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
                        {salonDetails.services.map((service: Service) => (
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
    );
};

export default Services; 