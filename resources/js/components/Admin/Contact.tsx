import React from 'react';

interface ContactProps {
    contactInfo: any;
    contactMessages: any[];
    contactLoading: boolean;
    handleContactInfoSubmit: (e: any) => void;
    handleContactInputChange: (field: string, value: string) => void;
    updateMessageStatus: (messageId: string, status: string) => void;
    deleteMessage: (messageId: string) => void;
}

const Contact: React.FC<ContactProps> = ({
    contactInfo,
    contactMessages,
    contactLoading,
    handleContactInfoSubmit,
    handleContactInputChange,
    updateMessageStatus,
    deleteMessage
}) => {
    return (
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
    );
};

export default Contact; 