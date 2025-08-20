import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface GalleryItem {
    id: number;
    image_path: string;
    category: string;
    title?: string;
    description?: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    image_url?: string;
}

interface GalleryProps {
    salonDetails: any;
}

const Gallery: React.FC<GalleryProps> = ({ salonDetails }) => {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [categories, setCategories] = useState<string[]>([]);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [galleryError, setGalleryError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<any>({});

    const [formData, setFormData] = useState({
        category: '',
        title: '',
        description: '',
        is_active: true,
        sort_order: 0
    });

    // Fetch gallery items
    const fetchGalleryItems = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/gallery');
            if (response.data.success) {
                setGalleryItems(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching gallery items:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/categories');
            if (Array.isArray(response.data)) {
                setCategories(response.data.map((cat: any) => cat.name));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchGalleryItems();
    }, []);

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    // Handle form input changes
    const handleFormChange = (field: string, value: any) => {
        console.log(`Form field changed: ${field} = ${value}`);
        setFormData(prev => {
            const newData = {
                ...prev,
                [field]: value
            };
            console.log('Updated form data:', newData);
            return newData;
        });
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            category: '',
            title: '',
            description: '',
            is_active: true,
            sort_order: 0
        });
        setSelectedFile(null);
        setPreviewUrl('');
        setEditingItem(null);
        setGalleryError('');
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        setGalleryError('');
        setFieldErrors({});
        
        if (!selectedFile && !editingItem) {
            setGalleryError('Please select an image');
            return;
        }

        // Additional check for file validity
        if (selectedFile && selectedFile.size === 0) {
            setGalleryError('Selected file is empty. Please choose a valid image.');
            return;
        }

        if (selectedFile && !selectedFile.type.startsWith('image/')) {
            setGalleryError('Please select a valid image file (JPEG, PNG, JPG, GIF).');
            return;
        }

        if (!formData.category || formData.category.trim() === '') {
            setGalleryError('Please select a category');
            console.error('Category is empty:', formData.category);
            return;
        }

        try {
            setUploading(true);
            const submitData = new FormData();
            
            if (selectedFile) {
                submitData.append('image', selectedFile);
            }
            
            submitData.append('category', formData.category);
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('is_active', formData.is_active.toString());
            submitData.append('sort_order', formData.sort_order.toString());

            // Debug: Check category specifically
            console.log('Category being sent:', formData.category);
            console.log('Category type:', typeof formData.category);
            console.log('Category length:', formData.category?.length);

            // Debug: Log what we're sending
            console.log('Submitting gallery data:', {
                category: formData.category,
                title: formData.title,
                description: formData.description,
                is_active: formData.is_active,
                sort_order: formData.sort_order,
                hasFile: !!selectedFile
            });

            // Debug: Log FormData contents
            for (let [key, value] of submitData.entries()) {
                console.log(`FormData - ${key}:`, value);
            }

            // Debug: Check if file is actually selected
            console.log('Selected file details:', {
                file: selectedFile,
                fileName: selectedFile?.name,
                fileSize: selectedFile?.size,
                fileType: selectedFile?.type
            });

            let response;
            if (editingItem) {
                // Use POST with method override so PHP parses multipart fields on update
                submitData.append('_method', 'PUT');
                response = await axios.post(`/api/gallery/${editingItem.id}`, submitData, {
                    headers: {
                        // Let axios set Content-Type with correct boundary
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    }
                });
            } else {
                response = await axios.post('/api/gallery', submitData, {
                    headers: {
                        // Let axios set Content-Type with correct boundary
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    }
                });
            }

            // Debug: Log the response
            console.log('Gallery API response:', response.data);
            
            if (response.data.success) {
                alert(editingItem ? 'Gallery item updated successfully!' : 'Gallery item added successfully!');
                setShowForm(false);
                resetForm();
                fetchGalleryItems();
            }
        } catch (error: any) {
            // Debug: Log the error
            console.error('Gallery submission error:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.data?.errors) {
                setFieldErrors(error.response.data.errors);
                setGalleryError('');
            } else {
                setGalleryError(error.response?.data?.message || 'Error saving gallery item');
            }
        } finally {
            setUploading(false);
        }
    };

    // Handle edit
    const handleEdit = (item: GalleryItem) => {
        console.log('Editing item:', item);
        setEditingItem(item);
        const newFormData = {
            category: item.category,
            title: item.title || '',
            description: item.description || '',
            is_active: item.is_active,
            sort_order: item.sort_order
        };
        console.log('Setting form data:', newFormData);
        setFormData(newFormData);
        setPreviewUrl(item.image_url || '');
        setShowForm(true);
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deletingItem) return;

        try {
            const response = await axios.delete(`/api/gallery/${deletingItem.id}`);
            if (response.data.success) {
                alert('Gallery item deleted successfully!');
                setShowDeleteForm(false);
                setDeletingItem(null);
                fetchGalleryItems();
            }
        } catch (error: any) {
            console.error('Error deleting gallery item:', error);
            alert(error.response?.data?.message || 'Error deleting gallery item');
        }
    };

    // Toggle item status
    const toggleStatus = async (item: GalleryItem) => {
        try {
            const response = await axios.put(`/api/gallery/${item.id}/toggle-status`);
            if (response.data.success) {
                fetchGalleryItems();
            }
        } catch (error: any) {
            console.error('Error updating gallery item status:', error);
            alert(error.response?.data?.message || 'Error updating status');
        }
    };

    // Add new category handler
    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            await axios.post('/api/categories', { name: newCategory });
            setNewCategory('');
            setShowAddCategory(false);
            fetchCategories();
        } catch (error) {
            alert('Failed to add category');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <svg className="w-6 h-6 text-[#D4AF37] mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Gallery Management
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddCategory(true)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                    >
                        + Add New Category
                    </button>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Image
                    </button>
                </div>
            </div>

            {/* Add Category Modal */}
            {showAddCategory && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-xl font-bold mb-4">Add New Category</h3>
                        <input
                            type="text"
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                            placeholder="Category name"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowAddCategory(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >Cancel</button>
                            <button
                                onClick={handleAddCategory}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    resetForm();
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        {previewUrl ? (
                                            <div className="space-y-4">
                                                <img
                                                    src={previewUrl}
                                                    alt="Preview"
                                                    className="mx-auto max-h-48 rounded-lg"
                                                />
                                                <p className="text-sm text-gray-600">
                                                    Click to change image
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="text-sm text-gray-600">
                                                    Click to upload an image
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleFormChange('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleFormChange('title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                                    placeholder="Enter title (optional)"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleFormChange('description', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                                    placeholder="Enter description (optional)"
                                />
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={formData.sort_order}
                                    onChange={(e) => handleFormChange('sort_order', parseInt(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => handleFormChange('is_active', e.target.checked)}
                                    className="h-4 w-4 text-[#D4AF37] focus:ring-[#D4AF37] border-gray-300 rounded"
                                />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                    Active
                                </label>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors duration-200 disabled:opacity-50"
                                >
                                    {uploading ? 'Saving...' : (editingItem ? 'Update' : 'Save')}
                                </button>
                            </div>
                            {galleryError && (
                                <div className="mt-2 text-red-600 text-sm text-center">{galleryError}</div>
                            )}
                            {/* Category Error */}
                            {fieldErrors.category && (
                                <div className="text-red-600 text-sm">{fieldErrors.category[0]}</div>
                            )}
                            {/* Image Error */}
                            {fieldErrors.image && (
                                <div className="text-red-600 text-sm">{fieldErrors.image[0]}</div>
                            )}
                            {/* Title Error */}
                            {fieldErrors.title && (
                                <div className="text-red-600 text-sm">{fieldErrors.title[0]}</div>
                            )}
                            {/* Description Error */}
                            {fieldErrors.description && (
                                <div className="text-red-600 text-sm">{fieldErrors.description[0]}</div>
                            )}
                            {/* Sort Order Error */}
                            {fieldErrors.sort_order && (
                                <div className="text-red-600 text-sm">{fieldErrors.sort_order[0]}</div>
                            )}
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteForm && deletingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
                        <div className="text-center">
                            <svg className="mx-auto h-12 w-12 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Delete Gallery Item
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure you want to delete this gallery item? This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteForm(false);
                                        setDeletingItem(null);
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Items List */}
            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading gallery items...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {galleryItems.length === 0 ? (
                        <div className="text-center py-8">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-4 text-gray-600">No gallery items found</p>
                            <button
                                onClick={() => {
                                    resetForm();
                                    setShowForm(true);
                                }}
                                className="mt-4 bg-[#D4AF37] hover:bg-[#B8941F] text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                            >
                                Add First Image
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {galleryItems.map((item) => (
                                <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="relative mb-4">
                                        <img
                                            src={item.image_url || `/storage/${item.image_path}`}
                                            alt={item.title || 'Gallery image'}
                                            className="w-full h-48 object-cover rounded-lg"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgODBMMTIwIDEwMEg4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTIwIiByPSIyMCIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                            }}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                item.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-900">
                                                {item.title || 'Untitled'}
                                            </span>
                                            <span className="text-xs bg-[#D4AF37] text-white px-2 py-1 rounded">
                                                {item.category}
                                            </span>
                                        </div>
                                        
                                        {item.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}
                                        
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>Order: {item.sort_order}</span>
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                        
                                        <div className="flex space-x-2 pt-3">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded transition-colors duration-200"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => toggleStatus(item)}
                                                className={`flex-1 text-sm py-2 px-3 rounded transition-colors duration-200 ${
                                                    item.is_active
                                                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                            >
                                                {item.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletingItem(item);
                                                    setShowDeleteForm(true);
                                                }}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded transition-colors duration-200"
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
            )}
        </div>
    );
};

export default Gallery;