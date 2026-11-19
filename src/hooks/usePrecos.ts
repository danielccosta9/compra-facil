import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { listarResumoDePrecos } from '@/database/repositories/precos';
import type { ResumoPrecoProduto } from '@/types';

export function usePrecos(usuarioId: number) {
  const db = useSQLiteContext();
  const [produtos, setProdutos] = useState<ResumoPrecoProduto[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      listarResumoDePrecos(db, usuarioId)
        .then((lista) => {
          setProdutos(lista);
          setErro(null);
        })
        .catch(() => setErro('Não foi possível carregar os preços.'));
    }, [db, usuarioId]),
  );

  return { produtos, erro };
}
