import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Receipt, ScanLine, TrendingDown } from 'lucide-react-native';

import { Tela } from '@/components/ui/Tela';
import { Botao } from '@/components/ui/Botao';
import { SeletorPeriodo } from '@/components/ui/SeletorPeriodo';
import { CabecalhoSecao } from '@/components/ui/CabecalhoSecao';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { CartaoResumo } from '@/components/cards/CartaoResumo';
import { CartaoEconomia } from '@/components/cards/CartaoEconomia';
import { ItemCompra } from '@/components/cards/ItemCompra';

import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from '@/hooks/useDashboard';
import { saudacao } from '@/utils/datas';
import { avisar } from '@/utils/avisos';
import { iniciais, primeiroNome } from '@/utils/texto';
import { cores } from '@/theme/tema';
import { estilos } from './dashboard_estilo';
import type { Periodo, Usuario } from '@/types';

export default function Dashboard() {
  const { usuario } = useAuth();

  // As rotas protegidas garantem que só chegamos aqui com usuário logado.
  if (!usuario) return null;

  return <ConteudoDashboard usuario={usuario} />;
}

function ConteudoDashboard({ usuario }: { usuario: Usuario }) {
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const { dados, erro, carregarDemonstracao } = useDashboard(usuario.id, periodo);
  const [carregandoDemo, setCarregandoDemo] = useState(false);

  async function handleDemonstracao() {
    setCarregandoDemo(true);
    try {
      await carregarDemonstracao();
    } catch {
      avisar('Ops', 'Não foi possível carregar a demonstração.');
    } finally {
      setCarregandoDemo(false);
    }
  }

  return (
    <Tela>
      <View style={estilos.topo}>
        <View>
          <Text style={estilos.saudacao}>{saudacao()},</Text>
          <Text style={estilos.nome}>{primeiroNome(usuario.nome)}</Text>
        </View>

        <Pressable
          onPress={() => router.navigate('/perfil')}
          hitSlop={8}
          style={estilos.botaoPerfil}
          accessibilityLabel="Abrir perfil"
        >
          <Text style={estilos.iniciais}>{iniciais(usuario.nome)}</Text>
        </Pressable>
      </View>

      <SeletorPeriodo valor={periodo} onMudar={setPeriodo} />

      {!!erro && <Text style={estilos.erro}>{erro}</Text>}

      {!dados && !erro && (
        <ActivityIndicator color={cores.primaria} style={estilos.carregando} />
      )}

      {dados && (
        <>
          <CartaoResumo rotulo={dados.rotulo} resumo={dados.resumo} />

          <Botao
            titulo="Escanear nota fiscal"
            onPress={() => router.navigate('/escanear')}
            icone={<ScanLine size={20} color={cores.branco} />}
          />

          <View style={estilos.secao}>
            <CabecalhoSecao
              titulo="Oportunidades de economia"
              acao="Ver preços"
              onAcao={() => router.navigate('/precos')}
            />
            {dados.oportunidades.length > 0 ? (
              dados.oportunidades.map((oportunidade) => {
                const { produtoId } = oportunidade;
                return (
                  <CartaoEconomia
                    key={oportunidade.produto}
                    oportunidade={oportunidade}
                    onPress={
                      produtoId
                        ? () =>
                            router.push({
                              pathname: '/produto/[id]',
                              params: { id: String(produtoId) },
                            })
                        : undefined
                    }
                  />
                );
              })
            ) : (
              <EstadoVazio
                icone={<TrendingDown size={26} color={cores.primaria} />}
                titulo="Nada por aqui ainda"
                texto="Compre o mesmo produto em lojas diferentes e mostramos onde ele sai mais barato."
              />
            )}
          </View>

          <View style={estilos.secao}>
            <CabecalhoSecao titulo="Últimas compras" />
            {dados.ultimasCompras.length > 0 ? (
              dados.ultimasCompras.map((compra) => (
                <ItemCompra key={compra.id} compra={compra} />
              ))
            ) : (
              <EstadoVazio
                icone={<Receipt size={26} color={cores.primaria} />}
                titulo="Nenhuma compra registrada"
                texto="Escaneie sua primeira nota ou carregue dados de demonstração para explorar o app."
              >
                <Botao
                  titulo="Carregar demonstração"
                  variante="secundario"
                  onPress={handleDemonstracao}
                  carregando={carregandoDemo}
                />
              </EstadoVazio>
            )}
          </View>
        </>
      )}
    </Tela>
  );
}
