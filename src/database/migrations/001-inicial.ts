export const migracao001 = `
CREATE TABLE users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT    NOT NULL,
  email         TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE app_settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE stores (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  name    TEXT    NOT NULL,
  cnpj    TEXT    UNIQUE,
  is_demo INTEGER NOT NULL DEFAULT 0 CHECK (is_demo IN (0, 1))
);

CREATE TABLE purchases (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  store_id     INTEGER NOT NULL REFERENCES stores(id) ON DELETE RESTRICT,
  purchased_at TEXT    NOT NULL,
  total_cents  INTEGER NOT NULL CHECK (total_cents >= 0),
  access_key   TEXT    UNIQUE,
  is_demo      INTEGER NOT NULL DEFAULT 0 CHECK (is_demo IN (0, 1)),
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE purchase_items (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_id      INTEGER NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  description      TEXT    NOT NULL,
  quantity         REAL    NOT NULL CHECK (quantity > 0),
  unit             TEXT    NOT NULL DEFAULT 'UN',
  unit_price_cents INTEGER NOT NULL CHECK (unit_price_cents >= 0),
  total_cents      INTEGER NOT NULL CHECK (total_cents >= 0)
);

CREATE INDEX idx_purchases_user_date ON purchases(user_id, purchased_at);
CREATE INDEX idx_purchase_items_purchase ON purchase_items(purchase_id);
`;
