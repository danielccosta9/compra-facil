import { Alert, Platform } from 'react-native';

export function avisar(titulo: string, mensagem: string) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
    return;
  }
  Alert.alert(titulo, mensagem);
}

export function confirmar(
  titulo: string,
  mensagem: string,
  textoConfirmar = 'Confirmar',
): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }
  return new Promise((resolver) => {
    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolver(false) },
      { text: textoConfirmar, style: 'destructive', onPress: () => resolver(true) },
    ]);
  });
}
