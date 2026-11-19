import type { SQLiteDatabase } from 'expo-sqlite';
import { extrairEmbalagem, normalizarNome } from '@/utils/produtos';
import type { Categoria, Produto } from '@/types';

type LinhaProduto = {
  id: number;
  name: string;
  category_id: number | null;
  package_size: number | null;
  package_unit: 'kg' | 'l' | 'un' | null;
  is_demo: number;
};

function paraProduto(linha: LinhaProduto): Produto {
  return {
    id: linha.id,
    nome: linha.name,
    categoriaId: linha.category_id,
    embalagem:
      linha.package_size && linha.package_unit
        ? { tamanho: linha.package_size, unidade: linha.package_unit }
        : null,
    demonstracao: linha.is_demo === 1,
  };
}

export async function listarCategorias(db: SQLiteDatabase): Promise<Categoria[]> {
  const linhas = await db.getAllAsync<{ id: number; name: string }>(
    'SELECT id, name FROM product_categories ORDER BY name',
  );
  return linhas.map((l) => ({ id: l.id, nome: l.name }));
}

export async function idDaCategoria(db: SQLiteDatabase, nome: string) {
  const linha = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM product_categories WHERE name = ?',
    nome,
  );
  return linha?.id ?? null;
}

export async function listarProdutos(db: SQLiteDatabase, usuarioId: number) {
  const linhas = await db.getAllAsync<LinhaProduto>(
    `SELECT id, name, category_id, package_size, package_unit, is_demo
       FROM products
      WHERE user_id = ?
      ORDER BY name`,
    usuarioId,
  );
  return linhas.map(paraProduto);
}

type OpcoesProduto = {
  categoriaId?: number | null;
  demonstracao?: boolean;
};

// Procura o produto pelo nome normalizado; se não existir, cria.
// A embalagem é lida da própria descrição ("CAFE 500G" → 0,5 kg).
export async function obterOuCriarProduto(
  db: SQLiteDatabase,
  usuarioId: number,
  descricao: string,
  opcoes: OpcoesProduto = {},
): Promise<number> {
  const normalizado = normalizarNome(descricao);

  const existente = await db.getFirstAsync<{ id: number; is_demo: number }>(
    'SELECT id, is_demo FROM products WHERE user_id = ? AND normalized_name = ?',
    usuarioId,
    normalizado,
  );

  if (existente) {
    // Um produto de demonstração usado numa compra real passa a ser real.
    if (existente.is_demo === 1 && !opcoes.demonstracao) {
      await db.runAsync('UPDATE products SET is_demo = 0 WHERE id = ?', existente.id);
    }
    return existente.id;
  }

  const embalagem = extrairEmbalagem(descricao);
  const resultado = await db.runAsync(
    `INSERT INTO products
       (user_id, category_id, name, normalized_name, package_size, package_unit, is_demo)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    usuarioId,
    opcoes.categoriaId ?? null,
    descricao.trim(),
    normalizado,
    embalagem?.tamanho ?? null,
    embalagem?.unidade ?? null,
    opcoes.demonstracao ? 1 : 0,
  );
  return resultado.lastInsertRowId;
}
