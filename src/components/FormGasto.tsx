import { useState } from "react";
import type { Categoria, Gasto, StatusGasto } from "../types";
import { toInputDate } from "../lib/format";

const categorias: Categoria[] = [
  "Cartao/Fatura",
  "Internet",
  "Emprestimos",
  "Mercado",
  "Pessoal",
  "Contas fixas",
  "Outros",
];

interface Props {
  initial?: Omit<Gasto, "id">;
  onSubmit: (value: Omit<Gasto, "id">) => void;
}

const FormGasto = ({ initial, onSubmit }: Props) => {
  const [descricao, setDescricao] = useState(initial?.descricao ?? "");
  const [valor, setValor] = useState(initial?.valor?.toString() ?? "");
  const [data, setData] = useState(initial ? toInputDate(initial.data) : new Date().toISOString().slice(0, 10));
  const [categoria, setCategoria] = useState<Categoria>(initial?.categoria ?? "Outros");
  const [status, setStatus] = useState<StatusGasto>(initial?.status ?? "pendente");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(valor.replace(",", "."));
    if (!descricao.trim() || Number.isNaN(parsed) || parsed <= 0) return;
    onSubmit({
      descricao: descricao.trim(),
      valor: parsed,
      data: new Date(`${data}T12:00:00`).toISOString(),
      categoria,
      status,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input className="input" placeholder="Descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      <input className="input" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} />
      <input type="date" className="input" value={data} onChange={(e) => setData(e.target.value)} />
      <select className="input" value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)}>
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select className="input" value={status} onChange={(e) => setStatus(e.target.value as StatusGasto)}>
        <option value="pago">pago</option>
        <option value="pendente">pendente</option>
      </select>
      <button className="btn-primary w-full" type="submit">
        Salvar
      </button>
    </form>
  );
};

export default FormGasto;
