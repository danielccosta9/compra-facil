import {
  ordenarItens,
  resumoDaLista,
  validarItemLista,
  validarNomeLista,
} from '@/services/listas';
import type { ItemLista } from '@/types';

function item(parcial: Partial<ItemLista>): ItemLista {
  return {
    id: 1,
    descricao: 'Item',
    quantidade: 1,
    unidade: 'UN',
    marcado: false,
    posicao: 0,
    produtoId: null,
    precoMedioCentavos: null,
    ...parcial,
  };
}

describe('resumoDaLista', () => {
  test('lista vazia', () => {
    expect(resumoDaLista([])).toEqual({
      total: 0,
      marcados: 0,
      estimadoCentavos: 0,
      restanteCentavos: 0,
      itensSemPreco: 0,
    });
  });

  test('estima pelo preço médio × quantidade e separa o que falta comprar', () => {
    const resumo = resumoDaLista([
      item({ id: 1, quantidade: 2, precoMedioCentavos: 500 }), // 10,00 (falta)
      item({ id: 2, quantidade: 1, precoMedioCentavos: 850, marcado: true }), // 8,50 (comprado)
      item({ id: 3, quantidade: 1.5, precoMedioCentavos: 699 }), // 10,49 (falta)
      item({ id: 4 }), // sem preço conhecido
    ]);
    expect(resumo.total).toBe(4);
    expect(resumo.marcados).toBe(1);
    expect(resumo.estimadoCentavos).toBe(1000 + 850 + 1049);
    expect(resumo.restanteCentavos).toBe(1000 + 1049);
    expect(resumo.itensSemPreco).toBe(1);
  });
});

describe('ordenarItens', () => {
  test('não comprados primeiro, mantendo a ordem de inclusão', () => {
    const ordenados = ordenarItens([
      item({ id: 1, posicao: 0, marcado: true }),
      item({ id: 2, posicao: 1 }),
      item({ id: 3, posicao: 2, marcado: true }),
      item({ id: 4, posicao: 3 }),
    ]);
    expect(ordenados.map((i) => i.id)).toEqual([2, 4, 1, 3]);
  });
});

describe('validações da lista', () => {
  test('nome da lista', () => {
    expect(validarNomeLista(' ')).toHaveProperty('nome');
    expect(validarNomeLista('Feira')).toEqual({});
  });

  test('item da lista', () => {
    expect(validarItemLista('', '0')).toEqual({
      descricao: expect.any(String),
      quantidade: expect.any(String),
    });
    expect(validarItemLista('Leite', '1,5')).toEqual({});
  });
});
