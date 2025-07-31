import React from 'react';
import { X, Phone, Mail, MapPin, Package, CreditCard } from 'lucide-react';
import { Order, PaymentMethod } from '../types';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
}

export default function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const getPaymentMethodLabel = (method?: PaymentMethod) => {
    switch (method) {
      case 'card': return 'Carte bancaire';
      case 'check': return 'Chèque';
      case 'cash': return 'Espèces';
      case 'transfer': return 'Virement';
      default: return 'Non spécifié';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Détails de la commande
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Informations client */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Informations client
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">Nom :</span> {order.customerName}
                </p>
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{order.address}</span>
                </div>
                {order.phone && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="h-5 w-5" />
                    <span>{order.phone}</span>
                  </div>
                )}
                {order.email && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="h-5 w-5" />
                    <span>{order.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Détails commande */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Détails de la commande
              </h3>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium">N° Facture :</span> {order.invoiceNumber}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Date :</span>{' '}
                  {new Date(order.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Montant total :</span>{' '}
                  {order.totalAmount.toFixed(2)} €
                </p>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.isPaid 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {order.isPaid 
                      ? `Payée (${getPaymentMethodLabel(order.paymentMethod)})` 
                      : 'Non payée'}
                  </span>
                </div>
              </div>
            </div>

            {/* Liste des produits */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Produits
              </h3>
              <div className="space-y-3">
                {order.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-gray-700"
                  >
                    <Package className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        Réf: {product.reference}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}