export type Categoria =
  | "Cartao/Fatura"
  | "Internet"
  | "Emprestimos"
  | "Mercado"
  | "Pessoal"
  | "Contas fixas"
  | "Outros";

export type StatusGasto = "pago" | "pendente";

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Gasto {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: Categoria;
  status: StatusGasto;
}

export interface Extra {
  id: string;
  descricao: string;
  valor: number;
  data: string;
}

export interface FinanceData {
  salario: number;
  valorExtraBase: number;
  gastos: Gasto[];
  extras: Extra[];
  createdAt: string;
  updatedAt: string;
}
