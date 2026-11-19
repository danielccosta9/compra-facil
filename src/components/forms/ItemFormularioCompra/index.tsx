import { Pressable, Text, View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { CampoTexto } from '@/components/ui/CampoTexto';
import { SeletorUnidade } from '@/components/ui/SeletorUnidade';
import { formatarReais, textoParaCentavos, totalDoItem } from '@/utils/dinheiro';
import { textoParaNumero, type Erros } from '@/utils/validacao';
import { cores } from '@/theme/tema';
import type { ItemFormulario } from '@/types';
import { estilos } from './estilos';

type Props = {
  item: ItemFormulario;
  posicao: number;
  erros: Erros;
  onMudar: (item: ItemFormulario) => void;
  onRemover: () => void;
};

export function ItemFormularioCompra({ item, posicao, erros, onMudar, onRemover }: Props) {
  const quantidade = textoParaNumero(item.quantidade);
  const preco = textoParaCentavos(item.preco);
  const subtotal = quantidade && preco ? totalDoItem(preco, quantidade) : null;
  const erro = (campo: string) => erros[`itens.${posicao}.${campo}`];

  return (
    <View style={estilos.cartao}>
      <View style={estilos.topo}>
        <Text style={estilos.numero}>Item {posicao + 1}</Text>
        <Pressable onPress={onRemover} hitSlop={10} accessibilityLabel={`Remover item ${posicao + 1}`}>
          <Trash2 size={18} color={cores.erro} />
        </Pressable>
      </View>

      <CampoTexto
        rotulo="Produto"
        placeholder="Ex.: Arroz tipo 1 5kg"
        value={item.descricao}
        onChangeText={(descricao) => onMudar({ ...item, descricao })}
        erro={erro('descricao')}
      />

      <View style={estilos.linha}>
        <View style={estilos.metade}>
          <CampoTexto
            rotulo={item.unidade === 'KG' ? 'Peso (kg)' : 'Quantidade'}
            placeholder={item.unidade === 'KG' ? '1,5' : '1'}
            value={item.quantidade}
            onChangeText={(quantidade) => onMudar({ ...item, quantidade })}
            keyboardType="decimal-pad"
            erro={erro('quantidade')}
          />
        </View>

        <View style={estilos.metade}>
          <SeletorUnidade
            valor={item.unidade}
            onMudar={(unidade) => onMudar({ ...item, unidade })}
          />
        </View>
      </View>

      <CampoTexto
        rotulo={item.unidade === 'KG' ? 'Preço por kg (R$)' : 'Preço unitário (R$)'}
        placeholder="0,00"
        value={item.preco}
        onChangeText={(preco) => onMudar({ ...item, preco })}
        keyboardType="decimal-pad"
        erro={erro('preco')}
      />

      {subtotal !== null && (
        <Text style={estilos.subtotal}>
          Subtotal: <Text style={estilos.subtotalValor}>{formatarReais(subtotal)}</Text>
        </Text>
      )}
    </View>
  );
}
