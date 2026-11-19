import { StyleSheet } from 'react-native';
import { cores, fontes, raio } from '@/theme/tema';

export const estilos = StyleSheet.create({
  botao: {
    height: 52,
    borderRadius: raio.pilula,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primario: { backgroundColor: cores.primaria },
  secundario: { backgroundColor: cores.primariaSuave },
  conteudo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  texto: { fontFamily: fontes.seminegrito, fontSize: 15 },
});
