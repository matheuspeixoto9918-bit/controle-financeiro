import Card from "../components/Card";
import GraficoCategoria from "../components/GraficoCategoria";
import GraficoComparativo from "../components/GraficoComparativo";
import { useFinance } from "../hooks/useFinance";
import { formatBRL } from "../lib/format";

const Dashboard = () => {
  const { data, totalGastos, totalValorExtra, saldoRestante, saldoFinal } = useFinance();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Dashboard</h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Card title="Salario" value={formatBRL(data?.salario ?? 0)} positive />
        <Card title="Valor Extra" value={formatBRL(totalValorExtra)} positive />
        <Card title="Total de Gastos" value={formatBRL(totalGastos)} negative />
        <Card title="Saldo Restante" value={formatBRL(saldoRestante)} positive={saldoRestante >= 0} negative={saldoRestante < 0} />
        <Card title="Saldo Final com Extra" value={formatBRL(saldoFinal)} positive={saldoFinal >= 0} negative={saldoFinal < 0} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <GraficoCategoria gastos={data?.gastos ?? []} />
        <GraficoComparativo salario={data?.salario ?? 0} gastos={totalGastos} saldo={saldoFinal} />
      </div>
    </div>
  );
};

export default Dashboard;
