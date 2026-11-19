import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import {
  inserirDadosDemonstracao,
  possuiDadosDemonstracao,
  removerDadosDemonstracao,
} from '@/database/repositories/demonstracao';

export function useDemonstracao(usuarioId: number) {
  const db = useSQLiteContext();
  const [possui, setPossui] = useState<boolean | null>(null);

  const verificar = useCallback(() => {
    possuiDadosDemonstracao(db, usuarioId).then(setPossui);
  }, [db, usuarioId]);

  // Confere sempre que a tela ganha foco.
  useFocusEffect(verificar);

  async function carregar() {
    await inserirDadosDemonstracao(db, usuarioId);
    setPossui(true);
  }

  async function remover() {
    await removerDadosDemonstracao(db, usuarioId);
    setPossui(false);
  }

  return { possui, carregar, remover };
}
