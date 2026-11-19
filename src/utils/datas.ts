import {
  addMonths,
  isSameDay,
  isValid,
  parse,
  addQuarters,
  addYears,
  format,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Periodo } from '@/types';

export function paraISO(data: Date): string {
  return format(data, "yyyy-MM-dd'T'HH:mm:ss");
}

export function intervaloDoPeriodo(periodo: Periodo, hoje = new Date()) {
  if (periodo === 'mes') {
    const inicio = startOfMonth(hoje);
    return {
      inicio: paraISO(inicio),
      fim: paraISO(addMonths(inicio, 1)),
      rotulo: `Gasto em ${format(hoje, 'MMMM', { locale: ptBR })}`,
    };
  }
  if (periodo === 'trimestre') {
    const inicio = startOfQuarter(hoje);
    return {
      inicio: paraISO(inicio),
      fim: paraISO(addQuarters(inicio, 1)),
      rotulo: 'Gasto neste trimestre',
    };
  }
  const inicio = startOfYear(hoje);
  return {
    inicio: paraISO(inicio),
    fim: paraISO(addYears(inicio, 1)),
    rotulo: `Gasto em ${format(hoje, 'yyyy')}`,
  };
}

export function formatarDataCurta(iso: string): string {
  return format(new Date(iso), 'dd MMM, HH:mm', { locale: ptBR });
}

export function saudacao(hoje = new Date()): string {
  const hora = hoje.getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

// Data de hoje no formato do formulário: "15/11/2026".
export function formatarDataBr(data: Date): string {
  return format(data, 'dd/MM/yyyy');
}

// "15/11/2026" → "2026-11-15T12:00:00" (ou a hora atual, se for hoje). Data inválida → null.
export function dataBrParaISO(texto: string, hoje = new Date()): string | null {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(texto.trim())) return null;
  const data = parse(texto.trim(), 'dd/MM/yyyy', hoje);
  if (!isValid(data)) return null;
  if (isSameDay(data, hoje)) return paraISO(hoje);
  data.setHours(12, 0, 0, 0);
  return paraISO(data);
}
