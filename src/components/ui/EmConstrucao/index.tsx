import { Text, View } from 'react-native';
import { Hammer } from 'lucide-react-native';
import { Tela } from '@/components/ui/Tela';
import { EstadoVazio } from '@/components/ui/EstadoVazio';
import { cores } from '@/theme/tema';
import { estilos } from './estilos';

type Props = { titulo: string; descricao: string; aula: string };

export function EmConstrucao({ titulo, descricao, aula }: Props) {
  return (
    <Tela>
      <Text style={estilos.titulo}>{titulo}</Text>
      <View style={estilos.centro}>
        <EstadoVazio
          icone={<Hammer size={26} color={cores.primaria} />}
          titulo={`Disponível na ${aula}`}
          texto={descricao}
        />
      </View>
    </Tela>
  );
}
