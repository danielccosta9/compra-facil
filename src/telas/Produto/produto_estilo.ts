import { StyleSheet } from 'react-native';
import { cores, espaco, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  topo: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  voltar: {
    width: 40,
    height: 40,
    borderRadius: raio.pilula,
    backgroundColor: cores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { flex: 1, fontFamily: fontes.negrito, fontSize: 22, color: cores.texto },
  carregando: { marginTop: espaco.xl },

  // Tela do produto
  categoria: { fontFamily: fontes.regular, fontSize: 13, color: cores.textoSuave },
  destaque: {
    gap: espaco.xs,
    padding: espaco.md,
    borderRadius: raio.md,
    backgroundColor: cores.primariaSuave,
  },
  destaqueRotulo: { fontFamily: fontes.regular, fontSize: 12, color: cores.primariaEscura },
  destaqueValor: { fontFamily: fontes.negrito, fontSize: 28, color: cores.texto },
  destaqueDetalhe: { fontFamily: fontes.regular, fontSize: 12, color: cores.primariaEscura },
  selo: {
    alignSelf: 'flex-start',
    fontFamily: fontes.media,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: raio.pilula,
    overflow: 'hidden',
  },
  seloAbaixo: { color: cores.primariaEscura, backgroundColor: cores.fundo },
  seloAcima: { color: cores.aviso, backgroundColor: cores.avisoSuave },
  grade: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  secao: { gap: espaco.sm },
  rotuloSecao: { fontFamily: fontes.seminegrito, fontSize: 15, color: cores.texto },
  nota: { fontFamily: fontes.regular, fontSize: 11, color: cores.textoSuave },
  linhaHistorico: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  historicoLoja: { fontFamily: fontes.media, fontSize: 13, color: cores.texto },
  historicoData: { fontFamily: fontes.regular, fontSize: 12, color: cores.textoSuave },
  historicoValor: { fontFamily: fontes.seminegrito, fontSize: 13, color: cores.texto },
});
