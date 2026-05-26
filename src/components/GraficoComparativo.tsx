import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatBRL } from "../lib/format";

interface Props {
  salario: number;
  gastos: number;
  saldo: number;
}

const GraficoComparativo = ({ salario, gastos, saldo }: Props) => {
  const data = [
    { name: "Salario", valor: salario },
    { name: "Gastos", valor: gastos },
    { name: "Saldo", valor: saldo },
  ];
  return (
    <div className="card h-80">
      <h3 className="mb-3 text-sm font-semibold text-slate-600">Comparativo</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(v: number) => formatBRL(v)} />
          <Bar dataKey="valor" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoComparativo;
