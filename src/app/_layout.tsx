import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { migrarBanco } from '@/database/migracoes';

function Rotas() {
  const { usuario, carregando } = useAuth();
  if (carregando) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>

      {/* Na aula: ao criar (tabs)/_layout.tsx, "(tabs)/dashboard" vira name="(tabs)" */}
      <Stack.Protected guard={!!usuario}>
        <Stack.Screen name="(tabs)/dashboard" />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="precos" />
        <Stack.Screen name="produto/[id]" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontesCarregadas] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  if (!fontesCarregadas) return null;

  return (
    <SQLiteProvider databaseName="compra-facil.db" onInit={migrarBanco}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Rotas />
      </AuthProvider>
    </SQLiteProvider>
  );
}
