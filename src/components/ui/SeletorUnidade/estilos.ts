import { StyleSheet } from 'react-native';
import { cores, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  rotulo: { fontFamily: fontes.media, fontSize: 14, color: cores.texto, marginBottom: 6 },
  unidades: {
    flexDirection: 'row',
    height: 52,
    backgroundColor: cores.fundo,
    borderRadius: raio.sm,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: 4,
  },
  unidade: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  unidadeAtiva: { backgroundColor: cores.primariaSuave },
  textoUnidade: { fontFamily: fontes.media, fontSize: 14, color: cores.textoSuave },
  textoUnidadeAtiva: { color: cores.primariaEscura },
});
