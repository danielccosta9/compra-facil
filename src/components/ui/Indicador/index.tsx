import { Text, View } from 'react-native';
import { estilos } from './estilos';

// Caixinha com um número de destaque (ex.: "Menor preço · R$ 7,49").
export function Indicador({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={estilos.caixa}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Text style={estilos.valor}>{valor}</Text>
    </View>
  );
}
