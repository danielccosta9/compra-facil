import { Pressable, Text, View } from 'react-native';
import { Tag } from 'lucide-react-native';
import { formatarReais } from '@/utils/dinheiro';
import { cores } from '@/theme/tema';
import type { ResumoPrecoProduto } from '@/types';
import { estilos } from './estilos';

type Props = { produto: ResumoPrecoProduto; onPress: () => void };

export function ItemPreco({ produto, onPress }: Props) {
  const registros = produto.observacoes === 1 ? '1 registro' : `${produto.observacoes} registros`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [estilos.linha, pressed && { opacity: 0.7 }]}
      accessibilityLabel={`Ver preços de ${produto.nome}`}
    >
      <View style={estilos.icone}>
        <Tag size={18} color={cores.primaria} />
      </View>
      <View style={estilos.meio}>
        <Text style={estilos.nome} numberOfLines={1}>
          {produto.nome}
        </Text>
        <Text style={estilos.detalhe}>
          Média {formatarReais(produto.mediaCentavos)} · {registros}
          {produto.categoria ? ` · ${produto.categoria}` : ''}
        </Text>
      </View>
      <Text style={estilos.valor}>{formatarReais(produto.ultimoCentavos)}</Text>
    </Pressable>
  );
}
