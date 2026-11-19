import type { Embalagem } from '@/types';

// "  arroz   tipo 1 " → "ARROZ TIPO 1" — usado para reconhecer o mesmo produto.
export function normalizarNome(nome: string): string {
  return nome.trim().replace(/\s+/g, ' ').toUpperCase();
}

// Lê o tamanho da embalagem na descrição e converte para kg ou litros.
// "CAFE 500G" → { tamanho: 0.5, unidade: 'kg' } · "BANANA PRATA" → null
export function extrairEmbalagem(descricao: string): Embalagem | null {
  const encontrados = [...descricao.matchAll(/(\d+(?:[.,]\d+)?)\s*(KG|G|ML|L)\b/gi)];
  const ultimo = encontrados[encontrados.length - 1];
  if (!ultimo) return null;

  const numero = Number(ultimo[1].replace(',', '.'));
  if (!(numero > 0)) return null;

  switch (ultimo[2].toUpperCase()) {
    case 'KG':
      return { tamanho: numero, unidade: 'kg' };
    case 'G':
      return { tamanho: numero / 1000, unidade: 'kg' };
    case 'L':
      return { tamanho: numero, unidade: 'l' };
    default:
      return { tamanho: numero / 1000, unidade: 'l' };
  }
}
