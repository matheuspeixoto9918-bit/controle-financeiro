import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import FormGasto from "../components/FormGasto";
import Modal from "../components/Modal";
import { useFinance } from "../hooks/useFinance";
import { formatBRL, formatDate } from "../lib/format";
import type { Gasto } from "../types";

const Gastos = () => {
  const { data, addGasto, updateGasto, deleteGasto } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Gasto | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Gastos</h2>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          Novo gasto
        </button>
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
              <th className="p-2">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {(data?.gastos ?? []).map((g) => (
              <tr key={g.id} className="border-b">
                <td className="p-2">{g.descricao}</td>
                <td className="p-2 font-semibold text-rose-600">- {formatBRL(g.valor)}</td>
                <td className="p-2">{formatDate(g.data)}</td>
                <td className="p-2">{g.categoria}</td>
                <td className="p-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      g.status === "pago" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {g.status}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button className="btn-secondary" onClick={() => setEditing(g)}>
                      <Pencil size={16} />
                    </button>
                    <button className="btn-secondary" onClick={() => deleteGasto(g.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title="Novo gasto" onClose={() => setOpen(false)}>
        <FormGasto
          onSubmit={(payload) => {
            addGasto(payload);
            setOpen(false);
          }}
        />
      </Modal>
      <Modal open={!!editing} title="Editar gasto" onClose={() => setEditing(null)}>
        {editing ? (
          <FormGasto
            initial={editing}
            onSubmit={(payload) => {
              updateGasto(editing.id, payload);
              setEditing(null);
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
};

export default Gastos;
