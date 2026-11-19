import { StyleSheet } from 'react-native';
import { cores, fontes } from '@/theme/tema';

export const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: cores.primaria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nome: { fontFamily: fontes.negrito, fontSize: 22, color: cores.texto },
});
