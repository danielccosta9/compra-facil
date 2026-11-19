import { StyleSheet } from 'react-native';
import { cores, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  grupo: {
    flexDirection: 'row',
    backgroundColor: cores.superficie,
    borderRadius: raio.pilula,
    padding: 4,
  },
  opcao: { flex: 1, paddingVertical: 8, borderRadius: raio.pilula, alignItems: 'center' },
  ativo: { backgroundColor: cores.fundo },
  texto: { fontFamily: fontes.media, fontSize: 13, color: cores.textoSuave },
  textoAtivo: { color: cores.primaria },
});
