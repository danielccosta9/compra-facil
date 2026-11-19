import type { SQLiteDatabase } from 'expo-sqlite';
import type { Usuario } from '@/types';

type LinhaUsuario = { id: number; name: string; email: string; password_hash: string };

export async function buscarUsuarioPorEmail(db: SQLiteDatabase, email: string) {
  return db.getFirstAsync<LinhaUsuario>('SELECT * FROM users WHERE email = ?', email);
}

export async function buscarUsuarioPorId(
  db: SQLiteDatabase,
  id: number,
): Promise<Usuario | null> {
  const linha = await db.getFirstAsync<LinhaUsuario>(
    'SELECT * FROM users WHERE id = ?',
    id,
  );
  return linha ? { id: linha.id, nome: linha.name, email: linha.email } : null;
}

export async function inserirUsuario(
  db: SQLiteDatabase,
  nome: string,
  email: string,
  hash: string,
) {
  const resultado = await db.runAsync(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    nome,
    email,
    hash,
  );
  return resultado.lastInsertRowId;
}
