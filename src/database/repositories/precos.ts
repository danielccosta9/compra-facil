import type { SQLiteDatabase } from 'expo-sqlite';
import type { ObservacaoPreco } from '@/services/precos';
import type { Embalagem, ResumoPrecoProduto } from '@/types';

// Produtos com pelo menos um preço no histórico, com um resumo rápido.
export async function listarResumoDePrecos(
  db: SQLiteDatabase,
  usuarioId: number,
): Promise<ResumoPrecoProduto[]> {
  const linhas = await db.getAllAsync<{
    id: number;
    name: string;
    categoria: string | null;
    observacoes: number;
    ultimo: number;
    media: number;
    menor: number;
  }>(
    `SELECT pr.id, pr.name, c.name AS categoria,
            COUNT(h.id) AS observacoes,
            ROUND(AVG(h.unit_price_cents)) AS media,
            MIN(h.unit_price_cents) AS menor,
            (SELECT h2.unit_price_cents FROM price_history h2
              WHERE h2.product_id = pr.id
              ORDER BY h2.observed_at DESC, h2.id DESC LIMIT 1) AS ultimo
       FROM products pr
       JOIN price_history h ON h.product_id = pr.id
       LEFT JOIN product_categories c ON c.id = pr.category_id
      WHERE pr.user_id = ?
      GROUP BY pr.id
      ORDER BY pr.name`,
    usuarioId,
  );
  return linhas.map((l) => ({
    id: l.id,
    nome: l.name,
    categoria: l.categoria,
    observacoes: l.observacoes,
    ultimoCentavos: l.ultimo,
    mediaCentavos: l.media,
    menorCentavos: l.menor,
  }));
}

export type HistoricoProduto = {
  id: number;
  nome: string;
  categoria: string | null;
  embalagem: Embalagem | null;
  observacoes: ObservacaoPreco[]; // mais recentes primeiro
};

export async function buscarHistoricoDoProduto(
  db: SQLiteDatabase,
  usuarioId: number,
  produtoId: number,
): Promise<HistoricoProduto | null> {
  const produto = await db.getFirstAsync<{
    id: number;
    name: string;
    categoria: string | null;
    package_size: number | null;
    package_unit: 'kg' | 'l' | 'un' | null;
  }>(
    `SELECT pr.id, pr.name, c.name AS categoria, pr.package_size, pr.package_unit
       FROM products pr
       LEFT JOIN product_categories c ON c.id = pr.category_id
      WHERE pr.id = ? AND pr.user_id = ?`,
    produtoId,
    usuarioId,
  );
  if (!produto) return null;

  const linhas = await db.getAllAsync<{
    observed_at: string;
    store_name: string;
    unit_price_cents: number;
    quantity: number;
    unit: string;
  }>(
    `SELECT observed_at, store_name, unit_price_cents, quantity, unit
       FROM price_history
      WHERE product_id = ? AND user_id = ?
      ORDER BY observed_at DESC, id DESC`,
    produtoId,
    usuarioId,
  );

  return {
    id: produto.id,
    nome: produto.name,
    categoria: produto.categoria,
    embalagem:
      produto.package_size && produto.package_unit
        ? { tamanho: produto.package_size, unidade: produto.package_unit }
        : null,
    observacoes: linhas.map((l) => ({
      data: l.observed_at,
      loja: l.store_name,
      precoCentavos: l.unit_price_cents,
      quantidade: l.quantity,
      unidade: l.unit,
    })),
  };
}
