import { Text, View } from 'react-native';
import { ShoppingCart, Wallet } from 'lucide-react-native';
import { formatarReais } from '@/utils/dinheiro';
import { cores } from '@/theme/tema';
import type { ResumoGastos } from '@/types';
import { estilos } from './estilos';

type Props = { rotulo: string; resumo: ResumoGastos };

export function CartaoResumo({ rotulo, resumo }: Props) {
  return (
    <View style={estilos.cartao}>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <Text style={estilos.total}>{formatarReais(resumo.totalCentavos)}</Text>

      <View style={estilos.rodape}>
        <View style={estilos.info}>
          <ShoppingCart size={16} color={cores.branco} />
          <Text style={estilos.infoTexto}>
            {resumo.quantidadeCompras}{' '}
            {resumo.quantidadeCompras === 1 ? 'compra' : 'compras'}
          </Text>
        </View>
        <View style={estilos.divisor} />
        <View style={estilos.info}>
          <Wallet size={16} color={cores.branco} />
          <Text style={estilos.infoTexto}>
            Média {formatarReais(resumo.mediaCentavos)}
          </Text>
        </View>
      </View>
    </View>
  );
}
