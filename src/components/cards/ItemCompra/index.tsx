import { Text, View } from 'react-native';
import { Receipt } from 'lucide-react-native';
import { SeloDemo } from '@/components/ui/SeloDemo';
import { formatarReais } from '@/utils/dinheiro';
import { formatarDataCurta } from '@/utils/datas';
import { cores } from '@/theme/tema';
import type { CompraResumida } from '@/types';
import { estilos } from './estilos';

export function ItemCompra({ compra }: { compra: CompraResumida }) {
  return (
    <View style={estilos.linha}>
      <View style={estilos.icone}>
        <Receipt size={20} color={cores.primaria} />
      </View>

      <View style={estilos.meio}>
        <Text style={estilos.loja} numberOfLines={1}>
          {compra.estabelecimento}
        </Text>
        <Text style={estilos.detalhe}>
          {formatarDataCurta(compra.data)} · {compra.quantidadeItens} itens
        </Text>
        {compra.demonstracao && <SeloDemo />}
      </View>

      <Text style={estilos.valor}>{formatarReais(compra.totalCentavos)}</Text>
    </View>
  );
}
