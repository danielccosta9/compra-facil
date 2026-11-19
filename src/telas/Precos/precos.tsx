import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Tag } from 'lucide-react-native';

import { Tela } from '@/components/ui/Tela';
import { CampoTexto } from '@/components/ui/CampoTexto';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { ItemPreco } from '@/components/cards/ItemPreco';

import { useAuth } from '@/hooks/useAuth';
import { usePrecos } from '@/hooks/usePrecos';
import { normalizarNome } from '@/utils/produtos';
import { cores } from '@/theme/tema';
import { estilos } from './precos_estilo';
import type { Usuario } from '@/types';

function voltar() {
  if (router.canGoBack()) router.back();
  else router.replace('/dashboard');
}

export default function Precos() {
  const { usuario } = useAuth();

  // As rotas protegidas garantem que só chegamos aqui com usuário logado.
  if (!usuario) return null;

  return <ConteudoPrecos usuario={usuario} />;
}

function ConteudoPrecos({ usuario }: { usuario: Usuario }) {
  const { produtos, erro } = usePrecos(usuario.id);
  const [busca, setBusca] = useState('');

  const termo = normalizarNome(busca);
  const filtrados = (produtos ?? []).filter((p) => normalizarNome(p.nome).includes(termo));

  return (
    <Tela>
      <View style={estilos.topo}>
        <Pressable onPress={voltar} style={estilos.voltar} hitSlop={8} accessibilityLabel="Voltar">
          <ChevronLeft size={22} color={cores.texto} />
        </Pressable>
        <Text style={estilos.titulo}>Preços dos produtos</Text>
      </View>

      <Text style={estilos.subtitulo}>
        Valores do seu histórico de compras. À direita, o último preço pago.
      </Text>

      {!!erro && <Text style={estilos.erro}>{erro}</Text>}

      {!produtos && !erro && (
        <ActivityIndicator color={cores.primaria} style={estilos.carregando} />
      )}

      {produtos && produtos.length === 0 && (
        <EstadoVazio
          icone={<Tag size={26} color={cores.primaria} />}
          titulo="Nenhum preço registrado"
          texto="Registre uma compra ou carregue a demonstração no perfil para ver os preços aqui."
        />
      )}

      {produtos && produtos.length > 0 && (
        <>
          <CampoTexto
            rotulo="Buscar produto"
            placeholder="Ex.: arroz"
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="none"
          />

          {filtrados.length === 0 ? (
            <Text style={estilos.aviso}>Nenhum produto encontrado para “{busca}”.</Text>
          ) : (
            <View style={estilos.lista}>
              {filtrados.map((produto) => (
                <ItemPreco
                  key={produto.id}
                  produto={produto}
                  onPress={() =>
                    router.push({
                      pathname: '/produto/[id]',
                      params: { id: String(produto.id) },
                    })
                  }
                />
              ))}
            </View>
          )}
        </>
      )}
    </Tela>
  );
}
