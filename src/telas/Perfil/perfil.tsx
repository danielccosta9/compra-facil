import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Database, LogOut } from 'lucide-react-native';

import { Tela } from '@/components/ui/Tela';
import { Botao } from '@/components/ui/Botao';

import { useAuth } from '@/hooks/useAuth';
import { useDemonstracao } from '@/hooks/useDemonstracao';
import { avisar, confirmar } from '@/utils/avisos';
import { iniciais } from '@/utils/texto';
import { cores } from '@/theme/tema';
import { estilos } from './perfil_estilo';
import type { Usuario } from '@/types';

// O Perfil não é aba: abre por cima (pelo botão com as iniciais) e volta para onde estava.
function voltar() {
  if (router.canGoBack()) router.back();
  else router.replace('/dashboard');
}

export default function Perfil() {
  const { usuario } = useAuth();

  // As rotas protegidas garantem que só chegamos aqui com usuário logado.
  if (!usuario) return null;

  return <ConteudoPerfil usuario={usuario} />;
}

function ConteudoPerfil({ usuario }: { usuario: Usuario }) {
  const { sair } = useAuth();
  const demo = useDemonstracao(usuario.id);
  const [processando, setProcessando] = useState(false);

  async function handleCarregar() {
    setProcessando(true);
    try {
      await demo.carregar();
      avisar('Pronto!', 'As compras de demonstração já aparecem no início.');
    } catch {
      avisar('Ops', 'Não foi possível carregar a demonstração.');
    } finally {
      setProcessando(false);
    }
  }

  async function handleRemover() {
    const ok = await confirmar(
      'Remover demonstração',
      'As compras de demonstração serão apagadas. Suas compras reais continuam salvas.',
      'Remover',
    );
    if (!ok) return;

    setProcessando(true);
    try {
      await demo.remover();
    } catch {
      avisar('Ops', 'Não foi possível remover a demonstração.');
    } finally {
      setProcessando(false);
    }
  }

  async function handleSair() {
    const ok = await confirmar('Sair', 'Deseja mesmo sair da sua conta?', 'Sair');
    if (ok) await sair();
  }

  return (
    <Tela>
      <View style={estilos.topo}>
        <Pressable onPress={voltar} style={estilos.voltar} hitSlop={8} accessibilityLabel="Voltar">
          <ChevronLeft size={22} color={cores.texto} />
        </Pressable>
        <Text style={estilos.tituloTela}>Perfil</Text>
      </View>

      <View style={estilos.cabecalho}>
        <View style={estilos.avatar}>
          <Text style={estilos.iniciais}>{iniciais(usuario.nome)}</Text>
        </View>
        <Text style={estilos.nome}>{usuario.nome}</Text>
        <Text style={estilos.email}>{usuario.email}</Text>
      </View>

      <View style={estilos.cartao}>
        <View style={estilos.cartaoTopo}>
          <Database size={20} color={cores.primaria} />
          <Text style={estilos.cartaoTitulo}>Dados de demonstração</Text>
        </View>

        <Text style={estilos.cartaoTexto}>
          Gere compras fictícias para explorar o app. Elas aparecem com o selo
          “Demonstração” e podem ser removidas quando quiser.
        </Text>

        {demo.possui === null ? (
          <ActivityIndicator color={cores.primaria} />
        ) : demo.possui ? (
          <Botao
            titulo="Remover demonstração"
            variante="secundario"
            onPress={handleRemover}
            carregando={processando}
          />
        ) : (
          <Botao
            titulo="Carregar demonstração"
            onPress={handleCarregar}
            carregando={processando}
          />
        )}
      </View>

      <Pressable
        onPress={handleSair}
        style={({ pressed }) => [estilos.botaoSair, pressed && { opacity: 0.7 }]}
      >
        <LogOut size={20} color={cores.erro} />
        <Text style={estilos.textoSair}>Sair da conta</Text>
      </Pressable>
    </Tela>
  );
}
