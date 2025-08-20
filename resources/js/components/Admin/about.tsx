import React, { useState, useEffect } from 'react';

interface AboutUsRecord {
  id: number;
  heading: string;
  paragraph: string;
}

const AboutUsAdmin = () => {
  const [records, setRecords] = useState<AboutUsRecord[]>([]);
  const [heading, setHeading] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchAllAboutUs();
  }, []);

  const fetchAllAboutUs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/aboutus/all', {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
        setShowForm(false);
        setIsEdit(false);
        setEditId(null);
      }
    } catch (err) {
      setMessage('Failed to load About Us content');
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
      const url = isEdit && editId ? `/api/aboutus` : '/api/aboutus';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit ? { id: editId, heading, paragraph } : { heading, paragraph };
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        setMessage(isEdit ? 'About Us updated successfully!' : 'About Us added successfully!');
        setMessageType('success');
        setShowForm(false);
        fetchAllAboutUs();
      } else {
        setMessage('Failed to save About Us');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error saving About Us');
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this About Us entry?')) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/aboutus/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        setMessage('About Us entry deleted successfully!');
        setMessageType('success');
        fetchAllAboutUs();
      } else {
        setMessage('Failed to delete About Us entry');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error deleting About Us entry');
      setMessageType('error');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (record: AboutUsRecord) => {
    setHeading(record.heading);
    setParagraph(record.paragraph);
    setIsEdit(true);
    setEditId(record.id);
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 max-w-3xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">About Us Content</h2>
        <button
          className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
          onClick={() => { setShowForm(true); setIsEdit(false); setHeading(''); setParagraph(''); setEditId(null); }}
        >
          Add New
        </button>
      </div>
      {message && (
        <div className={`mb-4 p-3 rounded ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message}</div>
      )}
      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-medium mb-2">Heading</label>
            <input
              type="text"
              value={heading}
              onChange={e => setHeading(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              placeholder="Enter heading"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Paragraph</label>
            <textarea
              value={paragraph}
              onChange={e => setParagraph(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
              placeholder="Enter paragraph"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isEdit ? 'Saving...' : 'Adding...') : (isEdit ? 'Save Changes' : 'Add')}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {records.length === 0 ? (
            <div className="text-gray-500">No About Us entries found.</div>
          ) : (
            records.map(record => (
              <div key={record.id} className="bg-gray-50 rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{record.heading}</h3>
                  <p className="text-gray-700">{record.paragraph}</p>
                </div>
                <div className="flex gap-2 md:flex-col md:gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                    onClick={() => handleEdit(record)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                    onClick={() => handleDelete(record.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AboutUsAdmin;
