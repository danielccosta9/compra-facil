import { View } from 'react-native';
import { estilos } from './estilos';

// valor de 0 a 1 (ex.: 3 de 5 itens = 0.6)
export function BarraProgresso({ valor }: { valor: number }) {
  const porcentagem = Math.max(0, Math.min(1, valor)) * 100;
  return (
    <View style={estilos.trilho} accessibilityRole="progressbar">
      <View style={[estilos.preenchido, { width: `${porcentagem}%` }]} />
    </View>
  );
}
