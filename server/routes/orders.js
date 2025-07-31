import express from 'express';
import { supabase } from '../db/config.js';

const router = express.Router();

// Get all orders
router.get('/', async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from('commandes')
      .select(`
        id,
        clients (
          nom_complet
        ),
        numero_facture,
        montant_total,
        date_creation,
        is_paid,
        payment_method,
        commande_produits (
          produits (
            nom,
            reference
          )
        )
      `)
      .order('date_creation', { ascending: false });

    if (error) throw error;

    const formattedOrders = orders.map(order => ({
      id: order.id.toString(),
      customerName: order.clients.nom_complet,
      invoiceNumber: order.numero_facture,
      totalAmount: parseFloat(order.montant_total),
      date: order.date_creation,
      isPaid: order.is_paid,
      paymentMethod: order.payment_method,
      products: order.commande_produits.map(cp => ({
        name: cp.produits.nom,
        reference: cp.produits.reference
      }))
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  const { customerName, products, invoiceNumber, totalAmount, date, isPaid, paymentMethod } = req.body;
  
  try {
    // Insert client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert({ nom_complet: customerName })
      .select()
      .single();

    if (clientError) throw clientError;

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('commandes')
      .insert({
        client_id: client.id,
        numero_facture: invoiceNumber,
        montant_total: totalAmount,
        date_creation: date,
        is_paid: isPaid,
        payment_method: paymentMethod
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert products and associations
    for (const product of products) {
      const { data: existingProduct } = await supabase
        .from('produits')
        .select()
        .eq('reference', product.reference)
        .single();

      let productId;
      if (existingProduct) {
        productId = existingProduct.id;
      } else {
        const { data: newProduct, error: productError } = await supabase
          .from('produits')
          .insert({
            nom: product.name,
            reference: product.reference
          })
          .select()
          .single();

        if (productError) throw productError;
        productId = newProduct.id;
      }

      const { error: linkError } = await supabase
        .from('commande_produits')
        .insert({
          commande_id: order.id,
          produit_id: productId
        });

      if (linkError) throw linkError;
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la commande' });
  }
});

// Delete order
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('commandes')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la commande' });
  }
});

// Update payment status
router.patch('/:id/payment', async (req, res) => {
  try {
    const { error } = await supabase
      .from('commandes')
      .update({
        is_paid: req.body.isPaid,
        payment_method: req.body.paymentMethod
      })
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de paiement' });
  }
});

export default router;