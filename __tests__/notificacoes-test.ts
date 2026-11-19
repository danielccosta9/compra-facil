import { avisosDePrecoBaixo } from '@/services/notificacoes';

describe('avisosDePrecoBaixo', () => {
  test('avisa quando o preço fica pelo menos 10% abaixo da média anterior', () => {
    const avisos = avisosDePrecoBaixo([
      { produto: 'Arroz 5kg', precoCentavos: 2200, anteriores: [2600, 2400] }, // média 25,00 → 12% abaixo
    ]);

    expect(avisos).toHaveLength(1);
    expect(avisos[0].tipo).toBe('preco_baixo');
    expect(avisos[0].titulo).toBe('Arroz 5kg saiu mais barato');
    expect(avisos[0].texto).toContain('12% abaixo');
  });

  test('não avisa com menos de 2 preços anteriores', () => {
    expect(
      avisosDePrecoBaixo([{ produto: 'Café', precoCentavos: 500, anteriores: [1500] }]),
    ).toEqual([]);
  });

  test('não avisa quando o desconto é pequeno ou o preço subiu', () => {
    expect(
      avisosDePrecoBaixo([
        { produto: 'Leite', precoCentavos: 470, anteriores: [500, 500] }, // 6% abaixo
        { produto: 'Pão', precoCentavos: 900, anteriores: [800, 800] }, // mais caro
      ]),
    ).toEqual([]);
  });

  test('exatamente 10% abaixo já conta', () => {
    expect(
      avisosDePrecoBaixo([{ produto: 'Feijão', precoCentavos: 900, anteriores: [1000, 1000] }]),
    ).toHaveLength(1);
  });
});
