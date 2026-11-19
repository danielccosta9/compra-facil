import { textoParaCentavos, totalDoItem } from '@/utils/dinheiro';
import { dataBrParaISO, formatarDataBr } from '@/utils/datas';
import { montarCompra, textoParaNumero, validarCompra } from '@/utils/validacao';
import type { FormularioCompra } from '@/types';

const hoje = new Date(2026, 10, 15, 18, 30, 0); // 15/11/2026 18:30

function formulario(parcial: Partial<FormularioCompra> = {}): FormularioCompra {
  return {
    loja: 'Mercado Central',
    data: '10/11/2026',
    itens: [
      { chave: 'a', descricao: 'Arroz 5kg', quantidade: '2', unidade: 'UN', preco: '25,90' },
      { chave: 'b', descricao: 'Banana', quantidade: '1,5', unidade: 'KG', preco: '6,99' },
    ],
    ...parcial,
  };
}

describe('textoParaCentavos', () => {
  test('aceita vírgula, ponto de milhar e R$', () => {
    expect(textoParaCentavos('12,90')).toBe(1290);
    expect(textoParaCentavos('1.234,56')).toBe(123456);
    expect(textoParaCentavos('R$ 5')).toBe(500);
    expect(textoParaCentavos('7.5')).toBe(750);
  });

  test('rejeita texto inválido', () => {
    expect(textoParaCentavos('')).toBeNull();
    expect(textoParaCentavos('abc')).toBeNull();
    expect(textoParaCentavos('1,999')).toBeNull();
  });
});

describe('textoParaNumero e totalDoItem', () => {
  test('converte quantidades', () => {
    expect(textoParaNumero('1,5')).toBe(1.5);
    expect(textoParaNumero('2')).toBe(2);
    expect(textoParaNumero('dois')).toBeNull();
  });

  test('arredonda o total para centavos', () => {
    expect(totalDoItem(699, 1.5)).toBe(1049); // 1048,5 → 1049
  });
});

describe('datas do formulário', () => {
  test('formata e converte dd/mm/aaaa', () => {
    expect(formatarDataBr(hoje)).toBe('15/11/2026');
    expect(dataBrParaISO('10/11/2026', hoje)).toBe('2026-11-10T12:00:00');
  });

  test('usa a hora atual quando a data é hoje', () => {
    expect(dataBrParaISO('15/11/2026', hoje)).toBe('2026-11-15T18:30:00');
  });

  test('rejeita datas impossíveis ou fora do formato', () => {
    expect(dataBrParaISO('31/02/2026', hoje)).toBeNull();
    expect(dataBrParaISO('2026-11-10', hoje)).toBeNull();
    expect(dataBrParaISO('1/1/26', hoje)).toBeNull();
  });
});

describe('validarCompra', () => {
  test('formulário correto não tem erros', () => {
    expect(validarCompra(formulario(), hoje)).toEqual({});
  });

  test('exige loja, data válida e itens', () => {
    const erros = validarCompra(formulario({ loja: ' ', data: '99/99/2026', itens: [] }), hoje);
    expect(Object.keys(erros).sort()).toEqual(['data', 'itens', 'loja']);
  });

  test('não aceita data no futuro', () => {
    expect(validarCompra(formulario({ data: '16/11/2026' }), hoje).data).toMatch(/futuro/);
  });

  test('aponta o campo errado de cada item', () => {
    const erros = validarCompra(
      formulario({
        itens: [{ chave: 'a', descricao: '', quantidade: '0', unidade: 'KG', preco: 'x' }],
      }),
      hoje,
    );
    expect(Object.keys(erros).sort()).toEqual([
      'itens.0.descricao',
      'itens.0.preco',
      'itens.0.quantidade',
    ]);
  });

  test('UN exige quantidade inteira', () => {
    const erros = validarCompra(
      formulario({
        itens: [{ chave: 'a', descricao: 'Leite', quantidade: '1,5', unidade: 'UN', preco: '5' }],
      }),
      hoje,
    );
    expect(erros['itens.0.quantidade']).toMatch(/inteiro/);
  });
});

describe('montarCompra', () => {
  test('converte textos e soma o total', () => {
    const compra = montarCompra(formulario(), hoje);
    expect(compra.loja).toBe('Mercado Central');
    expect(compra.data).toBe('2026-11-10T12:00:00');
    expect(compra.itens[0]).toEqual({
      descricao: 'Arroz 5kg',
      quantidade: 2,
      unidade: 'UN',
      precoUnitarioCentavos: 2590,
      totalCentavos: 5180,
    });
    expect(compra.itens[1].totalCentavos).toBe(1049);
    expect(compra.totalCentavos).toBe(5180 + 1049);
  });
});
