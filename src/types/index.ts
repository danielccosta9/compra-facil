export type Usuario = {
  id: number;
  nome: string;
  email: string;
};

export type Periodo = 'mes' | 'trimestre' | 'ano';

export type ResumoGastos = {
  totalCentavos: number;
  quantidadeCompras: number;
  mediaCentavos: number;
};

export type CompraResumida = {
  id: number;
  estabelecimento: string;
  data: string;
  totalCentavos: number;
  quantidadeItens: number;
  demonstracao: boolean;
};

export type PrecoObservado = {
  produto: string;
  estabelecimento: string;
  precoCentavos: number;
  produtoId?: number; // presente quando o preço vem do histórico de produtos
};

export type Embalagem = {
  tamanho: number; // já convertido: 0.5 kg, 0.9 L...
  unidade: 'kg' | 'l' | 'un';
};

export type Categoria = {
  id: number;
  nome: string;
};

export type Produto = {
  id: number;
  nome: string;
  categoriaId: number | null;
  embalagem: Embalagem | null;
  demonstracao: boolean;
};

export type UnidadeItem = 'UN' | 'KG';

// O que o usuário digita na tela (tudo texto).
export type ItemFormulario = {
  chave: string; // identifica o item na lista da tela
  descricao: string;
  quantidade: string;
  unidade: UnidadeItem;
  preco: string;
};

export type FormularioCompra = {
  loja: string;
  data: string; // "15/11/2026"
  itens: ItemFormulario[];
};

// A compra já convertida, pronta para o banco.
export type NovaCompra = {
  loja: string;
  data: string; // ISO
  totalCentavos: number;
  itens: {
    descricao: string;
    quantidade: number;
    unidade: UnidadeItem;
    precoUnitarioCentavos: number;
    totalCentavos: number;
  }[];
};

export type ListaResumida = {
  id: number;
  nome: string;
  criadaEm: string;
  concluidaEm: string | null;
  totalItens: number;
  itensMarcados: number;
  demonstracao: boolean;
};

export type ItemLista = {
  id: number;
  descricao: string;
  quantidade: number;
  unidade: UnidadeItem;
  marcado: boolean;
  posicao: number;
  produtoId: number | null;
  precoMedioCentavos: number | null; // média do histórico de preços do produto
};

export type ListaDetalhada = {
  id: number;
  nome: string;
  concluidaEm: string | null;
  demonstracao: boolean;
  itens: ItemLista[];
};

export type ResumoPrecoProduto = {
  id: number;
  nome: string;
  categoria: string | null;
  observacoes: number;
  ultimoCentavos: number;
  mediaCentavos: number;
  menorCentavos: number;
};

// Aviso salvo no banco (tabela notifications). Por enquanto só aparece dentro do app.
export type TipoNotificacao = 'lembrete_lista' | 'preco_baixo';

export type Notificacao = {
  id: number;
  tipo: TipoNotificacao;
  titulo: string;
  texto: string;
  criadaEm: string; // ISO
  lida: boolean;
};

export type NovaNotificacao = Pick<Notificacao, 'tipo' | 'titulo' | 'texto'>;
