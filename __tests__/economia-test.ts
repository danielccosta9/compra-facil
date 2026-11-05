import {
  classificarObservacoes,
  encontrarOportunidades,
  media,
} from '@/services/economia';
import type { PrecoObservado } from '@/types';

function preco(
  produto: string,
  estabelecimento: string,
  precoCentavos: number,
): PrecoObservado {
  return { produto, estabelecimento, precoCentavos };
}

describe('classificarObservacoes', () => {
  test.each([
    [1, 'insuficiente'],
    [2, 'insuficiente'],
    [3, 'inicial'],
    [4, 'inicial'],
    [5, 'moderada'],
    [9, 'moderada'],
    [10, 'consistente'],
    [25, 'consistente'],
  ])('%i observações = %s', (quantidade, nivel) => {
    expect(classificarObservacoes(quantidade)).toBe(nivel);
  });
});

describe('media', () => {
  test('lista vazia retorna 0', () => expect(media([])).toBe(0));
  test('calcula a média', () => expect(media([100, 200, 300])).toBe(200));
});

describe('encontrarOportunidades', () => {
  test('não recomenda com poucos dados (2 registros)', () => {
    const precos = [
      preco('ARROZ 5KG', 'Loja A', 2000),
      preco('ARROZ 5KG', 'Loja B', 3000),
    ];
    expect(encontrarOportunidades(precos)).toEqual([]);
  });

  test('precisa de pelo menos duas lojas', () => {
    const precos = [1, 2, 3].map((n) => preco('CAFE', 'Loja A', 1000 + n));
    expect(encontrarOportunidades(precos)).toEqual([]);
  });

  test('aponta a loja com menor preço médio', () => {
    const precos = [
      preco('ARROZ 5KG', 'Loja A', 2000),
      preco('ARROZ 5KG', 'Loja A', 2200),
      preco('ARROZ 5KG', 'Loja B', 3000),
    ];
    const [oportunidade] = encontrarOportunidades(precos);
    expect(oportunidade.estabelecimentoMaisBarato).toBe('Loja A');
    expect(oportunidade.mediaMaisBarataCentavos).toBe(2100);
    expect(oportunidade.mediaGeralCentavos).toBe(2400);
    expect(oportunidade.economiaPercentual).toBe(13);
    expect(oportunidade.nivel).toBe('inicial');
  });

  test('agrupa descrições iguais ignorando maiúsculas e espaços', () => {
    const precos = [
      preco('arroz 5kg ', 'Loja A', 2000),
      preco('ARROZ 5KG', 'Loja B', 2600),
      preco('Arroz 5kg', 'Loja B', 2600),
    ];
    expect(encontrarOportunidades(precos)).toHaveLength(1);
  });

  test('ignora diferenças menores que 2%', () => {
    const precos = [
      preco('LEITE', 'A', 500),
      preco('LEITE', 'B', 505),
      preco('LEITE', 'B', 505),
    ];
    expect(encontrarOportunidades(precos)).toEqual([]);
  });

  test('ordena pela maior economia e respeita o limite', () => {
    const precos = ['P1', 'P2', 'P3', 'P4'].flatMap((p, i) => [
      preco(p, 'A', 1000),
      preco(p, 'B', 1000 + (i + 1) * 200),
      preco(p, 'B', 1000 + (i + 1) * 200),
    ]);
    const resultado = encontrarOportunidades(precos, 2);
    expect(resultado.map((o) => o.produto)).toEqual(['P4', 'P3']);
  });
});
