import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { carregarDashboard } from '@/services/dashboard';
import type { Periodo } from '@/types';

type Dados = Awaited<ReturnType<typeof carregarDashboard>>;

export function useDashboard(usuarioId: number, periodo: Periodo) {
  const db = useSQLiteContext();
  const [dados, setDados] = useState<Dados | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      carregarDashboard(db, usuarioId, periodo)
        .then((resultado) => {
          setDados(resultado);
          setErro(null);
        })
        .catch(() => setErro('Não foi possível carregar seus dados.'));
    }, [db, usuarioId, periodo]),
  );

  return { dados, erro };
}
