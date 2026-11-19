import { StyleSheet } from 'react-native';
import { cores, fontes } from '@/theme/tema';

export const estilos = StyleSheet.create({
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titulo: { fontFamily: fontes.seminegrito, fontSize: 16, color: cores.texto },
  acao: { fontFamily: fontes.media, fontSize: 13, color: cores.primaria },
});
