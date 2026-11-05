import * as Crypto from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';
import { buscarUsuarioPorEmail, inserirUsuario } from '@/database/repositories/usuarios';
import type { Usuario } from '@/types';

async function gerarHash(senha: string, sal: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, sal + senha);
}

export async function cadastrarUsuario(
  db: SQLiteDatabase,
  nome: string,
  email: string,
  senha: string,
): Promise<Usuario> {
  const emailNormalizado = email.trim().toLowerCase();
  const existente = await buscarUsuarioPorEmail(db, emailNormalizado);
  if (existente) throw new Error('Já existe uma conta com este e-mail.');

  const sal = Crypto.randomUUID();
  const hash = await gerarHash(senha, sal);
  const id = await inserirUsuario(db, nome.trim(), emailNormalizado, `${sal}:${hash}`);
  return { id, nome: nome.trim(), email: emailNormalizado };
}

export async function entrarComEmail(
  db: SQLiteDatabase,
  email: string,
  senha: string,
): Promise<Usuario> {
  const linha = await buscarUsuarioPorEmail(db, email.trim().toLowerCase());
  if (!linha) throw new Error('E-mail ou senha incorretos.');

  const [sal, hashSalvo] = linha.password_hash.split(':');
  const hash = await gerarHash(senha, sal);
  if (hash !== hashSalvo) throw new Error('E-mail ou senha incorretos.');

  return { id: linha.id, nome: linha.name, email: linha.email };
}
