import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { cores } from '@/theme/tema';
import { estilos } from './estilos';

type Props = {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario';
  icone?: ReactNode;
  carregando?: boolean;
};

export function Botao({
  titulo,
  onPress,
  variante = 'primario',
  icone,
  carregando = false,
}: Props) {
  const primario = variante === 'primario';

  return (
    <Pressable
      onPress={onPress}
      disabled={carregando}
      style={({ pressed }) => [
        estilos.botao,
        primario ? estilos.primario : estilos.secundario,
        pressed && { opacity: 0.85 },
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={primario ? cores.branco : cores.primaria} />
      ) : (
        <View style={estilos.conteudo}>
          {icone}
          <Text
            style={[estilos.texto, { color: primario ? cores.branco : cores.primaria }]}
          >
            {titulo}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
