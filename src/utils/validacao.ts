import { endOfDay } from 'date-fns';
import { dataBrParaISO, paraISO } from './datas';
import { textoParaCentavos, totalDoItem } from './dinheiro';
import type { FormularioCompra, NovaCompra } from '@/types';

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

// "1,5" → 1.5 · "2" → 2 · "abc" → null
export function textoParaNumero(texto: string): number | null {
  const limpo = texto.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(limpo)) return null;
  return Number(limpo);
}

// Erros dos itens usam a chave "itens.<posição>.<campo>", ex.: "itens.0.preco".
export function validarCompra(formulario: FormularioCompra, hoje = new Date()): Erros {
  const erros: Erros = {};

  if (formulario.loja.trim().length < 2) erros.loja = 'Informe o estabelecimento.';

  const dataISO = dataBrParaISO(formulario.data, hoje);
  if (!dataISO) erros.data = 'Use o formato dd/mm/aaaa.';
  else if (dataISO > paraISO(endOfDay(hoje))) erros.data = 'A data não pode ser no futuro.';

  if (formulario.itens.length === 0) erros.itens = 'Adicione pelo menos um item.';

  formulario.itens.forEach((item, i) => {
    if (item.descricao.trim().length < 2) erros[`itens.${i}.descricao`] = 'Informe o produto.';

    const quantidade = textoParaNumero(item.quantidade);
    if (!quantidade || quantidade <= 0) {
      erros[`itens.${i}.quantidade`] = 'Quantidade inválida.';
    } else if (item.unidade === 'UN' && !Number.isInteger(quantidade)) {
      erros[`itens.${i}.quantidade`] = 'Use número inteiro para UN.';
    }

    const preco = textoParaCentavos(item.preco);
    if (!preco || preco <= 0) erros[`itens.${i}.preco`] = 'Preço inválido.';
  });

  return erros;
}

// Converte o formulário (já validado) na compra que vai para o banco.
export function montarCompra(formulario: FormularioCompra, hoje = new Date()): NovaCompra {
  const itens = formulario.itens.map((item) => {
    const quantidade = textoParaNumero(item.quantidade) ?? 1;
    const precoUnitarioCentavos = textoParaCentavos(item.preco) ?? 0;
    return {
      descricao: item.descricao.trim(),
      quantidade,
      unidade: item.unidade,
      precoUnitarioCentavos,
      totalCentavos: totalDoItem(precoUnitarioCentavos, quantidade),
    };
  });

  return {
    loja: formulario.loja.trim(),
    data: dataBrParaISO(formulario.data, hoje) ?? paraISO(hoje),
    totalCentavos: itens.reduce((soma, item) => soma + item.totalCentavos, 0),
    itens,
  };
}
