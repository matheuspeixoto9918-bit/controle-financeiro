import { createContext, useEffect, useMemo, useState } from "react";
import type { Extra, FinanceData, Gasto } from "../types";
import { useAuth } from "../hooks/useAuth";
import { storage } from "../lib/storage";
import { seedFinanceData } from "../data/seed";

interface FinanceContextType {
  data: FinanceData | null;
  totalGastos: number;
  totalExtrasItens: number;
  totalValorExtra: number;
  saldoRestante: number;
  saldoFinal: number;
  loadSeedData: () => void;
  updateSalario: (valor: number) => void;
  updateValorExtraBase: (valor: number) => void;
  addGasto: (payload: Omit<Gasto, "id">) => void;
  updateGasto: (id: string, payload: Omit<Gasto, "id">) => void;
  deleteGasto: (id: string) => void;
  addExtra: (payload: Omit<Extra, "id">) => void;
  updateExtra: (id: string, payload: Omit<Extra, "id">) => void;
  deleteExtra: (id: string) => void;
}

export const FinanceContext = createContext<FinanceContextType | null>(null);

const round2 = (n: number): number => Number(n.toFixed(2));

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [data, setData] = useState<FinanceData | null>(null);

  useEffect(() => {
    if (!user) {
      setData(null);
      return;
    }
    const existing = storage.getFinance(user.id);
    if (existing) {
      setData(existing);
      return;
    }
    const empty: FinanceData = {
      salario: 0,
      valorExtraBase: 0,
      gastos: [],
      extras: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.saveFinance(user.id, empty);
    setData(empty);
  }, [user]);

  const persist = (next: FinanceData) => {
    if (!user) return;
    const updated = { ...next, updatedAt: new Date().toISOString() };
    storage.saveFinance(user.id, updated);
    setData(updated);
  };

  const loadSeedData = () => {
    if (!user) return;
    const seeded = seedFinanceData();
    storage.saveFinance(user.id, seeded);
    setData(seeded);
  };

  const updateSalario = (valor: number) => {
    if (!data) return;
    persist({ ...data, salario: valor });
  };

  const updateValorExtraBase = (valor: number) => {
    if (!data) return;
    persist({ ...data, valorExtraBase: valor });
  };

  const addGasto = (payload: Omit<Gasto, "id">) => {
    if (!data) return;
    persist({ ...data, gastos: [{ ...payload, id: crypto.randomUUID() }, ...data.gastos] });
  };

  const updateGasto = (id: string, payload: Omit<Gasto, "id">) => {
    if (!data) return;
    persist({ ...data, gastos: data.gastos.map((g) => (g.id === id ? { ...payload, id } : g)) });
  };

  const deleteGasto = (id: string) => {
    if (!data) return;
    persist({ ...data, gastos: data.gastos.filter((g) => g.id !== id) });
  };

  const addExtra = (payload: Omit<Extra, "id">) => {
    if (!data) return;
    persist({ ...data, extras: [{ ...payload, id: crypto.randomUUID() }, ...data.extras] });
  };

  const updateExtra = (id: string, payload: Omit<Extra, "id">) => {
    if (!data) return;
    persist({ ...data, extras: data.extras.map((e) => (e.id === id ? { ...payload, id } : e)) });
  };

  const deleteExtra = (id: string) => {
    if (!data) return;
    persist({ ...data, extras: data.extras.filter((e) => e.id !== id) });
  };

  const totals = useMemo(() => {
    const totalGastos = round2((data?.gastos ?? []).reduce((acc, g) => acc + g.valor, 0));
    const totalExtrasItens = round2((data?.extras ?? []).reduce((acc, e) => acc + e.valor, 0));
    const totalValorExtra = round2((data?.valorExtraBase ?? 0) + totalExtrasItens);
    const saldoRestante = round2((data?.salario ?? 0) - totalGastos);
    const saldoFinal = round2(saldoRestante + totalValorExtra);
    return { totalGastos, totalExtrasItens, totalValorExtra, saldoRestante, saldoFinal };
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const isSeedShape =
      data.salario === 5649.18 &&
      data.valorExtraBase === 575 &&
      data.extras.length === 0 &&
      data.gastos.length === 10;
    if (!isSeedShape) return;
    console.assert(totals.totalGastos === 3984.9, "Total de gastos diferente do esperado");
    console.assert(totals.saldoRestante === 1664.28, "Saldo restante diferente do esperado");
    console.assert(totals.saldoFinal === 2239.28, "Saldo final diferente do esperado");
    console.log("Seed validado:", totals.totalGastos, totals.saldoRestante, totals.saldoFinal);
  }, [data, totals]);

  const value = useMemo<FinanceContextType>(
    () => ({
      data,
      ...totals,
      loadSeedData,
      updateSalario,
      updateValorExtraBase,
      addGasto,
      updateGasto,
      deleteGasto,
      addExtra,
      updateExtra,
      deleteExtra,
    }),
    [data, totals],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
