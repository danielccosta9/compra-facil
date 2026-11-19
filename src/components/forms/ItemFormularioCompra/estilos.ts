import { StyleSheet } from 'react-native';
import { cores, espaco, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  cartao: {
    gap: espaco.sm,
    padding: espaco.md,
    borderRadius: raio.md,
    backgroundColor: cores.superficie,
  },
  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  numero: { fontFamily: fontes.seminegrito, fontSize: 13, color: cores.textoSuave },
  linha: { flexDirection: 'row', gap: espaco.sm, alignItems: 'flex-start' },
  metade: { flex: 1 },
  subtotal: { fontFamily: fontes.regular, fontSize: 13, color: cores.textoSuave, textAlign: 'right' },
  subtotalValor: { fontFamily: fontes.seminegrito, color: cores.texto },
});
