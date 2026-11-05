import { StyleSheet } from 'react-native';
import { cores, espaco, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  cartao: {
    flexDirection: 'row',
    gap: 12,
    padding: espaco.md,
    borderRadius: raio.md,
    backgroundColor: cores.superficie,
  },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.primariaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meio: { flex: 1, gap: 4 },
  produto: { fontFamily: fontes.seminegrito, fontSize: 14, color: cores.texto },
  texto: {
    fontFamily: fontes.regular,
    fontSize: 12,
    lineHeight: 18,
    color: cores.textoSuave,
  },
  nivel: { fontFamily: fontes.media, fontSize: 11, color: cores.primaria },
});
