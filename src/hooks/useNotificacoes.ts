import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import {
  apagarNotificacoes,
  contarNaoLidas,
  listarNotificacoes,
  marcarTodasComoLidas,
} from '@/database/repositories/notificacoes';
import type { Notificacao } from '@/types';

// Tela de notificações: carrega a lista e, ao abrir, marca tudo como lido.
// A lista guardada no estado ainda sabe quais eram novas, para destacar na tela.
export function useNotificacoes(usuarioId: number) {
  const db = useSQLiteContext();
  const [notificacoes, setNotificacoes] = useState<Notificacao[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      listarNotificacoes(db, usuarioId)
        .then(async (lista) => {
          setNotificacoes(lista);
          setErro(null);
          await marcarTodasComoLidas(db, usuarioId);
        })
        .catch(() => setErro('Não foi possível carregar as notificações.'));
    }, [db, usuarioId]),
  );

  async function limpar() {
    await apagarNotificacoes(db, usuarioId);
    setNotificacoes([]);
  }

  return { notificacoes, erro, limpar };
}

// Só o número de não lidas, para a bolinha na aba Notificações.
// "recontarQuando": qualquer valor que mude quando for preciso contar de novo (ex.: a rota atual).
export function useNaoLidas(usuarioId: number, recontarQuando?: unknown) {
  const db = useSQLiteContext();
  const [naoLidas, setNaoLidas] = useState(0);

  useFocusEffect(
    useCallback(() => {
      contarNaoLidas(db, usuarioId)
        .then(setNaoLidas)
        .catch(() => setNaoLidas(0));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [db, usuarioId, recontarQuando]),
  );

  return naoLidas;
}
