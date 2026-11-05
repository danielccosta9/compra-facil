import { StyleSheet } from 'react-native';
import { cores, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  container: { gap: 6 },
  rotulo: { fontFamily: fontes.media, fontSize: 14, color: cores.texto },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    paddingHorizontal: 16,
    borderRadius: raio.sm,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.fundo,
  },
  caixaFocada: { borderColor: cores.primaria },
  caixaErro: { borderColor: cores.erro },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fontes.regular,
    fontSize: 15,
    color: cores.texto,
    outlineWidth: 0,
  },
  erro: { fontFamily: fontes.regular, fontSize: 12, color: cores.erro },
});
