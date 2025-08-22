import React, { useState } from 'react';

interface StoreInfoProps {
    salonDetails: any;
    isLoading: boolean;
    handleInputChange: (field: string, value: string) => void;
    handleSubmit: (e: any) => void;
    getCsrfToken: () => string;
    onCreated?: (salon: any) => void;
}

const StoreInfo: React.FC<StoreInfoProps> = ({ 
    salonDetails, 
    isLoading, 
    handleInputChange, 
    handleSubmit, 
    getCsrfToken,
    onCreated
}) => {
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createForm, setCreateForm] = useState({
        name: '',
        tag_line: '',
        address: '',
        phone1: '',
        phone2: '',
        email1: '',
        email2: '',
        description: '',
        logo: ''
    });

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert('Image size should be less than 2MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('logo', file);

            const resp = await fetch('/upload-logo', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest',
                } as HeadersInit
            });

            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(text || 'Upload failed');
            }
            const json = await resp.json();
            const url = json?.url as string;
            if (!url) throw new Error('Invalid upload response');

            // Preview and save URL (not base64) to avoid oversized DB column writes
            setLogoPreview(url);
            handleInputChange('logo', url);
        } catch (error: any) {
            console.error('Error uploading logo:', error);
            alert(error?.message || 'Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // Get the logo source (prefer preview, then stored value)
    const getLogoSrc = () => {
        if (logoPreview) return logoPreview;
        if (salonDetails.logo) return salonDetails.logo;
        return null;
    };

    const handleCreateChange = (field: string, value: string) => {
        setCreateForm(prev => ({ ...prev, [field]: value }));
    };

    const createSalon = async () => {
        setCreating(true);
        try {
            const payload = {
                name: createForm.name,
                tag_line: createForm.tag_line,
                logo: createForm.logo,
                address: createForm.address,
                phone1: createForm.phone1,
                phone2: createForm.phone2,
                email1: createForm.email1,
                email2: createForm.email2,
                description: createForm.description,
                social_media: JSON.stringify({}),
                hours: JSON.stringify({})
            };

            const resp = await fetch('/api/salons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken(),
                } as HeadersInit,
                body: JSON.stringify(payload)
            });

            if (!resp.ok) {
                const text = await resp.text();
                throw new Error(text || 'Failed to create salon');
            }
            const salon = await resp.json();

            // update parent and current fields
            if (onCreated) onCreated(salon);
            handleInputChange('name', salon.name || '');
            handleInputChange('tagLine', salon.tag_line || '');
            handleInputChange('logo', salon.logo || '');
            handleInputChange('address', salon.address || '');
            handleInputChange('phone1', salon.phone1 || '');
            handleInputChange('phone2', salon.phone2 || '');
            handleInputChange('email1', salon.email1 || '');
            handleInputChange('email2', salon.email2 || '');
            setShowCreateModal(false);
        } catch (e) {
            alert((e as Error).message);
        } finally {
            setCreating(false);
        }
    };

    return (
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
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                        <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Store Information
                        </h2>
                        <button
                            type="button"
                            onClick={() => setShowCreateModal(true)}
                            className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                            </svg>
                            Add New
                        </button>
                    </div>
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
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Salon Logo</label>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        disabled={uploading}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-white hover:file:bg-[#B8941F] transition-colors"
                                    />
                                    {uploading && (
                                        <div className="mt-2 flex items-center text-sm text-gray-600">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D4AF37] mr-2"></div>
                                            Processing image...
                                        </div>
                                    )}
                                </div>
                                
                                {/* Logo Preview */}
                                <div className="mt-4">
                                    <span className="block text-sm font-medium text-gray-700 mb-2">Logo Preview:</span>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                                        {getLogoSrc() ? (
                                            <div className="flex items-center justify-center">
                                                <img 
                                                    src={getLogoSrc()} 
                                                    alt="Logo Preview" 
                                                    className="max-h-32 max-w-full object-contain rounded"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.nextElementSibling?.classList.remove('hidden');
                                                    }}
                                                />
                                                <div className="hidden text-gray-500 text-sm">
                                                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p>Image preview not available</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center text-gray-500">
                                                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-sm">No logo selected</p>
                                                <p className="text-xs text-gray-400 mt-1">Upload an image to see preview</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Add New Salon</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="px-3 py-2 border rounded-lg" placeholder="Store Name" value={createForm.name} onChange={(e)=>handleCreateChange('name', e.target.value)} />
                            <input className="px-3 py-2 border rounded-lg" placeholder="Tag Line" value={createForm.tag_line} onChange={(e)=>handleCreateChange('tag_line', e.target.value)} />
                            <input className="px-3 py-2 border rounded-lg" placeholder="Primary Phone" value={createForm.phone1} onChange={(e)=>handleCreateChange('phone1', e.target.value)} />
                            <input className="px-3 py-2 border rounded-lg" placeholder="Secondary Phone" value={createForm.phone2} onChange={(e)=>handleCreateChange('phone2', e.target.value)} />
                            <input className="px-3 py-2 border rounded-lg" placeholder="Primary Email" value={createForm.email1} onChange={(e)=>handleCreateChange('email1', e.target.value)} />
                            <input className="px-3 py-2 border rounded-lg" placeholder="Secondary Email" value={createForm.email2} onChange={(e)=>handleCreateChange('email2', e.target.value)} />
                            <input className="md:col-span-2 px-3 py-2 border rounded-lg" placeholder="Address" value={createForm.address} onChange={(e)=>handleCreateChange('address', e.target.value)} />
                            <textarea className="md:col-span-2 px-3 py-2 border rounded-lg" placeholder="Description" value={createForm.description} onChange={(e)=>handleCreateChange('description', e.target.value)} />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                            <button type="button" disabled={creating} onClick={createSalon} className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50">
                                {creating ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoreInfo; 