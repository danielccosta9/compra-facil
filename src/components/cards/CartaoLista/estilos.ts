import { StyleSheet } from 'react-native';
import { cores, espaco, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  cartao: {
    gap: espaco.sm,
    padding: espaco.md,
    borderRadius: raio.md,
    backgroundColor: cores.superficie,
  },
  topo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icone: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.primariaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meio: { flex: 1, gap: 2 },
  nome: { fontFamily: fontes.seminegrito, fontSize: 15, color: cores.texto },
  detalhe: { fontFamily: fontes.regular, fontSize: 12, color: cores.textoSuave },
  selos: { flexDirection: 'row', gap: espaco.xs },
  concluida: {
    alignSelf: 'flex-start',
    fontFamily: fontes.media,
    fontSize: 11,
    color: cores.primariaEscura,
    backgroundColor: cores.primariaSuave,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: raio.pilula,
    overflow: 'hidden',
  },
});
