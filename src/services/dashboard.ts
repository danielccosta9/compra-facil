import type { SQLiteDatabase } from 'expo-sqlite';
import {
  listarCompras,
  listarPrecosObservados,
  totaisDoPeriodo,
} from '@/database/repositories/compras';
import { encontrarOportunidades } from '@/services/economia';
import { mediaEmCentavos } from '@/utils/dinheiro';
import { intervaloDoPeriodo } from '@/utils/datas';
import type { Periodo } from '@/types';

export async function carregarDashboard(
  db: SQLiteDatabase,
  usuarioId: number,
  periodo: Periodo,
) {
  const intervalo = intervaloDoPeriodo(periodo);
  const totais = await totaisDoPeriodo(db, usuarioId, intervalo.inicio, intervalo.fim);
  const ultimasCompras = await listarCompras(db, usuarioId, 4);
  const precos = await listarPrecosObservados(db, usuarioId);

  return {
    rotulo: intervalo.rotulo,
    resumo: {
      totalCentavos: totais.totalCentavos,
      quantidadeCompras: totais.quantidade,
      mediaCentavos: mediaEmCentavos(totais.totalCentavos, totais.quantidade),
    },
    ultimasCompras,
    oportunidades: encontrarOportunidades(precos),
  };
}
