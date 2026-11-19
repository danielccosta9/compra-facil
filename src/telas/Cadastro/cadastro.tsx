
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Link, router } from 'expo-router';

import { Tela } from '@/components/ui/Tela';
import { Logo } from '@/components/ui/Logo';
import { CampoTexto } from '@/components/ui/CampoTexto';
import { Botao } from '@/components/ui/Botao';

import { useAuth } from '@/hooks/useAuth';
import { validarCadastro, type Erros } from '@/utils/validacao';
import { cores } from '@/theme/tema';
import { estilos } from './cadastro_estilo';

export default function Cadastro() {
    const { cadastrar } = useAuth();

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmacao, setConfirmacao] = useState('');
    const [erros, setErros] = useState<Erros>({});
    const [carregando, setCarregando] = useState(false);

    async function handleCriarConta() {
        const novosErros = validarCadastro(
            nome,
            email,
            senha,
            confirmacao
        );

        setErros(novosErros);

        if (Object.keys(novosErros).length > 0) return;

        setCarregando(true);

        try {
            await cadastrar(nome, email, senha);
            router.replace({
                pathname: '/login',
                params: { email: email.trim(), contaCriada: '1' },
            });
        } catch (erro) {
            setErros({ geral: (erro as Error).message });
            setCarregando(false);
        }
    }

    return (
        <Tela>
            <View style={estilos.topo}>
                <Logo />

                <Text style={estilos.titulo}>
                    Crie sua <Text style={{ color: cores.primaria }}>conta!</Text>
                </Text>

                <Text style={estilos.subtitulo}>
                    Comece a controlar suas compras e economizar.
                </Text>
            </View>

            <View style={estilos.formulario}>
                <CampoTexto
                    rotulo="Nome"
                    placeholder="Seu nome"
                    value={nome}
                    onChangeText={setNome}
                    autoComplete="name"
                    erro={erros.nome}
                />

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
                    placeholder="Mínimo de 6 caracteres"
                    value={senha}
                    onChangeText={setSenha}
                    senha
                    erro={erros.senha}
                />

                <CampoTexto
                    rotulo="Confirmar senha"
                    placeholder="Repita a senha"
                    value={confirmacao}
                    onChangeText={setConfirmacao}
                    senha
                    erro={erros.confirmacao}
                />

                {!!erros.geral && (
                    <Text style={estilos.erroGeral}>
                        {erros.geral}
                    </Text>
                )}

                <Botao
                    titulo="Criar conta"
                    onPress={handleCriarConta}
                    carregando={carregando}
                />
            </View>

            <View style={estilos.rodape}>
                <Text style={estilos.textoRodape}>
                    Já tem uma conta?
                </Text>

                <Link href="/login" replace>
                    <Text style={estilos.link}>
                        Entrar
                    </Text>
                </Link>
            </View>
        </Tela>
    );
}
