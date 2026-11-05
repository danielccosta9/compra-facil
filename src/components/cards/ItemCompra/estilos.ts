import { StyleSheet } from 'react-native';
import { cores, fontes } from '@/theme/tema';

export const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  icone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cores.primariaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meio: { flex: 1, gap: 2 },
  loja: { fontFamily: fontes.media, fontSize: 14, color: cores.texto },
  detalhe: { fontFamily: fontes.regular, fontSize: 12, color: cores.textoSuave },
  valor: { fontFamily: fontes.seminegrito, fontSize: 14, color: cores.texto },
});
