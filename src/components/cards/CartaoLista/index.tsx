import { Pressable, Text, View } from 'react-native';
import { ChevronRight, ListChecks } from 'lucide-react-native';
import { BarraProgresso } from '@/components/ui/BarraProgresso';
import { SeloDemo } from '@/components/ui/SeloDemo';
import { cores } from '@/theme/tema';
import type { ListaResumida } from '@/types';
import { estilos } from './estilos';

type Props = { lista: ListaResumida; onPress: () => void };

export function CartaoLista({ lista, onPress }: Props) {
  const progresso = lista.totalItens > 0 ? lista.itensMarcados / lista.totalItens : 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [estilos.cartao, pressed && { opacity: 0.8 }]}
      accessibilityLabel={`Abrir lista ${lista.nome}`}
    >
      <View style={estilos.topo}>
        <View style={estilos.icone}>
          <ListChecks size={20} color={cores.primaria} />
        </View>
        <View style={estilos.meio}>
          <Text style={estilos.nome} numberOfLines={1}>
            {lista.nome}
          </Text>
          <Text style={estilos.detalhe}>
            {lista.totalItens === 0
              ? 'Nenhum item ainda'
              : `${lista.itensMarcados} de ${lista.totalItens} itens comprados`}
          </Text>
        </View>
        <ChevronRight size={20} color={cores.textoSuave} />
      </View>

      {lista.totalItens > 0 && <BarraProgresso valor={progresso} />}

      {(lista.demonstracao || lista.concluidaEm) && (
        <View style={estilos.selos}>
          {lista.concluidaEm && <Text style={estilos.concluida}>Concluída</Text>}
          {lista.demonstracao && <SeloDemo />}
        </View>
      )}
    </Pressable>
  );
}
