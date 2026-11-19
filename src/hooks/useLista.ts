import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import {
  adicionarItemNaLista,
  buscarLista,
  excluirLista,
  marcarItem,
  marcarListaConcluida,
  removerItemDaLista,
  sugerirProdutos,
  type SugestaoProduto,
} from '@/database/repositories/listas';
import type { ListaDetalhada, UnidadeItem } from '@/types';

export function useLista(usuarioId: number, listaId: number) {
  const db = useSQLiteContext();
  const [lista, setLista] = useState<ListaDetalhada | null>(null);
  const [sugestoes, setSugestoes] = useState<SugestaoProduto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    try {
      const [detalhe, produtos] = await Promise.all([
        buscarLista(db, usuarioId, listaId),
        sugerirProdutos(db, usuarioId, listaId),
      ]);
      setLista(detalhe);
      setSugestoes(produtos);
      setErro(null);
    } catch {
      setErro('Não foi possível carregar a lista.');
    } finally {
      setCarregando(false);
    }
  }, [db, usuarioId, listaId]);

  useFocusEffect(
    useCallback(() => {
      recarregar();
    }, [recarregar]),
  );

  // Marca/desmarca na tela na hora e depois grava no banco.
  async function alternarItem(itemId: number, marcado: boolean) {
    setLista((atual) =>
      atual && {
        ...atual,
        itens: atual.itens.map((i) => (i.id === itemId ? { ...i, marcado } : i)),
      },
    );
    await marcarItem(db, usuarioId, itemId, marcado);
  }

  async function adicionarItem(descricao: string, quantidade: number, unidade: UnidadeItem) {
    await adicionarItemNaLista(db, usuarioId, listaId, descricao, quantidade, unidade);
    await recarregar();
  }

  async function removerItem(itemId: number) {
    await removerItemDaLista(db, usuarioId, itemId);
    await recarregar();
  }

  async function concluir(concluida: boolean) {
    await marcarListaConcluida(db, usuarioId, listaId, concluida);
    await recarregar();
  }

  async function excluir() {
    await excluirLista(db, usuarioId, listaId);
  }

  return {
    lista,
    sugestoes,
    carregando,
    erro,
    alternarItem,
    adicionarItem,
    removerItem,
    concluir,
    excluir,
  };
}
