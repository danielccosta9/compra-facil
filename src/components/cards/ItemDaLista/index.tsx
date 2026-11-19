import { Pressable, Text, View } from 'react-native';
import { Square, SquareCheckBig, X } from 'lucide-react-native';
import { formatarReais } from '@/utils/dinheiro';
import { cores } from '@/theme/tema';
import type { ItemLista } from '@/types';
import { estilos } from './estilos';

type Props = {
  item: ItemLista;
  onAlternar: () => void;
  onRemover: () => void;
};

// "Qtd. 2" para itens por unidade; "1,5 kg" para itens por peso.
function formatarQuantidade(quantidade: number, unidade: ItemLista['unidade']) {
  const numero = quantidade.toLocaleString('pt-BR', { maximumFractionDigits: 3 });
  return unidade === 'KG' ? `${numero} kg` : `Qtd. ${numero}`;
}

export function ItemDaLista({ item, onAlternar, onRemover }: Props) {
  const estimado =
    item.precoMedioCentavos !== null
      ? `≈ ${formatarReais(Math.round(item.precoMedioCentavos * item.quantidade))}`
      : 'Sem preço no histórico';

  return (
    <View style={estilos.linha}>
      <Pressable
        onPress={onAlternar}
        style={estilos.marcar}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.marcado }}
        accessibilityLabel={item.descricao}
      >
        {item.marcado ? (
          <SquareCheckBig size={22} color={cores.primaria} />
        ) : (
          <Square size={22} color={cores.textoSuave} />
        )}
        <View style={estilos.meio}>
          <Text
            style={[estilos.descricao, item.marcado && estilos.descricaoMarcada]}
            numberOfLines={1}
          >
            {item.descricao}
          </Text>
          <Text style={estilos.detalhe}>
            {formatarQuantidade(item.quantidade, item.unidade)} · {estimado}
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onRemover}
        hitSlop={8}
        style={estilos.remover}
        accessibilityLabel={`Remover ${item.descricao}`}
      >
        <X size={18} color={cores.textoSuave} />
      </Pressable>
    </View>
  );
}
