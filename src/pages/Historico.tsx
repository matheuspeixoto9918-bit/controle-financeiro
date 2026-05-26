import { useMemo, useState } from "react";
import { formatDate, formatBRL } from "../lib/format";
import { useFinance } from "../hooks/useFinance";
import type { Categoria, StatusGasto } from "../types";

const categorias: Array<Categoria | "todas"> = [
  "todas",
  "Cartao/Fatura",
  "Internet",
  "Emprestimos",
  "Mercado",
  "Pessoal",
  "Contas fixas",
  "Outros",
];

const Historico = () => {
  const { data } = useFinance();
  const [mes, setMes] = useState("");
  const [categoria, setCategoria] = useState<Categoria | "todas">("todas");
  const [status, setStatus] = useState<StatusGasto | "todos">("todos");

  const filtered = useMemo(() => {
    return (data?.gastos ?? []).filter((g) => {
      const m = g.data.slice(0, 7);
      const byMonth = mes ? m === mes : true;
      const byCat = categoria === "todas" ? true : g.categoria === categoria;
      const byStatus = status === "todos" ? true : g.status === status;
      return byMonth && byCat && byStatus;
    });
  }, [data?.gastos, mes, categoria, status]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Historico mensal</h2>
      <div className="card grid gap-3 md:grid-cols-3">
        <input type="month" className="input" value={mes} onChange={(e) => setMes(e.target.value)} />
        <select className="input" value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria | "todas")}>
          {categorias.map((c) => (
            <option value={c} key={c}>
              {c}
            </option>
          ))}
        </select>
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value as StatusGasto | "todos")}>
          <option value="todos">todos</option>
          <option value="pago">pago</option>
          <option value="pendente">pendente</option>
        </select>
      </div>

      <div className="card overflow-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-2">Descricao</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Data</th>
              <th className="p-2">Categoria</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="border-b">
                <td className="p-2">{g.descricao}</td>
                <td className="p-2 text-rose-600">- {formatBRL(g.valor)}</td>
                <td className="p-2">{formatDate(g.data)}</td>
                <td className="p-2">{g.categoria}</td>
                <td className="p-2">{g.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Historico;
