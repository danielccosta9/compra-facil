export function formatarReais(centavos: number): string {
  const reais = centavos / 100;
  return reais.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function reaisParaCentavos(reais: number): number {
  return Math.round(reais * 100);
}

export function mediaEmCentavos(totalCentavos: number, quantidade: number): number {
  if (quantidade === 0) return 0;
  return Math.round(totalCentavos / quantidade);
}

// Converte o que o usuário digitou em centavos.
// "12,90" → 1290 · "1.234,56" → 123456 · "R$ 5" → 500 · "abc" → null
export function textoParaCentavos(texto: string): number | null {
  let limpo = texto.replace(/R\$|\s/g, '');
  if (limpo.includes(',')) limpo = limpo.replace(/\./g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(limpo)) return null;
  return Math.round(Number(limpo) * 100);
}

// Total de um item: preço unitário × quantidade, arredondado para centavos.
export function totalDoItem(precoUnitarioCentavos: number, quantidade: number): number {
  return Math.round(precoUnitarioCentavos * quantidade);
}

// "R$ 5,00/kg" · "R$ 8,00/L"
export function formatarPorMedida(valorCentavos: number, unidade: 'kg' | 'l'): string {
  return `${formatarReais(valorCentavos)}/${unidade === 'l' ? 'L' : 'kg'}`;
}
