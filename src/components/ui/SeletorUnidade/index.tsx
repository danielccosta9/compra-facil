import { Pressable, Text, View } from 'react-native';
import type { UnidadeItem } from '@/types';
import { estilos } from './estilos';

type Props = {
  valor: UnidadeItem;
  onMudar: (unidade: UnidadeItem) => void;
  rotulo?: string;
};

const unidades: UnidadeItem[] = ['UN', 'KG'];

// Botões UN / KG. Usado no cadastro de compra e na lista de compras.
export function SeletorUnidade({ valor, onMudar, rotulo = 'Unidade' }: Props) {
  return (
    <View>
      <Text style={estilos.rotulo}>{rotulo}</Text>
      <View style={estilos.unidades}>
        {unidades.map((unidade) => {
          const ativa = unidade === valor;
          return (
            <Pressable
              key={unidade}
              onPress={() => onMudar(unidade)}
              style={[estilos.unidade, ativa && estilos.unidadeAtiva]}
              accessibilityRole="button"
              accessibilityState={{ selected: ativa }}
            >
              <Text style={[estilos.textoUnidade, ativa && estilos.textoUnidadeAtiva]}>
                {unidade}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
