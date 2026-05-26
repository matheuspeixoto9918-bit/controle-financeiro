import type { FinanceData, Gasto } from "../types";

const now = new Date().toISOString();
const currentMonth = new Date();
const y = currentMonth.getFullYear();
const m = String(currentMonth.getMonth() + 1).padStart(2, "0");

const gastoSeed = (descricao: string, valor: number, categoria: Gasto["categoria"], day: number): Gasto => ({
  id: crypto.randomUUID(),
  descricao,
  valor,
  categoria,
  status: "pago",
  data: `${y}-${m}-${String(day).padStart(2, "0")}T12:00:00.000Z`,
});

export const seedFinanceData = (): FinanceData => ({
  salario: 5649.18,
  valorExtraBase: 575,
  gastos: [
    gastoSeed("Mercado Pago", 760, "Cartao/Fatura", 1),
    gastoSeed("Fatura", 250, "Cartao/Fatura", 2),
    gastoSeed("Sheik dia 30", 440, "Emprestimos", 3),
    gastoSeed("Net", 30, "Internet", 4),
    gastoSeed("Sheik dia 29", 450, "Emprestimos", 5),
    gastoSeed("Farme Presente", 270, "Pessoal", 6),
    gastoSeed("Bricio", 800, "Emprestimos", 7),
    gastoSeed("Sheik dia 05/06", 550, "Emprestimos", 8),
    gastoSeed("Facio", 306.9, "Contas fixas", 9),
    gastoSeed("Biplay", 128, "Outros", 10),
  ],
  extras: [],
  createdAt: now,
  updatedAt: now,
});
