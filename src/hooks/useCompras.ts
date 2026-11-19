import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { listarCompras } from '@/database/repositories/compras';
import type { CompraResumida } from '@/types';

export function useCompras(usuarioId: number) {
  const db = useSQLiteContext();
  const [compras, setCompras] = useState<CompraResumida[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(() => {
    listarCompras(db, usuarioId)
      .then((lista) => {
        setCompras(lista);
        setErro(null);
      })
      .catch(() => setErro('Não foi possível carregar suas compras.'));
  }, [db, usuarioId]);

  // Recarrega sempre que a aba ganha foco.
  useFocusEffect(recarregar);

  // Soma calculada a partir da lista já carregada.
  const totalCentavos = (compras ?? []).reduce((soma, c) => soma + c.totalCentavos, 0);

  return { compras, erro, totalCentavos };
}
