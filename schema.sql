CREATE TABLE IF NOT EXISTS clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom_complet TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS produits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nom TEXT NOT NULL,
  reference TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS commandes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  numero_facture TEXT NOT NULL UNIQUE,
  montant_total DECIMAL(10,2) NOT NULL,
  date_creation TEXT NOT NULL,
  is_paid INTEGER DEFAULT 0,
  payment_method TEXT CHECK(payment_method IN ('card', 'check', 'cash', 'transfer')),
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE IF NOT EXISTS commande_produits (
  commande_id INTEGER,
  produit_id INTEGER,
  PRIMARY KEY (commande_id, produit_id),
  FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
  FOREIGN KEY (produit_id) REFERENCES produits(id)
);