import { formatarReais, mediaEmCentavos, reaisParaCentavos } from '@/utils/dinheiro';

describe('dinheiro', () => {
  test('converte reais para centavos sem erro de ponto flutuante', () => {
    expect(reaisParaCentavos(0.1 + 0.2)).toBe(30);
    expect(reaisParaCentavos(25.5)).toBe(2550);
  });

  test('formata centavos em reais', () => {
    expect(formatarReais(2550).replace(/\s/g, ' ')).toBe('R$ 25,50');
  });

  test('média não divide por zero', () => {
    expect(mediaEmCentavos(0, 0)).toBe(0);
    expect(mediaEmCentavos(1000, 3)).toBe(333);
  });
});
