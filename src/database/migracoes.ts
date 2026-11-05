import type { SQLiteDatabase } from 'expo-sqlite';
import { migracao001 } from './migrations/001-inicial';

const migracoes = [migracao001];

export async function migrarBanco(db: SQLiteDatabase) {
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const linha = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let versao = linha?.user_version ?? 0;

  while (versao < migracoes.length) {
    const sql = migracoes[versao];
    await db.withTransactionAsync(async () => {
      await db.execAsync(sql);
    });
    versao++;
    await db.execAsync(`PRAGMA user_version = ${versao}`);
  }
}
