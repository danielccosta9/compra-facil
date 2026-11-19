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
  subtitulo: { fontFamily: fontes.regular, fontSize: 13, color: cores.textoSuave },
  lista: { gap: 0 },
  aviso: { fontFamily: fontes.regular, fontSize: 13, color: cores.textoSuave, textAlign: 'center' },
  erro: { fontFamily: fontes.regular, fontSize: 13, color: cores.erro, textAlign: 'center' },
  carregando: { marginTop: espaco.xl },
});
