import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type Appointment = {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  barber: string;
  notes?: string | null;
  created_at: string;
};

type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const AdminAppointments: React.FC = () => {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get<PaginatedResponse<Appointment>>('/api/appointments', {
        params: { page, search: search || undefined, date: date || undefined },
      });
      setItems(data.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const filteredCount = useMemo(() => items.length, [items]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    await fetchAppointments();
  };

  const openMail = (email: string, subject: string, body: string) => {
    const url = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  const openWhatsApp = (phone: string, message: string) => {
    const clean = phone.replace(/[^\d+]/g, '');
    const url = `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const openDetails = (a: Appointment) => {
    setSelected(a);
    setIsModalOpen(true);
  };

  const closeDetails = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  const formatDate = (d: string) => {
    if (d.includes('T')) return d.split('T')[0];
    return d;
  };

  const formatTime = (t: string) => {
    // Format time to HH:MM AM/PM if it's in 24-hour format
    if (t.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = t.split(':');
      const h = parseInt(hours, 10);
      const suffix = h >= 12 ? 'PM' : 'AM';
      const displayHours = ((h + 11) % 12 + 1);
      return `${displayHours}:${minutes} ${suffix}`;
    }
    return t;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Appointments Management</h1>

      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search appointments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-md"
        >
          Filter
        </button>
        <button 
          type="button" 
          onClick={() => { setSearch(''); setDate(''); setPage(1); fetchAppointments(); }} 
          className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </form>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

      {!loading && !error && (
        <>
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Showing {filteredCount} appointment{filteredCount !== 1 ? 's' : ''}
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => p + 1)} 
                disabled={items.length === 0 || items.length < 10} // Assuming 10 per page
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {items.map((a) => (
              <div key={a.id} className="relative group rounded-2xl bg-gradient-to-b from-white to-[#FFF9E8] ring-1 ring-[#D4AF37]/60 hover:ring-[#D4AF37] shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-[#D4AF37]"></div>
                <div className="p-6 min-h-[240px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{a.name}</h3>
                      <p className="text-sm text-gray-500">#{a.id}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-[#FFF5D1] text-[#8B4513] font-medium border border-[#D4AF37]/40">
                      {a.service}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-gray-700">{a.barber}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">{formatDate(a.appointment_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{formatTime(a.appointment_time)}</span>
                    </div>
                    {a.notes && (
                      <div className="flex items-start">
                        <svg className="w-4 h-4 text-gray-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <p className="text-gray-600 text-sm line-clamp-2">{a.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/70 backdrop-blur px-6 py-3 flex justify-between items-center border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openMail(
                        a.email,
                        `Your appointment on ${a.appointment_date} at ${a.appointment_time}`,
                        `Hello ${a.name},%0D%0A%0D%0AThis is regarding your appointment for ${a.service} with ${a.barber} on ${a.appointment_date} at ${a.appointment_time}.%0D%0A%0D%0ARegards,%0D%0AAdmin`
                      )}
                      className="p-2 text-gray-600 hover:text-[#D4AF37] transition-colors"
                      title="Send Email"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openWhatsApp(
                        a.phone,
                        `Hello ${a.name}, this is from the salon regarding your ${a.service} appointment on ${a.appointment_date} at ${a.appointment_time}.`
                      )}
                      className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                      title="Send WhatsApp"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={() => openDetails(a)}
                    className="px-3 py-1.5 text-sm bg-[#D4AF37] text-[#2F2F2F] rounded hover:bg-[#B8941F] transition-colors border border-[#D4AF37] shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCount === 0 && (
            <div className="p-8 text-center bg-white rounded-lg shadow-sm">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </>
      )}

      {isModalOpen && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">Appointment Details</h3>
              <button 
                onClick={closeDetails} 
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <div className="w-full px-3 py-2 border rounded bg-gray-50">{selected.name}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="w-full px-3 py-2 border rounded bg-gray-50">{selected.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="w-full px-3 py-2 border rounded bg-gray-50">{selected.phone}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                  <div className="w-full px-3 py-2 border rounded bg-gray-50">{selected.service}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barber</label>
                  <div className="w-full px-3 py-2 border rounded bg-gray-50">{selected.barber}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="w-full px-3 py-2 border rounded bg-gray-50">{formatDate(selected.appointment_date)}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <div className="w-full px-3 py-2 border rounded bg-gray-50">{formatTime(selected.appointment_time)}</div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <div className="w-full px-3 py-2 border rounded bg-gray-50 min-h-[80px]">
                    {selected.notes || 'No notes provided'}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center"
                  onClick={() => openMail(
                    selected.email,
                    `Your appointment on ${selected.appointment_date} at ${selected.appointment_time}`,
                    `Hello ${selected.name},%0D%0A%0D%0AThis is regarding your appointment for ${selected.service} with ${selected.barber} on ${selected.appointment_date} at ${selected.appointment_time}.%0D%0A%0D%0ARegards,%0D%0AAdmin`
                  )}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </button>
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors flex items-center"
                  onClick={() => openWhatsApp(
                    selected.phone,
                    `Hello ${selected.name}, this is from the salon regarding your ${selected.service} appointment on ${selected.appointment_date} at ${selected.appointment_time}.`
                  )}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </button>
                <button 
                  className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors" 
                  onClick={closeDetails}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;