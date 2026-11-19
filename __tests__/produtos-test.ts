import { extrairEmbalagem, normalizarNome } from '@/utils/produtos';

describe('normalizarNome', () => {
  it('tira espaços extras e coloca em maiúsculas', () => {
    expect(normalizarNome('  arroz   tipo 1 ')).toBe('ARROZ TIPO 1');
  });

  it('trata como iguais descrições com caixa diferente', () => {
    expect(normalizarNome('Leite Integral 1L')).toBe(normalizarNome('LEITE INTEGRAL 1L'));
  });
});

describe('extrairEmbalagem', () => {
  it('lê quilos', () => {
    expect(extrairEmbalagem('ARROZ TIPO 1 5KG')).toEqual({ tamanho: 5, unidade: 'kg' });
  });

  it('converte gramas para quilos', () => {
    expect(extrairEmbalagem('CAFE TORRADO 500G')).toEqual({ tamanho: 0.5, unidade: 'kg' });
  });

  it('lê litros', () => {
    expect(extrairEmbalagem('LEITE INTEGRAL 1L')).toEqual({ tamanho: 1, unidade: 'l' });
  });

  it('converte mililitros para litros', () => {
    expect(extrairEmbalagem('OLEO DE SOJA 900ML')).toEqual({ tamanho: 0.9, unidade: 'l' });
  });

  it('aceita vírgula decimal e espaço antes da unidade', () => {
    expect(extrairEmbalagem('PICANHA 1,5 kg')).toEqual({ tamanho: 1.5, unidade: 'kg' });
  });

  it('usa o último tamanho da descrição', () => {
    expect(extrairEmbalagem('ARROZ TIPO 1 5KG')?.tamanho).toBe(5);
  });

  it('devolve null quando não há embalagem', () => {
    expect(extrairEmbalagem('BANANA PRATA')).toBeNull();
  });
});
