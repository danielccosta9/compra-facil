import { Pressable, Text, View } from 'react-native';
import { estilos } from './estilos';

type Props = { titulo: string; acao?: string; onAcao?: () => void };

export function CabecalhoSecao({ titulo, acao, onAcao }: Props) {
  return (
    <View style={estilos.linha}>
      <Text style={estilos.titulo}>{titulo}</Text>
      {acao && onAcao && (
        <Pressable onPress={onAcao} hitSlop={8}>
          <Text style={estilos.acao}>{acao}</Text>
        </Pressable>
      )}
    </View>
  );
}
