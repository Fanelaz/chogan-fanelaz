import React, { useState } from 'react';
import { FileText, Trash2, CreditCard, CheckSquare, Banknote, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { Order, PaymentMethod } from '../types';
import OrderDetails from './OrderDetails';

interface OrderListProps {
  orders: Order[];
  onDelete: (id: string) => void;
  onGenerateInvoice: (order: Order) => void;
  onTogglePayment: (id: string, method: PaymentMethod) => void;
}

export default function OrderList({ 
  orders, 
  onDelete, 
  onGenerateInvoice,
  onTogglePayment
}: OrderListProps) {
  const [openPaymentMenu, setOpenPaymentMenu] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortField, setSortField] = useState<keyof Order>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const getPaymentMethodIcon = (method?: PaymentMethod) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'check':
        return <CheckSquare className="h-4 w-4" />;
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'transfer':
        return <Building2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPaymentMethodLabel = (method?: PaymentMethod) => {
    switch (method) {
      case 'card':
        return 'Carte bancaire';
      case 'check':
        return 'Chèque';
      case 'cash':
        return 'Espèces';
      case 'transfer':
        return 'Virement';
      default:
        return 'Non spécifié';
    }
  };

  const handlePaymentMethodClick = (orderId: string, method: PaymentMethod) => {
    onTogglePayment(orderId, method);
    setOpenPaymentMenu(null);
  };

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortField === 'date') {
      return sortDirection === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return sortDirection === 'asc'
      ? String(a[sortField]).localeCompare(String(b[sortField]))
      : String(b[sortField]).localeCompare(String(a[sortField]));
  });

  const SortIcon = ({ field }: { field: keyof Order }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="group px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span>Date</span>
                  <SortIcon field="date" />
                </div>
              </th>
              <th 
                className="group px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span>Client</span>
                  <SortIcon field="customerName" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produits
              </th>
              <th 
                className="group px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('invoiceNumber')}
              >
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span>N° Facture</span>
                  <SortIcon field="invoiceNumber" />
                </div>
              </th>
              <th 
                className="group px-6 py-3 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalAmount')}
              >
                <div className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span>Montant</span>
                  <SortIcon field="totalAmount" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut Paiement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedOrders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.address}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-h-20 overflow-y-auto">
                    {order.products.map((product, index) => (
                      <div key={index} className="mb-1">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-gray-500 text-xs ml-2">
                          ({product.reference})
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.invoiceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.totalAmount.toFixed(2)} €
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    {order.isPaid ? (
                      <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-100 text-green-800">
                        {getPaymentMethodIcon(order.paymentMethod)}
                        <span className="text-sm font-medium">
                          Payée ({getPaymentMethodLabel(order.paymentMethod)})
                        </span>
                      </div>
                    ) : (
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          className="w-full px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors duration-150"
                          onClick={() => setOpenPaymentMenu(openPaymentMenu === order.id ? null : order.id)}
                        >
                          Non payée
                        </button>
                        {openPaymentMenu === order.id && (
                          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-1" role="menu">
                              {(['card', 'check', 'cash', 'transfer'] as PaymentMethod[]).map((method) => (
                                <button
                                  key={method}
                                  className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors duration-150"
                                  onClick={() => handlePaymentMethodClick(order.id, method)}
                                >
                                  {getPaymentMethodIcon(method)}
                                  <span>{getPaymentMethodLabel(method)}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onGenerateInvoice(order)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                      title="Générer la facture"
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(order.id)}
                      className="text-red-600 hover:text-red-900 transition-colors duration-150"
                      title="Supprimer la commande"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetails 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}