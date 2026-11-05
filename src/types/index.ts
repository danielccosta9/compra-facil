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
};
