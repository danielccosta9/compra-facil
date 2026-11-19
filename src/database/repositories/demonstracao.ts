import type { SQLiteDatabase } from 'expo-sqlite';
import { subDays } from 'date-fns';
import { paraISO } from '@/utils/datas';
import { idDaCategoria, obterOuCriarProduto } from './produtos';
import { registrarPreco } from './historicoPrecos';

const lojas = [
  { nome: 'Mercado Bom Preço (demo)', fator: 1.0 },
  { nome: 'Super Vila Verde (demo)', fator: 1.08 },
  { nome: 'Atacado Central (demo)', fator: 0.93 },
];

const catalogo = [
  { nome: 'ARROZ TIPO 1 5KG', preco: 2590, unidade: 'UN', categoria: 'Mercearia' },
  { nome: 'FEIJAO CARIOCA 1KG', preco: 849, unidade: 'UN', categoria: 'Mercearia' },
  { nome: 'CAFE TORRADO 500G', preco: 1890, unidade: 'UN', categoria: 'Mercearia' },
  { nome: 'LEITE INTEGRAL 1L', preco: 549, unidade: 'UN', categoria: 'Laticínios' },
  { nome: 'OLEO DE SOJA 900ML', preco: 799, unidade: 'UN', categoria: 'Mercearia' },
  { nome: 'ACUCAR CRISTAL 1KG', preco: 479, unidade: 'UN', categoria: 'Mercearia' },
  { nome: 'BANANA PRATA', preco: 699, unidade: 'KG', categoria: 'Hortifruti' },
  { nome: 'DETERGENTE 500ML', preco: 259, unidade: 'UN', categoria: 'Limpeza' },
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

    // Um produto para cada item do catálogo, já com categoria e embalagem.
    const idsProdutos: number[] = [];
    for (const item of catalogo) {
      const categoriaId = await idDaCategoria(db, item.categoria);
      idsProdutos.push(
        await obterOuCriarProduto(db, usuarioId, item.nome, {
          categoriaId,
          demonstracao: true,
        }),
      );
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
      for (const [indice, item] of catalogo.entries()) {
        if (Math.random() >= 0.7) continue; // cada compra leva ~70% do catálogo

        const variacao = 1 + (sortear(11) - 5) / 100;
        const preco = Math.round(item.preco * lojas[indiceLoja].fator * variacao);
        const quantidade = item.unidade === 'KG' ? 1.5 : 1 + sortear(2);
        const totalItem = Math.round(preco * quantidade);
        total += totalItem;

        const itemCompra = await db.runAsync(
          `INSERT INTO purchase_items
             (purchase_id, product_id, description, quantity, unit, unit_price_cents, total_cents)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          compra.lastInsertRowId,
          idsProdutos[indice],
          item.nome,
          quantidade,
          item.unidade,
          preco,
          totalItem,
        );

        await registrarPreco(db, {
          usuarioId,
          produtoId: idsProdutos[indice],
          itemCompraId: itemCompra.lastInsertRowId,
          lojaId: idsLojas[indiceLoja],
          nomeLoja: lojas[indiceLoja].nome,
          data,
          precoUnitarioCentavos: preco,
          quantidade,
          unidade: item.unidade,
          demonstracao: true,
        });
      }
      await db.runAsync(
        'UPDATE purchases SET total_cents = ? WHERE id = ?',
        total,
        compra.lastInsertRowId,
      );
    }

    // Uma lista de compras de exemplo, com dois itens já marcados.
    const lista = await db.runAsync(
      "INSERT INTO shopping_lists (user_id, name, is_demo) VALUES (?, 'Compras da semana (demo)', 1)",
      usuarioId,
    );
    const itensDaLista = [
      { indice: 0, quantidade: 1, marcado: 1 }, // arroz
      { indice: 1, quantidade: 2, marcado: 1 }, // feijão
      { indice: 3, quantidade: 6, marcado: 0 }, // leite
      { indice: 2, quantidade: 1, marcado: 0 }, // café
      { indice: 6, quantidade: 1.5, marcado: 0 }, // banana (kg)
    ];
    for (const [posicao, item] of itensDaLista.entries()) {
      await db.runAsync(
        `INSERT INTO shopping_list_items
           (list_id, product_id, description, quantity, unit, checked, position)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        lista.lastInsertRowId,
        idsProdutos[item.indice],
        catalogo[item.indice].nome,
        item.quantidade,
        catalogo[item.indice].unidade,
        item.marcado,
        posicao,
      );
    }
  });
}

export async function removerDadosDemonstracao(db: SQLiteDatabase, usuarioId: number) {
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      'DELETE FROM price_history WHERE user_id = ? AND is_demo = 1',
      usuarioId,
    );
    await db.runAsync(
      'DELETE FROM purchases WHERE user_id = ? AND is_demo = 1',
      usuarioId,
    );
    await db.runAsync(
      'DELETE FROM shopping_lists WHERE user_id = ? AND is_demo = 1',
      usuarioId,
    );
    // Só apaga produtos de demonstração que nada real esteja usando.
    await db.runAsync(
      `DELETE FROM products
        WHERE user_id = ? AND is_demo = 1
          AND id NOT IN (SELECT product_id FROM purchase_items WHERE product_id IS NOT NULL)
          AND id NOT IN (SELECT product_id FROM price_history)
          AND id NOT IN (SELECT product_id FROM shopping_list_items WHERE product_id IS NOT NULL)`,
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
