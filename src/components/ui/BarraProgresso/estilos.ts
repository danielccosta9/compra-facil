import { StyleSheet } from 'react-native';
import { cores, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  trilho: {
    height: 6,
    borderRadius: raio.pilula,
    backgroundColor: cores.borda,
    overflow: 'hidden',
  },
  preenchido: { height: '100%', borderRadius: raio.pilula, backgroundColor: cores.primaria },
});
