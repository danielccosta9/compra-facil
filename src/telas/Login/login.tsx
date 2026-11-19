
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';

import { Tela } from '@/components/ui/Tela';
import { Logo } from '@/components/ui/Logo';
import { CampoTexto } from '@/components/ui/CampoTexto';
import { Botao } from '@/components/ui/Botao';

import { useAuth } from '@/hooks/useAuth';
import { validarLogin, type Erros } from '@/utils/validacao';
import { avisar } from '@/utils/avisos';
import { estilos } from './login_estilo';

export default function Login() {
    const { entrar } = useAuth();
    const params = useLocalSearchParams<{ email?: string; contaCriada?: string }>();

    const [email, setEmail] = useState(params.email ?? '');
    const [senha, setSenha] = useState('');
    const [erros, setErros] = useState<Erros>({});
    const [carregando, setCarregando] = useState(false);

    async function handleEntrar() {
        const novosErros = validarLogin(email, senha);

        setErros(novosErros);

        if (Object.keys(novosErros).length > 0) return;

        setCarregando(true);

        try {
            await entrar(email, senha);
        } catch (erro) {
            setErros({ geral: (erro as Error).message });
            setCarregando(false);
        }
    }

    function handleEsqueciSenha() {
        avisar(
            'Recuperar senha',
            'Nesta versão as contas ficam só no aparelho. ' +
            'A recuperação de senha chegará quando o app tiver um servidor.'
        );
    }

    return (
        <Tela>
            <View style={estilos.topo}>
                <Logo />
                <Text style={estilos.titulo}>Entrar</Text>
                <Text style={estilos.subtitulo}>
                    Olá! Que bom ver você de novo.
                </Text>
            </View>

            <View style={estilos.formulario}>
                {params.contaCriada === '1' && (
                    <Text style={estilos.sucesso}>
                        Conta criada! Agora entre com seu e-mail e senha.
                    </Text>
                )}

                <CampoTexto
                    rotulo="E-mail"
                    placeholder="voce@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    erro={erros.email}
                />

                <CampoTexto
                    rotulo="Senha"
                    placeholder="Sua senha"
                    value={senha}
                    onChangeText={setSenha}
                    senha
                    erro={erros.senha}
                />

                <Pressable
                    onPress={handleEsqueciSenha}
                    style={estilos.esqueci}
                >
                    <Text style={estilos.link}>
                        Esqueceu a senha?
                    </Text>
                </Pressable>

                {!!erros.geral && (
                    <Text style={estilos.erroGeral}>
                        {erros.geral}
                    </Text>
                )}

                <Botao
                    titulo="Entrar"
                    onPress={handleEntrar}
                    carregando={carregando}
                />
            </View>

            <View style={estilos.rodape}>
                <Text style={estilos.textoRodape}>
                    Ainda não tem conta?
                </Text>

                <Link href="/cadastro" replace>
                    <Text style={estilos.link}>
                        Criar conta
                    </Text>
                </Link>
            </View>
        </Tela>
    );
}
