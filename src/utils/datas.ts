import {
  addMonths,
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
