import { supabase } from '../db/config';
import { Order, PaymentMethod } from '../types';
import { toast } from 'react-hot-toast';

export async function saveOrder(order: Order): Promise<void> {
  const handleError = (error: any) => {
    const message = error?.message || 'Une erreur est survenue';
    console.error('Erreur:', error);
    toast.error(message);
    throw error;
  };

  try {
    // Start transaction
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({ 
        nom_complet: order.customerName,
        adresse: order.address,
        email: order.email || null,
        telephone: order.phone || null
      })
      .select('id')
      .single();

    if (clientError) throw clientError;

    const { data: newOrder, error: orderError } = await supabase
      .from('commandes')
      .insert({
        client_id: client.id,
        numero_facture: order.invoiceNumber,
        montant_total: order.totalAmount,
        date_creation: order.date,
        is_paid: order.isPaid,
        payment_method: order.paymentMethod
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    // Process products
    for (const product of order.products) {
      // Try to get existing product first
      const { data: existingProduct, error: productQueryError } = await supabase
        .from('produits')
        .select('id')
        .eq('reference', product.reference)
        .maybeSingle();

      if (productQueryError) throw productQueryError;

      let productId;
      if (!existingProduct) {
        const { data: newProduct, error: productInsertError } = await supabase
          .from('produits')
          .insert({ nom: product.name, reference: product.reference })
          .select('id')
          .single();

        if (productInsertError) throw productInsertError;
        productId = newProduct.id;
      } else {
        productId = existingProduct.id;
      }

      const { error: linkError } = await supabase
        .from('commande_produits')
        .insert({
          commande_id: newOrder.id,
          produit_id: productId
        });

      if (linkError) throw linkError;
    }

    toast.success('Commande enregistrée avec succès');
  } catch (error) {
    handleError(error);
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('commandes')
      .select(`
        id,
        clients (
          nom_complet,
          adresse,
          email,
          telephone
        ),
        numero_facture,
        montant_total,
        date_creation,
        is_paid,
        payment_method,
        commande_produits (
          produits (nom, reference)
        )
      `)
      .order('date_creation', { ascending: false });

    if (error) throw error;

    if (!data) return [];

    return data.map(order => ({
      id: order.id,
      customerName: order.clients.nom_complet,
      address: order.clients.adresse,
      email: order.clients.email || undefined,
      phone: order.clients.telephone || undefined,
      products: order.commande_produits.map(cp => ({
        name: cp.produits.nom,
        reference: cp.produits.reference
      })),
      invoiceNumber: order.numero_facture,
      totalAmount: Number(order.montant_total),
      date: order.date_creation,
      isPaid: order.is_paid,
      paymentMethod: order.payment_method
    }));
  } catch (error: any) {
    console.error('Erreur lors du chargement:', error);
    toast.error('Erreur lors du chargement des commandes');
    throw error;
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('commandes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    toast.success('Commande supprimée avec succès');
  } catch (error: any) {
    console.error('Erreur lors de la suppression:', error);
    toast.error('Erreur lors de la suppression de la commande');
    throw error;
  }
}

export async function updateOrderPaymentStatus(
  id: string,
  isPaid: boolean,
  paymentMethod: PaymentMethod
): Promise<void> {
  try {
    const { error } = await supabase
      .from('commandes')
      .update({
        is_paid: isPaid,
        payment_method: paymentMethod
      })
      .eq('id', id);

    if (error) throw error;
    toast.success('Statut de paiement mis à jour');
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour:', error);
    toast.error('Erreur lors de la mise à jour du statut de paiement');
    throw error;
  }
}