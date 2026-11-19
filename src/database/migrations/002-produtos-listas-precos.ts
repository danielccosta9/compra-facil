// Versão 2: produtos, categorias, listas de compras, histórico de preços e notificações.
// Também converte os itens já salvos (versão 1) em produtos e histórico de preços.
export const migracao002 = `
CREATE TABLE product_categories (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT    NOT NULL UNIQUE
);

INSERT INTO product_categories (name) VALUES
  ('Mercearia'), ('Hortifruti'), ('Laticínios'), ('Carnes'), ('Padaria'),
  ('Bebidas'), ('Limpeza'), ('Higiene'), ('Outros');

CREATE TABLE products (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id     INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
  name            TEXT    NOT NULL,
  normalized_name TEXT    NOT NULL,
  package_size    REAL    CHECK (package_size IS NULL OR package_size > 0),
  package_unit    TEXT    CHECK (package_unit IS NULL OR package_unit IN ('kg', 'l', 'un')),
  is_demo         INTEGER NOT NULL DEFAULT 0 CHECK (is_demo IN (0, 1)),
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, normalized_name)
);

ALTER TABLE purchase_items
  ADD COLUMN product_id INTEGER REFERENCES products(id) ON DELETE SET NULL;

CREATE TABLE shopping_lists (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT    NOT NULL,
  is_demo      INTEGER NOT NULL DEFAULT 0 CHECK (is_demo IN (0, 1)),
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT
);

CREATE TABLE shopping_list_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  list_id     INTEGER NOT NULL REFERENCES shopping_lists(id) ON DELETE CASCADE,
  product_id  INTEGER REFERENCES products(id) ON DELETE SET NULL,
  description TEXT    NOT NULL,
  quantity    REAL    NOT NULL DEFAULT 1 CHECK (quantity > 0),
  checked     INTEGER NOT NULL DEFAULT 0 CHECK (checked IN (0, 1)),
  position    INTEGER NOT NULL DEFAULT 0
);

-- Cópia de cada preço pago. Apagar a compra NÃO apaga o histórico:
-- purchase_item_id vira NULL e o nome da loja fica guardado em store_name.
CREATE TABLE price_history (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id       INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  purchase_item_id INTEGER REFERENCES purchase_items(id) ON DELETE SET NULL,
  store_id         INTEGER REFERENCES stores(id) ON DELETE SET NULL,
  store_name       TEXT    NOT NULL,
  observed_at      TEXT    NOT NULL,
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  quantity         REAL    NOT NULL CHECK (quantity > 0),
  unit             TEXT    NOT NULL DEFAULT 'UN',
  is_demo          INTEGER NOT NULL DEFAULT 0 CHECK (is_demo IN (0, 1))
);

CREATE TABLE notifications (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          TEXT    NOT NULL CHECK (type IN ('lembrete_lista', 'preco_baixo')),
  title         TEXT    NOT NULL,
  body          TEXT    NOT NULL,
  scheduled_for TEXT,
  sent_at       TEXT,
  read_at       TEXT,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_products_user ON products(user_id);
CREATE INDEX idx_purchase_items_product ON purchase_items(product_id);
CREATE INDEX idx_shopping_lists_user ON shopping_lists(user_id);
CREATE INDEX idx_shopping_list_items_list ON shopping_list_items(list_id);
CREATE INDEX idx_price_history_product_date ON price_history(product_id, observed_at);
CREATE INDEX idx_price_history_user ON price_history(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, created_at);

-- Converte os itens da versão 1 em produtos (um por descrição, por usuário).
-- Produto só fica marcado como demonstração se TODOS os seus itens forem de demonstração.
INSERT INTO products (user_id, name, normalized_name, is_demo)
SELECT p.user_id, MIN(TRIM(i.description)), UPPER(TRIM(i.description)), MIN(p.is_demo)
  FROM purchase_items i
  JOIN purchases p ON p.id = i.purchase_id
 GROUP BY p.user_id, UPPER(TRIM(i.description));

UPDATE purchase_items
   SET product_id = (
     SELECT pr.id
       FROM products pr
       JOIN purchases p ON p.user_id = pr.user_id
      WHERE p.id = purchase_items.purchase_id
        AND pr.normalized_name = UPPER(TRIM(purchase_items.description))
   );

INSERT INTO price_history
  (user_id, product_id, purchase_item_id, store_id, store_name, observed_at,
   unit_price_cents, quantity, unit, is_demo)
SELECT p.user_id, i.product_id, i.id, s.id, s.name, p.purchased_at,
       i.unit_price_cents, i.quantity, i.unit, p.is_demo
  FROM purchase_items i
  JOIN purchases p ON p.id = i.purchase_id
  JOIN stores s ON s.id = p.store_id
 WHERE i.product_id IS NOT NULL;
`;
