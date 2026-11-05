import { StyleSheet } from 'react-native';
import { cores, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  selo: {
    alignSelf: 'flex-start',
    fontFamily: fontes.media,
    fontSize: 10,
    color: cores.aviso,
    backgroundColor: cores.avisoSuave,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: raio.pilula,
    overflow: 'hidden',
  },
});
