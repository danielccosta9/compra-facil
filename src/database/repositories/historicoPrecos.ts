import type { SQLiteDatabase } from 'expo-sqlite';

type NovoPreco = {
  usuarioId: number;
  produtoId: number;
  itemCompraId: number | null;
  lojaId: number;
  nomeLoja: string;
  data: string;
  precoUnitarioCentavos: number;
  quantidade: number;
  unidade: string;
  demonstracao?: boolean;
};

// Guarda uma CÓPIA do preço pago. Se a compra for apagada, o histórico continua.
export async function registrarPreco(db: SQLiteDatabase, preco: NovoPreco) {
  await db.runAsync(
    `INSERT INTO price_history
       (user_id, product_id, purchase_item_id, store_id, store_name, observed_at,
        unit_price_cents, quantity, unit, is_demo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    preco.usuarioId,
    preco.produtoId,
    preco.itemCompraId,
    preco.lojaId,
    preco.nomeLoja,
    preco.data,
    preco.precoUnitarioCentavos,
    preco.quantidade,
    preco.unidade,
    preco.demonstracao ? 1 : 0,
  );
}
