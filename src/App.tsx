import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { PackageSearch, Plus } from 'lucide-react';
import { jsPDF } from 'jspdf';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import DownloadButtons from './components/DownloadButtons';
import { Order, PaymentMethod } from './types';
import { saveOrder, getOrders, deleteOrder, updateOrderPaymentStatus } from './services/orderService';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const loadedOrders = await getOrders();
      setOrders(loadedOrders);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    }
  };

  const handleAddOrder = async (order: Order) => {
    try {
      await saveOrder(order);
      await loadOrders();
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la commande:', error);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      await deleteOrder(id);
      await loadOrders();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleTogglePayment = async (id: string, method: PaymentMethod) => {
    try {
      await updateOrderPaymentStatus(id, true, method);
      await loadOrders();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleGenerateInvoice = (order: Order) => {
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('FACTURE', 105, 20, { align: 'center' });
    
    // Informations de la facture
    doc.setFontSize(12);
    doc.text(`N° ${order.invoiceNumber}`, 20, 40);
    doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 20, 50);
    
    // Informations du client
    doc.setFontSize(14);
    doc.text('Client:', 20, 70);
    doc.setFontSize(12);
    doc.text(order.customerName, 20, 80);
    doc.text(order.address, 20, 85);
    
    let yPos = 90;
    if (order.phone) {
      doc.text(`Tél: ${order.phone}`, 20, yPos);
      yPos += 5;
    }
    if (order.email) {
      doc.text(`Email: ${order.email}`, 20, yPos);
      yPos += 5;
    }
    
    // Statut de paiement et méthode
    if (order.isPaid) {
      doc.setTextColor(0, 128, 0);
      const methodLabel = order.paymentMethod ? ` (${getPaymentMethodLabel(order.paymentMethod)})` : '';
      doc.text(`PAYÉE${methodLabel}`, 150, 40);
    } else {
      doc.setTextColor(255, 0, 0);
      doc.text('NON PAYÉE', 150, 40);
    }
    doc.setTextColor(0, 0, 0);
    
    // En-tête du tableau des produits
    const startY = yPos + 10;
    doc.line(20, startY, 190, startY);
    doc.setFontSize(12);
    doc.text('Produit', 25, startY - 5);
    doc.text('Référence', 120, startY - 5);
    
    // Liste des produits
    let y = startY + 10;
    order.products.forEach((product) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.text(product.name, 25, y);
      doc.text(product.reference, 120, y);
      y += 10;
    });
    
    // Total
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(14);
    doc.text(`Total: ${order.totalAmount.toFixed(2)} €`, 150, y, { align: 'right' });
    
    // Pied de page
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text('Merci de votre confiance', 105, pageHeight - 20, { align: 'center' });
    
    // Sauvegarde du PDF
    doc.save(`facture-${order.customerName}.pdf`);
  };

  const getPaymentMethodLabel = (method: PaymentMethod): string => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex justify-center items-center">
              <PackageSearch className="h-16 w-16 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Gestion des Commandes
              </h1>
            </div>
          </div>
        </div>

        <DownloadButtons />

        <div className="mb-8 flex justify-end">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            {showForm ? 'Fermer le formulaire' : 'Nouvelle commande'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transition-all duration-300 ease-in-out">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nouvelle Commande
            </h2>
            <OrderForm onSubmit={handleAddOrder} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <OrderList
            orders={orders}
            onDelete={handleDeleteOrder}
            onGenerateInvoice={handleGenerateInvoice}
            onTogglePayment={handleTogglePayment}
          />
        </div>
      </div>
    </div>
  );
}

export default App;