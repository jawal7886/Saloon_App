import React, { useState } from 'react';

interface StoreInfoProps {
    salonDetails: any;
    isLoading: boolean;
    handleInputChange: (field: string, value: string) => void;
    handleSubmit: (e: any) => void;
    getCsrfToken: () => string;
}

const StoreInfo: React.FC<StoreInfoProps> = ({ 
    salonDetails, 
    isLoading, 
    handleInputChange, 
    handleSubmit, 
    getCsrfToken 
}) => {
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);

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
        </div>
    );
};

export default StoreInfo; 