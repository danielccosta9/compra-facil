import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import {
  buscarHistoricoDoProduto,
  type HistoricoProduto,
} from '@/database/repositories/precos';
import { calcularIndicadores, type IndicadoresPreco } from '@/services/precos';

export function useProduto(usuarioId: number, produtoId: number) {
  const db = useSQLiteContext();
  const [produto, setProduto] = useState<HistoricoProduto | null>(null);
  const [indicadores, setIndicadores] = useState<IndicadoresPreco | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      buscarHistoricoDoProduto(db, usuarioId, produtoId)
        .then((historico) => {
          setProduto(historico);
          setIndicadores(
            historico ? calcularIndicadores(historico.observacoes, historico.embalagem) : null,
          );
          setErro(null);
        })
        .catch(() => setErro('Não foi possível carregar o produto.'))
        .finally(() => setCarregando(false));
    }, [db, usuarioId, produtoId]),
  );

  return { produto, indicadores, carregando, erro };
}
