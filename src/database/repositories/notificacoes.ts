import type { SQLiteDatabase } from 'expo-sqlite';
import type { PrecoParaComparar } from '@/services/notificacoes';
import { paraISO } from '@/utils/datas';
import type { Notificacao, NovaNotificacao } from '@/types';

type LinhaNotificacao = {
  id: number;
  type: Notificacao['tipo'];
  title: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

function paraNotificacao(linha: LinhaNotificacao): Notificacao {
  return {
    id: linha.id,
    tipo: linha.type,
    titulo: linha.title,
    texto: linha.body,
    criadaEm: linha.created_at,
    lida: linha.read_at !== null,
  };
}

export async function inserirNotificacoes(
  db: SQLiteDatabase,
  usuarioId: number,
  notificacoes: NovaNotificacao[],
  agora = new Date(),
) {
  // Gravamos a data local (mesmo formato das compras), e não o datetime('now') do SQLite, que é UTC.
  const criadaEm = paraISO(agora);
  for (const n of notificacoes) {
    await db.runAsync(
      `INSERT INTO notifications (user_id, type, title, body, sent_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      usuarioId,
      n.tipo,
      n.titulo,
      n.texto,
      criadaEm,
      criadaEm,
    );
  }
}

export async function listarNotificacoes(db: SQLiteDatabase, usuarioId: number, limite = 50) {
  const linhas = await db.getAllAsync<LinhaNotificacao>(
    `SELECT id, type, title, body, created_at, read_at
       FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC, id DESC
      LIMIT ?`,
    usuarioId,
    limite,
  );
  return linhas.map(paraNotificacao);
}

export async function contarNaoLidas(db: SQLiteDatabase, usuarioId: number) {
  const linha = await db.getFirstAsync<{ total: number }>(
    `SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND read_at IS NULL`,
    usuarioId,
  );
  return linha?.total ?? 0;
}

export async function marcarTodasComoLidas(db: SQLiteDatabase, usuarioId: number) {
  await db.runAsync(
    `UPDATE notifications SET read_at = ? WHERE user_id = ? AND read_at IS NULL`,
    paraISO(new Date()),
    usuarioId,
  );
}

export async function apagarNotificacoes(db: SQLiteDatabase, usuarioId: number) {
  await db.runAsync(`DELETE FROM notifications WHERE user_id = ?`, usuarioId);
}

// Para cada item da compra recém-salva: o preço pago nela e os preços ANTERIORES do mesmo produto.
// "Anterior" = qualquer registro do histórico que não veio desta compra.
export async function precosParaComparar(
  db: SQLiteDatabase,
  usuarioId: number,
  compraId: number,
): Promise<PrecoParaComparar[]> {
  const linhas = await db.getAllAsync<{
    product_id: number;
    name: string;
    unit_price_cents: number;
    desta_compra: number;
  }>(
    `SELECT h.product_id, pr.name, h.unit_price_cents,
            (i.purchase_id IS NOT NULL AND i.purchase_id = ?) AS desta_compra
       FROM price_history h
       JOIN products pr ON pr.id = h.product_id
       LEFT JOIN purchase_items i ON i.id = h.purchase_item_id
      WHERE h.user_id = ?
        AND h.product_id IN (SELECT product_id FROM purchase_items WHERE purchase_id = ?)`,
    compraId,
    usuarioId,
    compraId,
  );

  const porProduto = new Map<number, PrecoParaComparar>();
  for (const l of linhas) {
    const atual = porProduto.get(l.product_id) ?? {
      produto: l.name,
      precoCentavos: 0,
      anteriores: [],
    };
    if (l.desta_compra) atual.precoCentavos = l.unit_price_cents;
    else atual.anteriores.push(l.unit_price_cents);
    porProduto.set(l.product_id, atual);
  }
  return [...porProduto.values()];
}
