import { supabase } from '../db/config';

export async function generateInvoiceNumber(): Promise<string> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Utilisateur non connecté');

    // Get the last invoice number
    const { data: lastInvoice, error } = await supabase
      .from('commandes')
      .select('numero_facture')
      .eq('user_id', user.id)
      .order('numero_facture', { ascending: false })
      .limit(1);

    if (error) throw error;

    let nextNumber = 1;
    
    if (lastInvoice && lastInvoice.length > 0) {
      // Extract the number from the last invoice
      const lastNumber = parseInt(lastInvoice[0].numero_facture);
      nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
    }

    // Format the number with leading zeros (8 digits)
    return nextNumber.toString().padStart(4, '0');
  } catch (error) {
    console.error('Erreur lors de la génération du numéro de facture:', error);
    throw error;
  }
}