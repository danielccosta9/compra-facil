import { intervaloDoPeriodo, saudacao } from '@/utils/datas';

describe('datas', () => {
  const hoje = new Date(2026, 10, 4, 15, 0);

  test('intervalo do mês', () => {
    const r = intervaloDoPeriodo('mes', hoje);
    expect(r.inicio).toBe('2026-11-01T00:00:00');
    expect(r.fim).toBe('2026-12-01T00:00:00');
    expect(r.rotulo).toBe('Gasto em novembro');
  });

  test('intervalo do trimestre', () => {
    const r = intervaloDoPeriodo('trimestre', hoje);
    expect(r.inicio).toBe('2026-10-01T00:00:00');
    expect(r.fim).toBe('2027-01-01T00:00:00');
  });

  test('intervalo do ano', () => {
    const r = intervaloDoPeriodo('ano', hoje);
    expect(r.inicio).toBe('2026-01-01T00:00:00');
    expect(r.fim).toBe('2027-01-01T00:00:00');
  });

  test('saudação por horário', () => {
    expect(saudacao(new Date(2026, 0, 1, 9))).toBe('Bom dia');
    expect(saudacao(hoje)).toBe('Boa tarde');
    expect(saudacao(new Date(2026, 0, 1, 20))).toBe('Boa noite');
  });
});
