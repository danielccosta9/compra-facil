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

  tituloTela: {
    fontFamily: fontes.negrito,
    fontSize: 24,
    color: cores.texto,
  },

  cabecalho: {
    alignItems: 'center',
    gap: espaco.xs,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: raio.pilula,
    backgroundColor: cores.primariaSuave,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: espaco.sm,
  },

  iniciais: {
    fontFamily: fontes.seminegrito,
    fontSize: 32,
    color: cores.primariaEscura,
  },

  nome: {
    fontFamily: fontes.seminegrito,
    fontSize: 22,
    color: cores.texto,
  },

  email: {
    fontFamily: fontes.regular,
    fontSize: 14,
    color: cores.textoSuave,
  },

  cartao: {
    backgroundColor: cores.superficie,
    borderRadius: raio.md,
    padding: espaco.md,
    gap: espaco.md,
  },

  cartaoTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espaco.sm,
  },

  cartaoTitulo: {
    fontFamily: fontes.seminegrito,
    fontSize: 16,
    color: cores.texto,
  },

  cartaoTexto: {
    fontFamily: fontes.regular,
    fontSize: 13,
    lineHeight: 20,
    color: cores.textoSuave,
  },

  botaoSair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espaco.sm,
    height: 52,
    borderRadius: raio.pilula,
    borderWidth: 1,
    borderColor: cores.borda,
    marginTop: 'auto',
  },

  textoSair: {
    fontFamily: fontes.seminegrito,
    fontSize: 15,
    color: cores.erro,
  },
});
