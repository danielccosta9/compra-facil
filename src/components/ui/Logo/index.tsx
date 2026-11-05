import { Text, View } from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import { cores } from '@/theme/tema';
import { estilos } from './estilos';

export function Logo() {
  return (
    <View style={estilos.linha}>
      <View style={estilos.icone}>
        <ShoppingBag size={22} color={cores.branco} strokeWidth={2.4} />
      </View>
      <Text style={estilos.nome}>
        Compra<Text style={{ color: cores.primaria }}>Certa</Text>
      </Text>
    </View>
  );
}
