import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { cadastrarUsuario, entrarComEmail } from '@/services/autenticacao';
import {
  lerConfiguracao,
  salvarConfiguracao,
} from '@/database/repositories/configuracoes';
import { buscarUsuarioPorId } from '@/database/repositories/usuarios';
import type { Usuario } from '@/types';

type ContextoAuth = {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<ContextoAuth | null>(null);
const CHAVE_SESSAO = 'usuario_logado';

export function AuthProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function restaurarSessao() {
      const id = await lerConfiguracao(db, CHAVE_SESSAO);
      if (id) setUsuario(await buscarUsuarioPorId(db, Number(id)));
      setCarregando(false);
    }
    restaurarSessao();
  }, [db]);

  async function iniciarSessao(novoUsuario: Usuario) {
    await salvarConfiguracao(db, CHAVE_SESSAO, String(novoUsuario.id));
    setUsuario(novoUsuario);
  }

  async function entrar(email: string, senha: string) {
    await iniciarSessao(await entrarComEmail(db, email, senha));
  }

  async function cadastrar(nome: string, email: string, senha: string) {
    await iniciarSessao(await cadastrarUsuario(db, nome, email, senha));
  }

  async function sair() {
    await salvarConfiguracao(db, CHAVE_SESSAO, null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth precisa estar dentro do <AuthProvider>.');
  return contexto;
}
