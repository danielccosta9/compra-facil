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
