import { Text, View } from 'react-native';
import { estilos } from './estilos';

export type BarraDoGrafico = {
  rotulo: string;
  valor: number;
  texto: string; // valor já formatado (ex.: "R$ 5,49")
  destaque?: boolean;
};

// Gráfico de barras horizontais feito só com View: a largura é proporcional ao maior valor.
export function GraficoBarras({ barras }: { barras: BarraDoGrafico[] }) {
  const maior = Math.max(...barras.map((b) => b.valor), 1);

  return (
    <View style={estilos.grafico}>
      {barras.map((barra) => (
        <View key={barra.rotulo} style={estilos.linha}>
          <Text style={estilos.rotulo} numberOfLines={1}>
            {barra.rotulo}
          </Text>
          <View style={estilos.trilho}>
            <View
              style={[
                estilos.barra,
                barra.destaque && estilos.barraDestaque,
                { width: `${(barra.valor / maior) * 100}%` },
              ]}
            />
          </View>
          <Text style={estilos.valor}>{barra.texto}</Text>
        </View>
      ))}
    </View>
  );
}
