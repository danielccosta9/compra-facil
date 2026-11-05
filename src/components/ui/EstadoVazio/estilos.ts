import { StyleSheet } from 'react-native';
import { cores, espaco, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  caixa: {
    alignItems: 'center',
    gap: espaco.sm,
    padding: espaco.lg,
    borderRadius: raio.md,
    backgroundColor: cores.superficie,
  },
  icone: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: cores.primariaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontFamily: fontes.seminegrito,
    fontSize: 15,
    color: cores.texto,
    textAlign: 'center',
  },
  texto: {
    fontFamily: fontes.regular,
    fontSize: 13,
    color: cores.textoSuave,
    textAlign: 'center',
    marginBottom: espaco.sm,
  },
});
