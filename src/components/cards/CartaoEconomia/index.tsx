import { Pressable, Text, View } from 'react-native';
import { TrendingDown } from 'lucide-react-native';
import { formatarReais } from '@/utils/dinheiro';
import { cores } from '@/theme/tema';
import { nomesDoNivel, type Oportunidade } from '@/services/economia';
import { estilos } from './estilos';

type Props = { oportunidade: Oportunidade; onPress?: () => void };

export function CartaoEconomia({ oportunidade, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [estilos.cartao, pressed && { opacity: 0.8 }]}
      accessibilityLabel={`Ver preços de ${oportunidade.produto}`}
    >
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
    </Pressable>
  );
}
