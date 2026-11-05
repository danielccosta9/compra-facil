import type { SQLiteDatabase } from 'expo-sqlite';
import { subDays } from 'date-fns';
import { paraISO } from '@/utils/datas';

const lojas = [
  { nome: 'Mercado Bom Preço (demo)', fator: 1.0 },
  { nome: 'Super Vila Verde (demo)', fator: 1.08 },
  { nome: 'Atacado Central (demo)', fator: 0.93 },
];

const catalogo = [
  { nome: 'ARROZ TIPO 1 5KG', preco: 2590, unidade: 'UN' },
  { nome: 'FEIJAO CARIOCA 1KG', preco: 849, unidade: 'UN' },
  { nome: 'CAFE TORRADO 500G', preco: 1890, unidade: 'UN' },
  { nome: 'LEITE INTEGRAL 1L', preco: 549, unidade: 'UN' },
  { nome: 'OLEO DE SOJA 900ML', preco: 799, unidade: 'UN' },
  { nome: 'ACUCAR CRISTAL 1KG', preco: 479, unidade: 'UN' },
  { nome: 'BANANA PRATA', preco: 699, unidade: 'KG' },
  { nome: 'DETERGENTE 500ML', preco: 259, unidade: 'UN' },
];

function sortear(maximo: number) {
  return Math.floor(Math.random() * maximo);
}

export async function inserirDadosDemonstracao(db: SQLiteDatabase, usuarioId: number) {
  await db.withTransactionAsync(async () => {
    const idsLojas: number[] = [];
    for (const loja of lojas) {
      const r = await db.runAsync(
        'INSERT INTO stores (name, is_demo) VALUES (?, 1)',
        loja.nome,
      );
      idsLojas.push(r.lastInsertRowId);
    }

    for (let n = 0; n < 14; n++) {
      const indiceLoja = n % lojas.length;
      const data = paraISO(subDays(new Date(), n * 8 + sortear(5)));
      const compra = await db.runAsync(
        `INSERT INTO purchases (user_id, store_id, purchased_at, total_cents, is_demo)
         VALUES (?, ?, ?, 0, 1)`,
        usuarioId,
        idsLojas[indiceLoja],
        data,
      );

      let total = 0;
      const itens = catalogo.filter(() => Math.random() < 0.7);
      for (const item of itens) {
        const variacao = 1 + (sortear(11) - 5) / 100;
        const preco = Math.round(item.preco * lojas[indiceLoja].fator * variacao);
        const quantidade = item.unidade === 'KG' ? 1.5 : 1 + sortear(2);
        const totalItem = Math.round(preco * quantidade);
        total += totalItem;
        await db.runAsync(
          `INSERT INTO purchase_items
             (purchase_id, description, quantity, unit, unit_price_cents, total_cents)
           VALUES (?, ?, ?, ?, ?, ?)`,
          compra.lastInsertRowId,
          item.nome,
          quantidade,
          item.unidade,
          preco,
          totalItem,
        );
      }
      await db.runAsync(
        'UPDATE purchases SET total_cents = ? WHERE id = ?',
        total,
        compra.lastInsertRowId,
      );
    }
  });
}

export async function removerDadosDemonstracao(db: SQLiteDatabase, usuarioId: number) {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'DELETE FROM purchases WHERE user_id = ? AND is_demo = 1',
      usuarioId,
    );
    await db.runAsync(
      'DELETE FROM stores WHERE is_demo = 1 AND id NOT IN (SELECT store_id FROM purchases)',
    );
  });
}

export async function possuiDadosDemonstracao(db: SQLiteDatabase, usuarioId: number) {
  const linha = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) AS total FROM purchases WHERE user_id = ? AND is_demo = 1',
    usuarioId,
  );
  return (linha?.total ?? 0) > 0;
}
