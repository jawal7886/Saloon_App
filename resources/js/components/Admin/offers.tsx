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

const OffersAdmin = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [features, setFeatures] = useState<string[]>(['']);
  const [duration, setDuration] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/offers', {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (err) {
      setMessage('Failed to load offers');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const url = isEdit && editId ? `/api/offers/${editId}` : '/api/offers';
      const method = isEdit ? 'PUT' : 'POST';
      
      const body = {
        title,
        description,
        original_price: parseFloat(originalPrice),
        discounted_price: parseFloat(discountedPrice),
        discount_percentage: parseFloat(discountPercentage),
        is_popular: isPopular,
        features: features.filter(f => f.trim() !== ''),
        duration,
        sort_order: sortOrder,
        is_active: isActive
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setMessage(isEdit ? 'Offer updated successfully!' : 'Offer added successfully!');
        setMessageType('success');
        setShowForm(false);
        resetForm();
        fetchOffers();
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to save offer');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error saving offer');
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/offers/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        setMessage('Offer deleted successfully!');
        setMessageType('success');
        fetchOffers();
      } else {
        setMessage('Failed to delete offer');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error deleting offer');
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (offer: Offer) => {
    setTitle(offer.title);
    setDescription(offer.description);
    setOriginalPrice(offer.original_price.toString());
    setDiscountedPrice(offer.discounted_price.toString());
    setDiscountPercentage(offer.discount_percentage.toString());
    setIsPopular(offer.is_popular);
    setFeatures(offer.features.length > 0 ? offer.features : ['']);
    setDuration(offer.duration);
    setSortOrder(offer.sort_order);
    setIsActive(offer.is_active);
    setIsEdit(true);
    setEditId(offer.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setOriginalPrice('');
    setDiscountedPrice('');
    setDiscountPercentage('');
    setIsPopular(false);
    setFeatures(['']);
    setDuration('');
    setSortOrder(1);
    setIsActive(true);
    setIsEdit(false);
    setEditId(null);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      const newFeatures = features.filter((_, i) => i !== index);
      setFeatures(newFeatures);
    }
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const calculateDiscountPercentage = () => {
    if (originalPrice && discountedPrice) {
      const original = parseFloat(originalPrice);
      const discounted = parseFloat(discountedPrice);
      if (original > discounted) {
        const percentage = ((original - discounted) / original) * 100;
        setDiscountPercentage(percentage.toFixed(0));
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Offers Management</h2>
        <button
          className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          onClick={() => { setShowForm(true); resetForm(); }}
        >
          Add New Offer
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                placeholder="e.g., Premium Cut"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                placeholder="e.g., per visit"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              placeholder="Describe the offer..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Original Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={e => setOriginalPrice(e.target.value)}
                onBlur={calculateDiscountPercentage}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Discounted Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={discountedPrice}
                onChange={e => setDiscountedPrice(e.target.value)}
                onBlur={calculateDiscountPercentage}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Discount Percentage (%)</label>
              <input
                type="number"
                step="0.01"
                value={discountPercentage}
                onChange={e => setDiscountPercentage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={e => setSortOrder(parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                placeholder="1"
                required
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={e => setIsPopular(e.target.checked)}
                  className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <span className="ml-2 text-sm font-medium">Mark as Popular</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                  className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <span className="ml-2 text-sm font-medium">Active</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Features</label>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={e => updateFeature(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                    placeholder="e.g., Haircut & Style"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Add Feature
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setShowForm(false); resetForm(); }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add Offer')}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No offers found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {offers.map(offer => (
                <div key={offer.id} className="relative group rounded-2xl bg-gradient-to-b from-white to-[#FFF9E8] ring-1 ring-[#D4AF37]/60 hover:ring-[#D4AF37] shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 p-5 h-full flex flex-col">
                  <div className="absolute inset-x-0 top-0 h-1 bg-[#D4AF37]"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{offer.title}</h3>
                      <p className="text-gray-600 text-sm">{offer.description}</p>
                    </div>
                    {offer.is_popular && (
                      <span className="bg-[#D4AF37] text-white px-2 py-1 rounded text-xs font-semibold shadow">
                        POPULAR
                      </span>
                    )}
                  </div>
                  <div className="mb-3 relative">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-[#D4AF37]">${offer.discounted_price}</span>
                      <span className="text-lg text-gray-500 line-through">${offer.original_price}</span>
                    </div>
                    <span className="absolute -right-1 -top-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-semibold">-{offer.discount_percentage}%</span>
                    <p className="text-gray-600 text-sm mt-1">{offer.duration}</p>
                  </div>
                  <div className="mb-4 flex-1">
                    <h4 className="font-semibold text-sm mb-2">Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {offer.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-[#D4AF37] mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                      {offer.features.length > 3 && (
                        <li className="text-gray-500">+{offer.features.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                  <div className="flex gap-2 mt-auto pt-2">
                    <button
                      className="flex-1 bg-[#D4AF37] hover:bg-[#B8941F] text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                      onClick={() => handleEdit(offer)}
                    >
                      Edit
                    </button>
                    <button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                      onClick={() => handleDelete(offer.id)}
                    >
                      Delete
                    </button>
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

export default OffersAdmin;
