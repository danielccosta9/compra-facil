import type { SQLiteDatabase } from 'expo-sqlite';

export async function lerConfiguracao(db: SQLiteDatabase, chave: string) {
  const linha = await db.getFirstAsync<{ value: string | null }>(
    'SELECT value FROM app_settings WHERE key = ?',
    chave,
  );
  return linha?.value ?? null;
}

export async function salvarConfiguracao(
  db: SQLiteDatabase,
  chave: string,
  valor: string | null,
) {
  await db.runAsync(
    `INSERT INTO app_settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    chave,
    valor,
  );
}
