import { StyleSheet } from 'react-native';
import { cores, espaco, fontes } from '@/theme/tema';

export const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  marcar: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  meio: { flex: 1, gap: 2 },
  descricao: { fontFamily: fontes.media, fontSize: 14, color: cores.texto },
  descricaoMarcada: { color: cores.textoSuave, textDecorationLine: 'line-through' },
  detalhe: { fontFamily: fontes.regular, fontSize: 12, color: cores.textoSuave },
  remover: { padding: espaco.xs },
});
