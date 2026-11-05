import { StyleSheet } from 'react-native';
import { cores, espaco, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  cartao: {
    backgroundColor: cores.primaria,
    borderRadius: raio.lg,
    padding: espaco.lg,
    gap: 4,
  },
  rotulo: { fontFamily: fontes.regular, fontSize: 14, color: cores.primariaSuave },
  total: { fontFamily: fontes.negrito, fontSize: 32, color: cores.branco },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: espaco.md,
    paddingVertical: 12,
    paddingHorizontal: espaco.md,
    borderRadius: raio.md,
    backgroundColor: cores.primariaEscura,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  infoTexto: { fontFamily: fontes.media, fontSize: 13, color: cores.branco },
  divisor: { width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.3)' },
});
