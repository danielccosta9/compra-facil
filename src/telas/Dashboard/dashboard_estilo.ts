import { StyleSheet } from 'react-native';
import { cores, espaco, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  saudacao: {
    fontFamily: fontes.regular,
    fontSize: 14,
    color: cores.textoSuave,
  },

  nome: {
    fontFamily: fontes.seminegrito,
    fontSize: 24,
    color: cores.texto,
  },

  botaoPerfil: {
    width: 44,
    height: 44,
    borderRadius: raio.pilula,
    backgroundColor: cores.primariaSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iniciais: {
    fontFamily: fontes.seminegrito,
    fontSize: 16,
    color: cores.primariaEscura,
  },

  erro: {
    fontFamily: fontes.regular,
    fontSize: 13,
    color: cores.erro,
    textAlign: 'center',
  },

  carregando: {
    marginTop: espaco.xl,
  },

  secao: {
    gap: espaco.sm,
  },
});
