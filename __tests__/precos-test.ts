import {
  calcularIndicadores,
  mediana,
  precoPorMedida,
  type ObservacaoPreco,
} from '@/services/precos';

function obs(data: string, loja: string, precoCentavos: number, unidade = 'UN'): ObservacaoPreco {
  return { data, loja, precoCentavos, quantidade: 1, unidade };
}

describe('mediana', () => {
  test('lista vazia', () => expect(mediana([])).toBe(0));
  test('quantidade ímpar pega o do meio', () => expect(mediana([30, 10, 20])).toBe(20));
  test('quantidade par faz a média dos dois do meio', () =>
    expect(mediana([10, 40, 20, 30])).toBe(25));
});

describe('precoPorMedida', () => {
  test('arroz 5 kg a R$ 25,00 sai a R$ 5,00/kg', () => {
    expect(precoPorMedida(2500, 'UN', { tamanho: 5, unidade: 'kg' })).toEqual({
      valorCentavos: 500,
      unidade: 'kg',
    });
  });

  test('óleo 900 ml a R$ 7,20 sai a R$ 8,00/L', () => {
    expect(precoPorMedida(720, 'UN', { tamanho: 0.9, unidade: 'l' })).toEqual({
      valorCentavos: 800,
      unidade: 'l',
    });
  });

  test('item vendido por KG já está em R$/kg', () => {
    expect(precoPorMedida(699, 'KG', null)).toEqual({ valorCentavos: 699, unidade: 'kg' });
  });

  test('sem embalagem conhecida não converte', () => {
    expect(precoPorMedida(500, 'UN', null)).toBeNull();
  });
});

describe('calcularIndicadores', () => {
  test('sem histórico devolve null', () => {
    expect(calcularIndicadores([], null)).toBeNull();
  });

  // 2026-11-01 é domingo; 2026-11-02 segunda; 2026-11-09 segunda.
  const historico = [
    obs('2026-11-01T10:00:00', 'Loja A', 1000),
    obs('2026-11-02T10:00:00', 'Loja B', 1200),
    obs('2026-11-09T10:00:00', 'Loja A', 800),
    obs('2026-10-20T10:00:00', 'Loja B', 1400),
  ];
  const indicadores = calcularIndicadores(historico, { tamanho: 2, unidade: 'kg' })!;

  test('menor, maior, média e mediana', () => {
    expect(indicadores.observacoes).toBe(4);
    expect(indicadores.menorCentavos).toBe(800);
    expect(indicadores.maiorCentavos).toBe(1400);
    expect(indicadores.mediaCentavos).toBe(1100);
    expect(indicadores.medianaCentavos).toBe(1100);
    expect(indicadores.nivel).toBe('inicial');
  });

  test('último preço é o da data mais recente, não o último da lista', () => {
    expect(indicadores.ultimoCentavos).toBe(800);
    expect(indicadores.ultimaLoja).toBe('Loja A');
    expect(indicadores.variacaoPercentual).toBe(-27); // 800 vs média 1100
  });

  test('preço por kg usa a média e a embalagem', () => {
    expect(indicadores.precoPorMedida).toEqual({ valorCentavos: 550, unidade: 'kg' });
  });

  test('lojas ordenadas da mais barata para a mais cara', () => {
    expect(indicadores.porLoja).toEqual([
      { loja: 'Loja A', mediaCentavos: 900, menorCentavos: 800, observacoes: 2 },
      { loja: 'Loja B', mediaCentavos: 1300, menorCentavos: 1200, observacoes: 2 },
    ]);
  });

  test('média por dia da semana, só dos dias com compras', () => {
    expect(indicadores.porDiaDaSemana.map((d) => [d.nome, d.mediaCentavos])).toEqual([
      ['Dom', 1000],
      ['Seg', 1000], // (1200 + 800) / 2
      ['Ter', 1400],
    ]);
  });
});
