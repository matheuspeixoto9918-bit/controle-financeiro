import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import FormExtra from "../components/FormExtra";
import Modal from "../components/Modal";
import { useFinance } from "../hooks/useFinance";
import { formatBRL, formatDate } from "../lib/format";
import type { Extra } from "../types";

const Extras = () => {
  const { data, addExtra, updateExtra, deleteExtra } = useFinance();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Extra | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Valores Extras</h2>
        <button className="btn-primary" onClick={() => setOpen(true)}>
          Novo valor extra
        </button>
      </div>
      <div className="card overflow-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="p-2">Descricao</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Data</th>
              <th className="p-2">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {(data?.extras ?? []).map((e) => (
              <tr key={e.id} className="border-b">
                <td className="p-2">{e.descricao}</td>
                <td className="p-2 font-semibold text-emerald-600">{formatBRL(e.valor)}</td>
                <td className="p-2">{formatDate(e.data)}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button className="btn-secondary" onClick={() => setEditing(e)}>
                      <Pencil size={16} />
                    </button>
                    <button className="btn-secondary" onClick={() => deleteExtra(e.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title="Novo valor extra" onClose={() => setOpen(false)}>
        <FormExtra
          onSubmit={(payload) => {
            addExtra(payload);
            setOpen(false);
          }}
        />
      </Modal>

      <Modal open={!!editing} title="Editar valor extra" onClose={() => setEditing(null)}>
        {editing ? (
          <FormExtra
            initial={editing}
            onSubmit={(payload) => {
              updateExtra(editing.id, payload);
              setEditing(null);
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
};

export default Extras;
