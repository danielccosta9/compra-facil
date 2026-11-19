import type { SQLiteDatabase } from 'expo-sqlite';

// Procura a loja pelo nome (sem diferenciar maiúsculas); se não existir, cria.
// Lojas de demonstração nunca são reaproveitadas em compras reais.
export async function obterOuCriarLoja(db: SQLiteDatabase, nome: string): Promise<number> {
  const existente = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM stores WHERE name = ? COLLATE NOCASE AND is_demo = 0',
    nome.trim(),
  );
  if (existente) return existente.id;

  const resultado = await db.runAsync(
    'INSERT INTO stores (name, is_demo) VALUES (?, 0)',
    nome.trim(),
  );
  return resultado.lastInsertRowId;
}

// Lojas onde o usuário comprou por último (para sugerir no formulário).
export async function listarLojasRecentes(db: SQLiteDatabase, usuarioId: number, limite = 5) {
  const linhas = await db.getAllAsync<{ name: string }>(
    `SELECT s.name
       FROM stores s
       JOIN purchases p ON p.store_id = s.id
      WHERE p.user_id = ? AND s.is_demo = 0
      GROUP BY s.id
      ORDER BY MAX(p.purchased_at) DESC
      LIMIT ?`,
    usuarioId,
    limite,
  );
  return linhas.map((l) => l.name);
}
