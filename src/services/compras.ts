import type { SQLiteDatabase } from 'expo-sqlite';
import { inserirCompra } from '@/database/repositories/compras';
import { inserirNotificacoes, precosParaComparar } from '@/database/repositories/notificacoes';
import { avisosDePrecoBaixo } from '@/services/notificacoes';
import { montarCompra, validarCompra, type Erros } from '@/utils/validacao';
import type { FormularioCompra } from '@/types';

export type ResultadoCompra =
  | { ok: true; compraId: number; avisos: number }
  | { ok: false; erros: Erros };

// Regra de negócio do cadastro manual: valida, converte, salva e gera os avisos de preço baixo.
export async function registrarCompra(
  db: SQLiteDatabase,
  usuarioId: number,
  formulario: FormularioCompra,
  hoje = new Date(),
): Promise<ResultadoCompra> {
  const erros = validarCompra(formulario, hoje);
  if (Object.keys(erros).length > 0) return { ok: false, erros };

  const compraId = await inserirCompra(db, usuarioId, montarCompra(formulario, hoje));
  const avisos = await gerarAvisosDePreco(db, usuarioId, compraId, hoje);
  return { ok: true, compraId, avisos };
}

// A compra já está salva. Se der erro aqui, só perdemos o aviso, não a compra.
async function gerarAvisosDePreco(
  db: SQLiteDatabase,
  usuarioId: number,
  compraId: number,
  agora: Date,
) {
  try {
    const avisos = avisosDePrecoBaixo(await precosParaComparar(db, usuarioId, compraId));
    await inserirNotificacoes(db, usuarioId, avisos, agora);
    return avisos.length;
  } catch {
    return 0;
  }
}
