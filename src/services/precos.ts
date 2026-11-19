import { classificarObservacoes, media, type NivelConfianca } from '@/services/economia';
import type { Embalagem } from '@/types';

// Um preço pago, como vem do histórico (price_history).
export type ObservacaoPreco = {
  data: string; // ISO
  loja: string;
  precoCentavos: number; // preço unitário (ou por kg, quando a unidade é KG)
  quantidade: number;
  unidade: string; // 'UN' | 'KG'
};

export type PrecoPorMedida = { valorCentavos: number; unidade: 'kg' | 'l' };

export type IndicadoresPreco = {
  observacoes: number;
  nivel: NivelConfianca;
  menorCentavos: number;
  maiorCentavos: number;
  mediaCentavos: number;
  medianaCentavos: number;
  ultimoCentavos: number;
  ultimaData: string;
  ultimaLoja: string;
  variacaoPercentual: number; // último preço comparado com a média (negativo = mais barato)
  precoPorMedida: PrecoPorMedida | null; // média convertida para R$/kg ou R$/L
  porLoja: { loja: string; mediaCentavos: number; menorCentavos: number; observacoes: number }[];
  porDiaDaSemana: { dia: number; nome: string; mediaCentavos: number; observacoes: number }[];
};

const nomesDosDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function mediana(valores: number[]): number {
  if (valores.length === 0) return 0;
  const ordenados = [...valores].sort((a, b) => a - b);
  const meio = Math.floor(ordenados.length / 2);
  return ordenados.length % 2 === 0
    ? (ordenados[meio - 1] + ordenados[meio]) / 2
    : ordenados[meio];
}

// Converte um preço para R$/kg ou R$/L.
// Item vendido por KG já está em R$/kg. Item por UN usa o tamanho da embalagem:
// Arroz 5 kg a R$ 25,00 → R$ 5,00/kg. Sem embalagem conhecida → null.
export function precoPorMedida(
  precoCentavos: number,
  unidadeItem: string,
  embalagem: Embalagem | null,
): PrecoPorMedida | null {
  if (unidadeItem === 'KG') return { valorCentavos: Math.round(precoCentavos), unidade: 'kg' };
  if (!embalagem || embalagem.unidade === 'un') return null;
  return {
    valorCentavos: Math.round(precoCentavos / embalagem.tamanho),
    unidade: embalagem.unidade,
  };
}

function agrupar<T>(lista: T[], chave: (item: T) => string | number) {
  const grupos = new Map<string | number, T[]>();
  for (const item of lista) {
    const k = chave(item);
    grupos.set(k, [...(grupos.get(k) ?? []), item]);
  }
  return grupos;
}

// Calcula todos os indicadores de um produto a partir do seu histórico de preços.
// Lembrete: são médias do histórico PESSOAL, não o preço atual das lojas.
export function calcularIndicadores(
  observacoes: ObservacaoPreco[],
  embalagem: Embalagem | null,
): IndicadoresPreco | null {
  if (observacoes.length === 0) return null;

  const precos = observacoes.map((o) => o.precoCentavos);
  const mediaGeral = media(precos);
  const ultima = [...observacoes].sort((a, b) => b.data.localeCompare(a.data))[0];

  const porLoja = [...agrupar(observacoes, (o) => o.loja)]
    .map(([loja, itens]) => ({
      loja: String(loja),
      mediaCentavos: Math.round(media(itens.map((i) => i.precoCentavos))),
      menorCentavos: Math.min(...itens.map((i) => i.precoCentavos)),
      observacoes: itens.length,
    }))
    .sort((a, b) => a.mediaCentavos - b.mediaCentavos);

  const porDiaDaSemana = [...agrupar(observacoes, (o) => new Date(o.data).getDay())]
    .map(([dia, itens]) => ({
      dia: Number(dia),
      nome: nomesDosDias[Number(dia)],
      mediaCentavos: Math.round(media(itens.map((i) => i.precoCentavos))),
      observacoes: itens.length,
    }))
    .sort((a, b) => a.dia - b.dia);

  return {
    observacoes: observacoes.length,
    nivel: classificarObservacoes(observacoes.length),
    menorCentavos: Math.min(...precos),
    maiorCentavos: Math.max(...precos),
    mediaCentavos: Math.round(mediaGeral),
    medianaCentavos: Math.round(mediana(precos)),
    ultimoCentavos: ultima.precoCentavos,
    ultimaData: ultima.data,
    ultimaLoja: ultima.loja,
    variacaoPercentual: Math.round(((ultima.precoCentavos - mediaGeral) / mediaGeral) * 100),
    precoPorMedida: precoPorMedida(mediaGeral, ultima.unidade, embalagem),
    porLoja,
    porDiaDaSemana,
  };
}
