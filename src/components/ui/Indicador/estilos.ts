import { StyleSheet } from 'react-native';
import { cores, espaco, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  caixa: {
    flexGrow: 1,
    flexBasis: '45%',
    gap: 2,
    padding: espaco.md,
    borderRadius: raio.md,
    backgroundColor: cores.superficie,
  },
  rotulo: { fontFamily: fontes.regular, fontSize: 12, color: cores.textoSuave },
  valor: { fontFamily: fontes.seminegrito, fontSize: 17, color: cores.texto },
});
