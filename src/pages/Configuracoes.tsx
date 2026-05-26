import { useEffect, useState } from "react";
import { useFinance } from "../hooks/useFinance";
import { formatBRL } from "../lib/format";

const Configuracoes = () => {
  const { data, updateSalario, updateValorExtraBase, loadSeedData } = useFinance();
  const [salario, setSalario] = useState("");
  const [extra, setExtra] = useState("");

  useEffect(() => {
    setSalario(String(data?.salario ?? 0));
    setExtra(String(data?.valorExtraBase ?? 0));
  }, [data?.salario, data?.valorExtraBase]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Configuracoes</h2>
      <div className="card space-y-3">
        <label className="text-sm text-slate-600">Salario mensal</label>
        <input className="input" value={salario} onChange={(e) => setSalario(e.target.value)} />
        <button
          className="btn-primary"
          onClick={() => {
            const v = Number(salario.replace(",", "."));
            if (!Number.isNaN(v)) updateSalario(v);
          }}
        >
          Salvar salario
        </button>
      </div>
      <div className="card space-y-3">
        <label className="text-sm text-slate-600">Valor extra base</label>
        <input className="input" value={extra} onChange={(e) => setExtra(e.target.value)} />
        <button
          className="btn-primary"
          onClick={() => {
            const v = Number(extra.replace(",", "."));
            if (!Number.isNaN(v)) updateValorExtraBase(v);
          }}
        >
          Salvar valor extra
        </button>
      </div>
      <div className="card">
        <p className="text-sm text-slate-500">Valores atuais</p>
        <p className="mt-2 text-sm">Salario: {formatBRL(data?.salario ?? 0)}</p>
        <p className="text-sm">Valor extra base: {formatBRL(data?.valorExtraBase ?? 0)}</p>
        <button className="btn-secondary mt-3" onClick={loadSeedData}>
          Recarregar dados de exemplo
        </button>
      </div>
    </div>
  );
};

export default Configuracoes;
