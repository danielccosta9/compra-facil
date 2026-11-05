import { Text, View } from 'react-native';
import { TrendingDown } from 'lucide-react-native';
import { formatarReais } from '@/utils/dinheiro';
import { cores } from '@/theme/tema';
import type { Oportunidade } from '@/services/economia';
import { estilos } from './estilos';

const nomesDoNivel = {
  insuficiente: 'Dados insuficientes',
  inicial: 'Tendência inicial',
  moderada: 'Evidência moderada',
  consistente: 'Histórico consistente',
};

export function CartaoEconomia({ oportunidade }: { oportunidade: Oportunidade }) {
  return (
    <View style={estilos.cartao}>
      <View style={estilos.icone}>
        <TrendingDown size={20} color={cores.primaria} />
      </View>
      <View style={estilos.meio}>
        <Text style={estilos.produto} numberOfLines={1}>
          {oportunidade.produto}
        </Text>
        <Text style={estilos.texto}>
          No seu histórico, saiu em média{' '}
          {formatarReais(oportunidade.mediaMaisBarataCentavos)} em{' '}
          {oportunidade.estabelecimentoMaisBarato} ({oportunidade.economiaPercentual}%
          abaixo da sua média).
        </Text>
        <Text style={estilos.nivel}>
          {nomesDoNivel[oportunidade.nivel]} · {oportunidade.observacoes} registros
        </Text>
      </View>
    </View>
  );
}
