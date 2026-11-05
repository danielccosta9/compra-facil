import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Poppins_400Regular,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';

export default function RootLayout() {
  const [fontesCarregadas] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  if (!fontesCarregadas) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
