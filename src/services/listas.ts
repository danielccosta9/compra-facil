import { textoParaNumero, type Erros } from '@/utils/validacao';
import type { ItemLista } from '@/types';

export type ResumoLista = {
  total: number;
  marcados: number;
  estimadoCentavos: number; // custo estimado dos itens com preço conhecido
  restanteCentavos: number; // parte estimada que ainda falta comprar
  itensSemPreco: number;
};

// Conta os itens e estima o custo a partir da média do histórico de cada produto.
export function resumoDaLista(itens: ItemLista[]): ResumoLista {
  let estimadoCentavos = 0;
  let restanteCentavos = 0;
  let itensSemPreco = 0;

  for (const item of itens) {
    if (item.precoMedioCentavos === null) {
      itensSemPreco++;
      continue;
    }
    const custo = Math.round(item.precoMedioCentavos * item.quantidade);
    estimadoCentavos += custo;
    if (!item.marcado) restanteCentavos += custo;
  }

  return {
    total: itens.length,
    marcados: itens.filter((i) => i.marcado).length,
    estimadoCentavos,
    restanteCentavos,
    itensSemPreco,
  };
}

// Itens ainda não comprados primeiro; dentro de cada grupo, a ordem em que foram adicionados.
export function ordenarItens(itens: ItemLista[]): ItemLista[] {
  return [...itens].sort(
    (a, b) => Number(a.marcado) - Number(b.marcado) || a.posicao - b.posicao,
  );
}

export function validarNomeLista(nome: string): Erros {
  return nome.trim().length < 2 ? { nome: 'Dê um nome para a lista.' } : {};
}

export function validarItemLista(descricao: string, quantidade: string): Erros {
  const erros: Erros = {};
  if (descricao.trim().length < 2) erros.descricao = 'Informe o produto.';
  const numero = textoParaNumero(quantidade);
  if (!numero || numero <= 0) erros.quantidade = 'Quantidade inválida.';
  return erros;
}
