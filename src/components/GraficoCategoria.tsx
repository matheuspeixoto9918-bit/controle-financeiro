import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts";
import type { Gasto } from "../types";
import { formatBRL } from "../lib/format";

const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#64748b"];

const GraficoCategoria = ({ gastos }: { gastos: Gasto[] }) => {
  const grouped = Object.entries(
    gastos.reduce<Record<string, number>>((acc, g) => {
      acc[g.categoria] = (acc[g.categoria] ?? 0) + g.valor;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }));

  return (
    <div className="card h-80">
      <h3 className="mb-3 text-sm font-semibold text-slate-600">Gastos por categoria</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={grouped} dataKey="value" nameKey="name" outerRadius={90} label>
            {grouped.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatBRL(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoCategoria;
