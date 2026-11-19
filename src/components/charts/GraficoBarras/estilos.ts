import { StyleSheet } from 'react-native';
import { cores, espaco, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  grafico: { gap: espaco.sm },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  rotulo: { width: 92, fontFamily: fontes.media, fontSize: 12, color: cores.texto },
  trilho: { flex: 1, height: 10, borderRadius: raio.pilula, backgroundColor: cores.superficie },
  barra: { height: '100%', borderRadius: raio.pilula, backgroundColor: cores.primaria },
  barraDestaque: { backgroundColor: cores.primariaEscura },
  valor: {
    width: 74,
    textAlign: 'right',
    fontFamily: fontes.seminegrito,
    fontSize: 12,
    color: cores.texto,
  },
});
