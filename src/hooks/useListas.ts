import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { criarLista, listarListas } from '@/database/repositories/listas';
import type { ListaResumida } from '@/types';

export function useListas(usuarioId: number) {
  const db = useSQLiteContext();
  const [listas, setListas] = useState<ListaResumida[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(() => {
    listarListas(db, usuarioId)
      .then((resultado) => {
        setListas(resultado);
        setErro(null);
      })
      .catch(() => setErro('Não foi possível carregar suas listas.'));
  }, [db, usuarioId]);

  // Recarrega sempre que a aba ganha foco (ex.: ao voltar de uma lista).
  useFocusEffect(recarregar);

  async function criar(nome: string) {
    const id = await criarLista(db, usuarioId, nome);
    recarregar();
    return id;
  }

  return { listas, erro, criar };
}
