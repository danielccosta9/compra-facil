import type { SQLiteDatabase } from 'expo-sqlite';
import { obterOuCriarProduto } from './produtos';
import type { ItemLista, ListaDetalhada, ListaResumida, UnidadeItem } from '@/types';

// Toda consulta confere o dono da lista (user_id) para um usuário não mexer na lista de outro.

export async function listarListas(
  db: SQLiteDatabase,
  usuarioId: number,
): Promise<ListaResumida[]> {
  const linhas = await db.getAllAsync<{
    id: number;
    name: string;
    created_at: string;
    completed_at: string | null;
    is_demo: number;
    total: number;
    marcados: number;
  }>(
    `SELECT l.id, l.name, l.created_at, l.completed_at, l.is_demo,
            COUNT(i.id) AS total,
            COALESCE(SUM(i.checked), 0) AS marcados
       FROM shopping_lists l
       LEFT JOIN shopping_list_items i ON i.list_id = l.id
      WHERE l.user_id = ?
      GROUP BY l.id
      ORDER BY l.completed_at IS NOT NULL, l.created_at DESC`,
    usuarioId,
  );
  return linhas.map((l) => ({
    id: l.id,
    nome: l.name,
    criadaEm: l.created_at,
    concluidaEm: l.completed_at,
    totalItens: l.total,
    itensMarcados: l.marcados,
    demonstracao: l.is_demo === 1,
  }));
}

export async function criarLista(db: SQLiteDatabase, usuarioId: number, nome: string) {
  const resultado = await db.runAsync(
    'INSERT INTO shopping_lists (user_id, name) VALUES (?, ?)',
    usuarioId,
    nome.trim(),
  );
  return resultado.lastInsertRowId;
}

export async function excluirLista(db: SQLiteDatabase, usuarioId: number, listaId: number) {
  await db.runAsync(
    'DELETE FROM shopping_lists WHERE id = ? AND user_id = ?',
    listaId,
    usuarioId,
  );
}

// concluida = true marca a data de conclusão; false reabre a lista.
export async function marcarListaConcluida(
  db: SQLiteDatabase,
  usuarioId: number,
  listaId: number,
  concluida: boolean,
) {
  await db.runAsync(
    `UPDATE shopping_lists
        SET completed_at = CASE WHEN ? THEN datetime('now') ELSE NULL END
      WHERE id = ? AND user_id = ?`,
    concluida ? 1 : 0,
    listaId,
    usuarioId,
  );
}

export async function buscarLista(
  db: SQLiteDatabase,
  usuarioId: number,
  listaId: number,
): Promise<ListaDetalhada | null> {
  const lista = await db.getFirstAsync<{
    id: number;
    name: string;
    completed_at: string | null;
    is_demo: number;
  }>(
    'SELECT id, name, completed_at, is_demo FROM shopping_lists WHERE id = ? AND user_id = ?',
    listaId,
    usuarioId,
  );
  if (!lista) return null;

  // O preço médio vem do histórico de preços do produto (NULL se nunca foi comprado).
  const itens = await db.getAllAsync<{
    id: number;
    description: string;
    quantity: number;
    unit: UnidadeItem;
    checked: number;
    position: number;
    product_id: number | null;
    preco_medio: number | null;
  }>(
    `SELECT i.id, i.description, i.quantity, i.unit, i.checked, i.position, i.product_id,
            (SELECT ROUND(AVG(h.unit_price_cents))
               FROM price_history h
              WHERE h.product_id = i.product_id) AS preco_medio
       FROM shopping_list_items i
      WHERE i.list_id = ?
      ORDER BY i.position`,
    listaId,
  );

  return {
    id: lista.id,
    nome: lista.name,
    concluidaEm: lista.completed_at,
    demonstracao: lista.is_demo === 1,
    itens: itens.map(
      (i): ItemLista => ({
        id: i.id,
        descricao: i.description,
        quantidade: i.quantity,
        unidade: i.unit,
        marcado: i.checked === 1,
        posicao: i.position,
        produtoId: i.product_id,
        precoMedioCentavos: i.preco_medio,
      }),
    ),
  };
}

type OpcoesItem = { demonstracao?: boolean };

export async function adicionarItemNaLista(
  db: SQLiteDatabase,
  usuarioId: number,
  listaId: number,
  descricao: string,
  quantidade: number,
  unidade: UnidadeItem,
  opcoes: OpcoesItem = {},
) {
  const dono = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM shopping_lists WHERE id = ? AND user_id = ?',
    listaId,
    usuarioId,
  );
  if (!dono) throw new Error('Lista não encontrada.');

  // Liga o item a um produto: assim a lista mostra o preço médio do histórico.
  const produtoId = await obterOuCriarProduto(db, usuarioId, descricao, {
    demonstracao: opcoes.demonstracao,
  });

  await db.runAsync(
    `INSERT INTO shopping_list_items (list_id, product_id, description, quantity, unit, position)
     VALUES (?, ?, ?, ?, ?,
             (SELECT COALESCE(MAX(position), -1) + 1 FROM shopping_list_items WHERE list_id = ?))`,
    listaId,
    produtoId,
    descricao.trim(),
    quantidade,
    unidade,
    listaId,
  );
}

export async function marcarItem(
  db: SQLiteDatabase,
  usuarioId: number,
  itemId: number,
  marcado: boolean,
) {
  await db.runAsync(
    `UPDATE shopping_list_items SET checked = ?
      WHERE id = ?
        AND list_id IN (SELECT id FROM shopping_lists WHERE user_id = ?)`,
    marcado ? 1 : 0,
    itemId,
    usuarioId,
  );
}

export async function removerItemDaLista(db: SQLiteDatabase, usuarioId: number, itemId: number) {
  await db.runAsync(
    `DELETE FROM shopping_list_items
      WHERE id = ?
        AND list_id IN (SELECT id FROM shopping_lists WHERE user_id = ?)`,
    itemId,
    usuarioId,
  );
}

export type SugestaoProduto = { nome: string; unidade: UnidadeItem };

// Produtos que o usuário mais compra e que ainda não estão na lista.
// A unidade sugerida é a da compra mais recente do produto (banana → KG, leite → UN).
export async function sugerirProdutos(
  db: SQLiteDatabase,
  usuarioId: number,
  listaId: number,
  limite = 6,
): Promise<SugestaoProduto[]> {
  const linhas = await db.getAllAsync<{ name: string; unit: UnidadeItem }>(
    `SELECT pr.name,
            (SELECT ultimo.unit FROM purchase_items ultimo
              WHERE ultimo.product_id = pr.id
              ORDER BY ultimo.id DESC LIMIT 1) AS unit
       FROM products pr
       JOIN purchase_items pi ON pi.product_id = pr.id
      WHERE pr.user_id = ?
        AND pr.id NOT IN (
          SELECT product_id FROM shopping_list_items
           WHERE list_id = ? AND product_id IS NOT NULL
        )
      GROUP BY pr.id
      ORDER BY COUNT(*) DESC, pr.name
      LIMIT ?`,
    usuarioId,
    listaId,
    limite,
  );
  return linhas.map((l) => ({ nome: l.name, unidade: l.unit }));
}
