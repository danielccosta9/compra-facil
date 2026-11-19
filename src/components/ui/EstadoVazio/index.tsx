import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { estilos } from './estilos';

type Props = { icone: ReactNode; titulo: string; texto: string; children?: ReactNode };

export function EstadoVazio({ icone, titulo, texto, children }: Props) {
  return (
    <View style={estilos.caixa}>
      <View style={estilos.icone}>{icone}</View>
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.texto}>{texto}</Text>
      {children}
    </View>
  );
}
