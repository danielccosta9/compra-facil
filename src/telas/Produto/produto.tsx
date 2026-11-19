import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Tag } from 'lucide-react-native';

import { Tela } from '@/components/ui/Tela';
import { Botao } from '@/components/ui/Botao';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { Indicador } from '@/components/ui/Indicador';
import { GraficoBarras } from '@/components/charts/GraficoBarras';

import { useAuth } from '@/hooks/useAuth';
import { useProduto } from '@/hooks/useProduto';
import { nomesDoNivel } from '@/services/economia';
import type { IndicadoresPreco } from '@/services/precos';
import { formatarDataCurta } from '@/utils/datas';
import { formatarPorMedida, formatarReais } from '@/utils/dinheiro';
import { cores } from '@/theme/tema';
import { estilos } from './produto_estilo';
import type { Usuario } from '@/types';

function voltar() {
  if (router.canGoBack()) router.back();
  else router.replace('/precos');
}

export default function TelaProduto() {
  const { usuario } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  // As rotas protegidas garantem que só chegamos aqui com usuário logado.
  if (!usuario) return null;

  return <ConteudoProduto usuario={usuario} produtoId={Number(id)} />;
}

function SeloVariacao({ variacao }: { variacao: number }) {
  if (variacao === 0) return <Text style={[estilos.selo, estilos.seloAbaixo]}>Na sua média</Text>;
  const abaixo = variacao < 0;
  return (
    <Text style={[estilos.selo, abaixo ? estilos.seloAbaixo : estilos.seloAcima]}>
      {Math.abs(variacao)}% {abaixo ? 'abaixo' : 'acima'} da sua média
    </Text>
  );
}

function Indicadores({ indicadores }: { indicadores: IndicadoresPreco }) {
  return (
    <View style={estilos.grade}>
      <Indicador rotulo="Menor preço" valor={formatarReais(indicadores.menorCentavos)} />
      <Indicador rotulo="Maior preço" valor={formatarReais(indicadores.maiorCentavos)} />
      <Indicador rotulo="Média" valor={formatarReais(indicadores.mediaCentavos)} />
      <Indicador rotulo="Mediana" valor={formatarReais(indicadores.medianaCentavos)} />
      {indicadores.precoPorMedida && (
        <Indicador
          rotulo={indicadores.precoPorMedida.unidade === 'l' ? 'Média por litro' : 'Média por kg'}
          valor={formatarPorMedida(
            indicadores.precoPorMedida.valorCentavos,
            indicadores.precoPorMedida.unidade,
          )}
        />
      )}
      <Indicador rotulo="Registros" valor={String(indicadores.observacoes)} />
    </View>
  );
}

function ConteudoProduto({ usuario, produtoId }: { usuario: Usuario; produtoId: number }) {
  const { produto, indicadores, carregando, erro } = useProduto(usuario.id, produtoId);

  if (carregando) {
    return (
      <Tela>
        <ActivityIndicator color={cores.primaria} style={estilos.carregando} />
      </Tela>
    );
  }

  if (!produto || !indicadores) {
    return (
      <Tela>
        <EstadoVazio
          icone={<Tag size={26} color={cores.primaria} />}
          titulo={produto ? 'Ainda sem preços' : 'Produto não encontrado'}
          texto={erro ?? 'Quando você registrar uma compra com ele, os preços aparecem aqui.'}
        >
          <Botao titulo="Voltar" variante="secundario" onPress={voltar} />
        </EstadoVazio>
      </Tela>
    );
  }

  return (
    <Tela>
      <View style={estilos.topo}>
        <Pressable onPress={voltar} style={estilos.voltar} hitSlop={8} accessibilityLabel="Voltar">
          <ChevronLeft size={22} color={cores.texto} />
        </Pressable>
        <Text style={estilos.titulo} numberOfLines={2}>
          {produto.nome}
        </Text>
      </View>

      {!!produto.categoria && <Text style={estilos.categoria}>{produto.categoria}</Text>}

      <View style={estilos.destaque}>
        <Text style={estilos.destaqueRotulo}>Último preço pago</Text>
        <Text style={estilos.destaqueValor}>{formatarReais(indicadores.ultimoCentavos)}</Text>
        <Text style={estilos.destaqueDetalhe}>
          {indicadores.ultimaLoja} · {formatarDataCurta(indicadores.ultimaData)}
        </Text>
        <SeloVariacao variacao={indicadores.variacaoPercentual} />
      </View>

      <Indicadores indicadores={indicadores} />

      <Text style={estilos.nota}>
        {nomesDoNivel[indicadores.nivel]} · {indicadores.observacoes} registros. Valores do seu
        histórico pessoal; não são o preço atual das lojas.
      </Text>

      {indicadores.porLoja.length > 1 && (
        <View style={estilos.secao}>
          <Text style={estilos.rotuloSecao}>Média por estabelecimento</Text>
          <GraficoBarras
            barras={indicadores.porLoja.map((loja, i) => ({
              rotulo: loja.loja,
              valor: loja.mediaCentavos,
              texto: formatarReais(loja.mediaCentavos),
              destaque: i === 0,
            }))}
          />
          <Text style={estilos.nota}>
            Mais barato no seu histórico: {indicadores.porLoja[0].loja}.
          </Text>
        </View>
      )}

      {indicadores.porDiaDaSemana.length > 1 && (
        <View style={estilos.secao}>
          <Text style={estilos.rotuloSecao}>Média por dia da semana</Text>
          <GraficoBarras
            barras={indicadores.porDiaDaSemana.map((dia) => ({
              rotulo: dia.nome,
              valor: dia.mediaCentavos,
              texto: formatarReais(dia.mediaCentavos),
            }))}
          />
        </View>
      )}

      <View style={estilos.secao}>
        <Text style={estilos.rotuloSecao}>Histórico</Text>
        {produto.observacoes.map((o, i) => (
          <View key={`${o.data}-${i}`} style={estilos.linhaHistorico}>
            <View>
              <Text style={estilos.historicoLoja}>{o.loja}</Text>
              <Text style={estilos.historicoData}>{formatarDataCurta(o.data)}</Text>
            </View>
            <Text style={estilos.historicoValor}>
              {formatarReais(o.precoCentavos)}
              {o.unidade === 'KG' ? '/kg' : ''}
            </Text>
          </View>
        ))}
      </View>
    </Tela>
  );
}
