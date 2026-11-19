import { StyleSheet } from 'react-native';
import { cores, fontes } from '@/theme/tema';

export const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.primariaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meio: { flex: 1, gap: 2 },
  nome: { fontFamily: fontes.media, fontSize: 14, color: cores.texto },
  detalhe: { fontFamily: fontes.regular, fontSize: 12, color: cores.textoSuave },
  valor: { fontFamily: fontes.seminegrito, fontSize: 14, color: cores.texto },
});
