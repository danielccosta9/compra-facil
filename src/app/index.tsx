import { StyleSheet, Text, View } from 'react-native';
import { Logo } from '@/components/ui/Logo';
import { cores, fontes } from '@/theme/tema';

export default function Index() {
  return (
    <View style={estilos.container}>
      <Logo />
      <Text style={estilos.texto}>Vamos começar a desenvolver...</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: cores.fundo,
  },
  texto: { fontFamily: fontes.regular, fontSize: 15, color: cores.textoSuave },
});
