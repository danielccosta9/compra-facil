import { StyleSheet } from 'react-native';
import { cores, fontes } from '@/theme/tema';

export const estilos = StyleSheet.create({
  titulo: { fontFamily: fontes.negrito, fontSize: 24, color: cores.texto },
  centro: { flex: 1, justifyContent: 'center' },
});
