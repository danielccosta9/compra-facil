import { Pressable, Text, View } from 'react-native';
import type { Periodo } from '@/types';
import { estilos } from './estilos';

const opcoes: { valor: Periodo; rotulo: string }[] = [
  { valor: 'mes', rotulo: 'Mês' },
  { valor: 'trimestre', rotulo: 'Trimestre' },
  { valor: 'ano', rotulo: 'Ano' },
];

type Props = { valor: Periodo; onMudar: (periodo: Periodo) => void };

export function SeletorPeriodo({ valor, onMudar }: Props) {
  return (
    <View style={estilos.grupo}>
      {opcoes.map((opcao) => {
        const ativo = opcao.valor === valor;
        return (
          <Pressable
            key={opcao.valor}
            onPress={() => onMudar(opcao.valor)}
            style={[estilos.opcao, ativo && estilos.ativo]}
          >
            <Text style={[estilos.texto, ativo && estilos.textoAtivo]}>
              {opcao.rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
