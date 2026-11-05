export type Erros = Record<string, string>;

export function emailValido(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validarLogin(email: string, senha: string): Erros {
  const erros: Erros = {};
  if (!emailValido(email)) erros.email = 'Informe um e-mail válido.';
  if (senha.length === 0) erros.senha = 'Informe sua senha.';
  return erros;
}

export function validarCadastro(
  nome: string,
  email: string,
  senha: string,
  confirmacao: string,
): Erros {
  const erros: Erros = {};
  if (nome.trim().length < 2) erros.nome = 'Informe seu nome.';
  if (!emailValido(email)) erros.email = 'Informe um e-mail válido.';
  if (senha.length < 6) erros.senha = 'A senha precisa ter pelo menos 6 caracteres.';
  if (confirmacao !== senha) erros.confirmacao = 'As senhas não conferem.';
  return erros;
}
