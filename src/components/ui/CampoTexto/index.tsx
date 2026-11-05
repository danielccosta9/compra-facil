import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { cores } from '@/theme/tema';
import { estilos } from './estilos';

type Props = TextInputProps & {
  rotulo: string;
  erro?: string;
  senha?: boolean;
};

export function CampoTexto({ rotulo, erro, senha = false, ...propsDoInput }: Props) {
  const [ocultar, setOcultar] = useState(senha);
  const [focado, setFocado] = useState(false);

  return (
    <View style={estilos.container}>
      <Text style={estilos.rotulo}>{rotulo}</Text>

      <View
        style={[
          estilos.caixa,
          focado && estilos.caixaFocada,
          !!erro && estilos.caixaErro,
        ]}
      >
        <TextInput
          style={estilos.input}
          placeholderTextColor={cores.textoSuave}
          secureTextEntry={ocultar}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          {...propsDoInput}
        />
        {senha && (
          <Pressable
            onPress={() => setOcultar(!ocultar)}
            hitSlop={10}
            accessibilityLabel="Mostrar ou ocultar senha"
          >
            {ocultar ? (
              <EyeOff size={20} color={cores.textoSuave} />
            ) : (
              <Eye size={20} color={cores.textoSuave} />
            )}
          </Pressable>
        )}
      </View>

      {!!erro && <Text style={estilos.erro}>{erro}</Text>}
    </View>
  );
}
