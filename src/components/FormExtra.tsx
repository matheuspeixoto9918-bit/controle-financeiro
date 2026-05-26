import { useState } from "react";
import type { Extra } from "../types";
import { toInputDate } from "../lib/format";

interface Props {
  initial?: Omit<Extra, "id">;
  onSubmit: (value: Omit<Extra, "id">) => void;
}

const FormExtra = ({ initial, onSubmit }: Props) => {
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");
  const [valor, setValor] = useState(initial?.valor?.toString() ?? "");
  const [data, setData] = useState(initial ? toInputDate(initial.data) : new Date().toISOString().slice(0, 10));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(valor.replace(",", "."));
    if (!descricao.trim() || Number.isNaN(parsed) || parsed <= 0) return;
    onSubmit({
      descricao: descricao.trim(),
      valor: parsed,
      data: new Date(`${data}T12:00:00`).toISOString(),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input className="input" placeholder="Descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      <input className="input" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} />
      <input type="date" className="input" value={data} onChange={(e) => setData(e.target.value)} />
      <button className="btn-primary w-full" type="submit">
        Salvar
      </button>
    </form>
  );
};

export default FormExtra;
