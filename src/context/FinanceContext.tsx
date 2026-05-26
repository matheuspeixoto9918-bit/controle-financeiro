import { createContext, useEffect, useMemo, useState } from "react";
import type { Extra, FinanceData, Gasto } from "../types";
import { useAuth } from "../hooks/useAuth";
import { seedFinanceData } from "../data/seed";
import { supabase } from "../lib/supabase";

interface FinanceContextType {
  data: FinanceData | null;
  loading: boolean;
  totalGastos: number;
  totalExtrasItens: number;
  totalValorExtra: number;
  saldoRestante: number;
  saldoFinal: number;
  loadSeedData: () => Promise<void>;
  updateSalario: (valor: number) => Promise<void>;
  updateValorExtraBase: (valor: number) => Promise<void>;
  addGasto: (payload: Omit<Gasto, "id">) => Promise<void>;
  updateGasto: (id: string, payload: Omit<Gasto, "id">) => Promise<void>;
  deleteGasto: (id: string) => Promise<void>;
  addExtra: (payload: Omit<Extra, "id">) => Promise<void>;
  updateExtra: (id: string, payload: Omit<Extra, "id">) => Promise<void>;
  deleteExtra: (id: string) => Promise<void>;
}

export const FinanceContext = createContext<FinanceContextType | null>(null);

const round2 = (n: number): number => Number(n.toFixed(2));

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (userId: string): Promise<void> => {
    setLoading(true);
    try {
      const { data: baseRow, error: baseError } = await supabase
        .from("finance_data")
        .select("salario, valor_extra_base, created_at, updated_at")
        .eq("user_id", userId)
        .maybeSingle();
      if (baseError) throw baseError;

      if (!baseRow) {
        const now = new Date().toISOString();
        setData({
          salario: 0,
          valorExtraBase: 0,
          gastos: [],
          extras: [],
          createdAt: now,
          updatedAt: now,
        });
        return;
      }

      const [{ data: gastosRows, error: gastosError }, { data: extrasRows, error: extrasError }] = await Promise.all([
        supabase.from("gastos").select("*").eq("user_id", userId).order("data", { ascending: false }),
        supabase.from("extras").select("*").eq("user_id", userId).order("data", { ascending: false }),
      ]);
      if (gastosError) throw gastosError;
      if (extrasError) throw extrasError;

      const parsedData: FinanceData = {
        salario: Number(baseRow.salario ?? 0),
        valorExtraBase: Number(baseRow.valor_extra_base ?? 0),
        gastos: (gastosRows ?? []).map((g) => ({
          id: g.id as string,
          descricao: g.descricao as string,
          valor: Number(g.valor),
          data: g.data as string,
          categoria: g.categoria as Gasto["categoria"],
          status: g.status as Gasto["status"],
        })),
        extras: (extrasRows ?? []).map((e) => ({
          id: e.id as string,
          descricao: e.descricao as string,
          valor: Number(e.valor),
          data: e.data as string,
        })),
        createdAt: (baseRow.created_at as string) ?? new Date().toISOString(),
        updatedAt: (baseRow.updated_at as string) ?? new Date().toISOString(),
      };
      setData(parsedData);

      const isSeedShape =
        parsedData.salario === 5649.18 &&
        parsedData.valorExtraBase === 575 &&
        parsedData.extras.length === 0 &&
        parsedData.gastos.length === 10;
      if (isSeedShape) {
        const totalGastos = round2(parsedData.gastos.reduce((acc, g) => acc + g.valor, 0));
        const saldoRestante = round2(parsedData.salario - totalGastos);
        const saldoFinal = round2(saldoRestante + parsedData.valorExtraBase);
        console.assert(totalGastos === 3984.9, "Total de gastos diferente do esperado");
        console.assert(saldoRestante === 1664.28, "Saldo restante diferente do esperado");
        console.assert(saldoFinal === 2239.28, "Saldo final diferente do esperado");
        console.log("Seed validado:", totalGastos, saldoRestante, saldoFinal);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setData(null);
      return;
    }
    void fetchData(user.id);
  }, [user]);

  const loadSeedData = async () => {
    if (!user) return;
    const seeded = seedFinanceData();
    const { error: baseError } = await supabase.from("finance_data").upsert({
      user_id: user.id,
      salario: seeded.salario,
      valor_extra_base: seeded.valorExtraBase,
    });
    if (baseError) throw new Error(baseError.message);

    await supabase.from("gastos").delete().eq("user_id", user.id);
    await supabase.from("extras").delete().eq("user_id", user.id);

    const gastosRows = seeded.gastos.map((g) => ({
      user_id: user.id,
      descricao: g.descricao,
      valor: g.valor,
      data: g.data,
      categoria: g.categoria,
      status: g.status,
    }));
    const { error: gastosError } = await supabase.from("gastos").insert(gastosRows);
    if (gastosError) throw new Error(gastosError.message);
    await fetchData(user.id);
  };

  const updateSalario = async (valor: number) => {
    if (!user) return;
    const { error } = await supabase.from("finance_data").upsert({
      user_id: user.id,
      salario: valor,
      valor_extra_base: data?.valorExtraBase ?? 0,
    });
    if (error) throw new Error(error.message);
    await fetchData(user.id);
  };

  const updateValorExtraBase = async (valor: number) => {
    if (!user) return;
    const { error } = await supabase.from("finance_data").upsert({
      user_id: user.id,
      salario: data?.salario ?? 0,
      valor_extra_base: valor,
    });
    if (error) throw new Error(error.message);
    await fetchData(user.id);
  };

  const addGasto = async (payload: Omit<Gasto, "id">) => {
    if (!user) return;
    const { error } = await supabase.from("gastos").insert({
      user_id: user.id,
      descricao: payload.descricao,
      valor: payload.valor,
      data: payload.data,
      categoria: payload.categoria,
      status: payload.status,
    });
    if (error) throw new Error(error.message);
    await fetchData(user.id);
  };

  const updateGasto = async (id: string, payload: Omit<Gasto, "id">) => {
    if (!user) return;
    const { error } = await supabase
      .from("gastos")
      .update({
        descricao: payload.descricao,
        valor: payload.valor,
        data: payload.data,
        categoria: payload.categoria,
        status: payload.status,
      })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
    await fetchData(user.id);
  };

  const deleteGasto = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from("gastos").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
    await fetchData(user.id);
  };

  const addExtra = async (payload: Omit<Extra, "id">) => {
    if (!user) return;
    const { error } = await supabase.from("extras").insert({
      user_id: user.id,
      descricao: payload.descricao,
      valor: payload.valor,
      data: payload.data,
    });
    if (error) throw new Error(error.message);
    await fetchData(user.id);
  };

  const updateExtra = async (id: string, payload: Omit<Extra, "id">) => {
    if (!user) return;
    const { error } = await supabase
      .from("extras")
      .update({
        descricao: payload.descricao,
        valor: payload.valor,
        data: payload.data,
      })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw new Error(error.message);
    await fetchData(user.id);
  };

  const deleteExtra = async (id: string) => {
    if (!user) return;
    const { error } = await supabase.from("extras").delete().eq("id", id).eq("user_id", user.id);
    if (error) throw new Error(error.message);
    await fetchData(user.id);
  };

  const totals = useMemo(() => {
    const totalGastos = round2((data?.gastos ?? []).reduce((acc, g) => acc + g.valor, 0));
    const totalExtrasItens = round2((data?.extras ?? []).reduce((acc, e) => acc + e.valor, 0));
    const totalValorExtra = round2((data?.valorExtraBase ?? 0) + totalExtrasItens);
    const saldoRestante = round2((data?.salario ?? 0) - totalGastos);
    const saldoFinal = round2(saldoRestante + totalValorExtra);
    return { totalGastos, totalExtrasItens, totalValorExtra, saldoRestante, saldoFinal };
  }, [data]);

  const value = useMemo<FinanceContextType>(
    () => ({
      data,
      loading,
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
    [data, loading, totals],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
