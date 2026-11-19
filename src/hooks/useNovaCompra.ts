import { useEffect, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { listarLojasRecentes } from '@/database/repositories/lojas';
import { registrarCompra } from '@/services/compras';
import type { FormularioCompra } from '@/types';

export function useNovaCompra(usuarioId: number) {
  const db = useSQLiteContext();
  const [lojasRecentes, setLojasRecentes] = useState<string[]>([]);

  useEffect(() => {
    listarLojasRecentes(db, usuarioId)
      .then(setLojasRecentes)
      .catch(() => setLojasRecentes([]));
  }, [db, usuarioId]);

  function salvar(formulario: FormularioCompra) {
    return registrarCompra(db, usuarioId, formulario);
  }

  return { lojasRecentes, salvar };
}
