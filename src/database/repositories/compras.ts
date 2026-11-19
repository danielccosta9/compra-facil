import type { SQLiteDatabase } from 'expo-sqlite';
import type { CompraResumida, NovaCompra, PrecoObservado } from '@/types';
import { obterOuCriarLoja } from './lojas';
import { obterOuCriarProduto } from './produtos';
import { registrarPreco } from './historicoPrecos';

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

// Preços vêm do histórico (price_history), já ligados ao produto normalizado.
// Assim o motor de economia continua funcionando mesmo depois de apagar uma compra.
export async function listarPrecosObservados(
  db: SQLiteDatabase,
  usuarioId: number,
): Promise<PrecoObservado[]> {
  const linhas = await db.getAllAsync<{
    product_id: number;
    name: string;
    store_name: string;
    unit_price_cents: number;
  }>(
    `SELECT h.product_id, pr.name, h.store_name, h.unit_price_cents
       FROM price_history h
       JOIN products pr ON pr.id = h.product_id
      WHERE h.user_id = ?`,
    usuarioId,
  );
  return linhas.map((l) => ({
    produto: l.name,
    produtoId: l.product_id,
    estabelecimento: l.store_name,
    precoCentavos: l.unit_price_cents,
  }));
}

// Salva a compra completa numa única transação:
// loja → compra → itens (cada um ligado ao seu produto) → histórico de preços.
export async function inserirCompra(
  db: SQLiteDatabase,
  usuarioId: number,
  compra: NovaCompra,
): Promise<number> {
  let compraId = 0;

  await db.withTransactionAsync(async () => {
    const lojaId = await obterOuCriarLoja(db, compra.loja);

    const resultado = await db.runAsync(
      `INSERT INTO purchases (user_id, store_id, purchased_at, total_cents, is_demo)
       VALUES (?, ?, ?, ?, 0)`,
      usuarioId,
      lojaId,
      compra.data,
      compra.totalCentavos,
    );
    compraId = resultado.lastInsertRowId;

    for (const item of compra.itens) {
      const produtoId = await obterOuCriarProduto(db, usuarioId, item.descricao);

      const itemCompra = await db.runAsync(
        `INSERT INTO purchase_items
           (purchase_id, product_id, description, quantity, unit, unit_price_cents, total_cents)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        compraId,
        produtoId,
        item.descricao,
        item.quantidade,
        item.unidade,
        item.precoUnitarioCentavos,
        item.totalCentavos,
      );

      await registrarPreco(db, {
        usuarioId,
        produtoId,
        itemCompraId: itemCompra.lastInsertRowId,
        lojaId,
        nomeLoja: compra.loja,
        data: compra.data,
        precoUnitarioCentavos: item.precoUnitarioCentavos,
        quantidade: item.quantidade,
        unidade: item.unidade,
      });
    }
  });

  return compraId;
}
