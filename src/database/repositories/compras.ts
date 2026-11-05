import type { SQLiteDatabase } from 'expo-sqlite';
import type { CompraResumida, PrecoObservado } from '@/types';

type LinhaCompra = {
  id: number;
  store_name: string;
  purchased_at: string;
  total_cents: number;
  item_count: number;
  is_demo: number;
};

function paraCompra(linha: LinhaCompra): CompraResumida {
  return {
    id: linha.id,
    estabelecimento: linha.store_name,
    data: linha.purchased_at,
    totalCentavos: linha.total_cents,
    quantidadeItens: linha.item_count,
    demonstracao: linha.is_demo === 1,
  };
}

export async function totaisDoPeriodo(
  db: SQLiteDatabase,
  usuarioId: number,
  inicio: string,
  fim: string,
) {
  const linha = await db.getFirstAsync<{ total: number; quantidade: number }>(
    `SELECT COALESCE(SUM(total_cents), 0) AS total, COUNT(*) AS quantidade
       FROM purchases
      WHERE user_id = ? AND purchased_at >= ? AND purchased_at < ?`,
    usuarioId,
    inicio,
    fim,
  );
  return { totalCentavos: linha?.total ?? 0, quantidade: linha?.quantidade ?? 0 };
}

export async function listarCompras(db: SQLiteDatabase, usuarioId: number, limite = 100) {
  const linhas = await db.getAllAsync<LinhaCompra>(
    `SELECT p.id, s.name AS store_name, p.purchased_at, p.total_cents, p.is_demo,
            (SELECT COUNT(*) FROM purchase_items i WHERE i.purchase_id = p.id) AS item_count
       FROM purchases p
       JOIN stores s ON s.id = p.store_id
      WHERE p.user_id = ?
      ORDER BY p.purchased_at DESC
      LIMIT ?`,
    usuarioId,
    limite,
  );
  return linhas.map(paraCompra);
}

export async function listarPrecosObservados(
  db: SQLiteDatabase,
  usuarioId: number,
): Promise<PrecoObservado[]> {
  const linhas = await db.getAllAsync<{
    description: string;
    store_name: string;
    unit_price_cents: number;
  }>(
    `SELECT i.description, s.name AS store_name, i.unit_price_cents
       FROM purchase_items i
       JOIN purchases p ON p.id = i.purchase_id
       JOIN stores s ON s.id = p.store_id
      WHERE p.user_id = ?`,
    usuarioId,
  );
  return linhas.map((l) => ({
    produto: l.description,
    estabelecimento: l.store_name,
    precoCentavos: l.unit_price_cents,
  }));
}
