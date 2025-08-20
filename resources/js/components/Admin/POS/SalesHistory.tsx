import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Sale {
    id: number;
    invoice_no: string;
    customer_name?: string;
    barber?: string;
    grand_total: number;
    payment_status: string;
    created_at: string;
    items: SaleItem[];
}

interface SaleItem {
    name: string;
    qty: number;
    unit_price: number;
    line_total: number;
}

const SalesHistory: React.FC = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/pos/sales');
            setSales(response.data);
        } catch (error) {
            console.error('Error loading sales:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'partial':
                return 'bg-yellow-100 text-yellow-800';
            case 'pending':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const viewSaleDetail = (sale: Sale) => {
        setSelectedSale(sale);
        setShowDetailModal(true);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Sales History</h2>
                <button
                    onClick={loadSales}
                    disabled={loading}
                    className="px-4 py-2 bg-[#D4AF37] text-white rounded hover:bg-[#B8941F] transition-colors disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Refresh'}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37] mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading sales...</p>
                </div>
            ) : sales.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>No sales found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {sales.map((sale) => (
                        <div
                            key={sale.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => viewSaleDetail(sale)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-gray-800">#{sale.invoice_no}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.payment_status)}`}>
                                            {sale.payment_status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        {sale.customer_name && (
                                            <p><span className="font-medium">Customer:</span> {sale.customer_name}</p>
                                        )}
                                        {sale.barber && (
                                            <p><span className="font-medium">Barber:</span> {sale.barber}</p>
                                        )}
                                        <p><span className="font-medium">Date:</span> {formatDate(sale.created_at)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-[#D4AF37]">${sale.grand_total.toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">{sale.items.length} items</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sale Detail Modal */}
            {showDetailModal && selectedSale && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Sale Details</h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-3 rounded">
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Invoice:</span>
                                    <span>#{selectedSale.invoice_no}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedSale.payment_status)}`}>
                                        {selectedSale.payment_status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium">Date:</span>
                                    <span>{formatDate(selectedSale.created_at)}</span>
                                </div>
                                {selectedSale.customer_name && (
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">Customer:</span>
                                        <span>{selectedSale.customer_name}</span>
                                    </div>
                                )}
                                {selectedSale.barber && (
                                    <div className="flex justify-between">
                                        <span className="font-medium">Barber:</span>
                                        <span>{selectedSale.barber}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h4 className="font-semibold mb-2">Items</h4>
                                <div className="space-y-2">
                                    {selectedSale.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <div className="flex-1">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {item.qty} × ${item.unit_price.toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="font-semibold">${item.line_total.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-[#D4AF37]">${selectedSale.grand_total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-full px-4 py-2 bg-[#D4AF37] text-white rounded hover:bg-[#B8941F] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesHistory;
