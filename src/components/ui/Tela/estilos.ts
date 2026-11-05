import { StyleSheet } from 'react-native';
import { cores, espaco } from '@/theme/tema';

export const estilos = StyleSheet.create({
  area: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, padding: espaco.lg, gap: espaco.lg },
});
