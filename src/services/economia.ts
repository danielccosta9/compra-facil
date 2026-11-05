import type { PrecoObservado } from '@/types';

export type NivelConfianca = 'insuficiente' | 'inicial' | 'moderada' | 'consistente';

export type Oportunidade = {
  produto: string;
  estabelecimentoMaisBarato: string;
  mediaMaisBarataCentavos: number;
  mediaGeralCentavos: number;
  economiaPercentual: number;
  observacoes: number;
  nivel: NivelConfianca;
};

export function classificarObservacoes(quantidade: number): NivelConfianca {
  if (quantidade >= 10) return 'consistente';
  if (quantidade >= 5) return 'moderada';
  if (quantidade >= 3) return 'inicial';
  return 'insuficiente';
}

export function media(valores: number[]): number {
  if (valores.length === 0) return 0;
  return valores.reduce((soma, v) => soma + v, 0) / valores.length;
}

function agruparPor<T>(lista: T[], chave: (item: T) => string) {
  const grupos = new Map<string, T[]>();
  for (const item of lista) {
    const k = chave(item);
    grupos.set(k, [...(grupos.get(k) ?? []), item]);
  }
  return grupos;
}

export function encontrarOportunidades(
  precos: PrecoObservado[],
  limite = 3,
): Oportunidade[] {
  const oportunidades: Oportunidade[] = [];
  const porProduto = agruparPor(precos, (p) => p.produto.trim().toUpperCase());

  for (const [produto, registros] of porProduto) {
    const nivel = classificarObservacoes(registros.length);
    if (nivel === 'insuficiente') continue;

    const porLoja = agruparPor(registros, (r) => r.estabelecimento);
    if (porLoja.size < 2) continue;

    const medias = [...porLoja].map(([loja, itens]) => ({
      loja,
      media: media(itens.map((i) => i.precoCentavos)),
    }));
    medias.sort((a, b) => a.media - b.media);

    const mediaGeral = media(registros.map((r) => r.precoCentavos));
    const economia = ((mediaGeral - medias[0].media) / mediaGeral) * 100;
    if (economia < 2) continue;

    oportunidades.push({
      produto,
      estabelecimentoMaisBarato: medias[0].loja,
      mediaMaisBarataCentavos: Math.round(medias[0].media),
      mediaGeralCentavos: Math.round(mediaGeral),
      economiaPercentual: Math.round(economia),
      observacoes: registros.length,
      nivel,
    });
  }

  return oportunidades
    .sort((a, b) => b.economiaPercentual - a.economiaPercentual)
    .slice(0, limite);
}
