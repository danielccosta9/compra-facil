import { media } from '@/services/economia';
import { formatarReais } from '@/utils/dinheiro';
import type { NovaNotificacao } from '@/types';

// Preço pago agora, junto com os preços que o usuário já tinha pago antes pelo mesmo produto.
export type PrecoParaComparar = {
  produto: string;
  precoCentavos: number;
  anteriores: number[];
};

// Regras do aviso "preço abaixo da média":
// - precisa de pelo menos 2 preços anteriores (com 1 só, não existe "média" de verdade);
// - o preço novo precisa estar pelo menos 10% abaixo da média dos anteriores.
export const MINIMO_DE_PRECOS_ANTERIORES = 2;
export const DESCONTO_MINIMO_PERCENTUAL = 10;

// Função pura: recebe números, devolve os avisos. Não acessa o banco, por isso é fácil de testar.
export function avisosDePrecoBaixo(precos: PrecoParaComparar[]): NovaNotificacao[] {
  const avisos: NovaNotificacao[] = [];

  for (const { produto, precoCentavos, anteriores } of precos) {
    if (anteriores.length < MINIMO_DE_PRECOS_ANTERIORES) continue;

    const mediaAnterior = media(anteriores);
    if (mediaAnterior <= 0) continue;

    const desconto = Math.round(((mediaAnterior - precoCentavos) / mediaAnterior) * 100);
    if (desconto < DESCONTO_MINIMO_PERCENTUAL) continue;

    avisos.push({
      tipo: 'preco_baixo',
      titulo: `${produto} saiu mais barato`,
      texto:
        `Você pagou ${formatarReais(precoCentavos)}, ${desconto}% abaixo da sua média ` +
        `de ${formatarReais(Math.round(mediaAnterior))}.`,
    });
  }

  return avisos;
}
