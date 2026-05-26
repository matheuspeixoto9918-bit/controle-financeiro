import { Link, useLocation } from "react-router-dom";
import { ChartPie, CircleDollarSign, ClipboardList, LayoutDashboard, Settings } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/gastos", label: "Gastos", icon: ClipboardList },
  { to: "/extras", label: "Valores Extras", icon: CircleDollarSign },
  { to: "/historico", label: "Historico", icon: ChartPie },
  { to: "/configuracoes", label: "Configuracoes", icon: Settings },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  return (
    <aside className="w-full border-b border-slate-200 bg-white p-3 md:h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-4">
        <h1 className="text-lg font-bold text-emerald-700">Controle Financeiro</h1>
        <p className="truncate text-xs text-slate-500">{user?.email}</p>
      </div>
      <nav className="grid grid-cols-2 gap-2 md:grid-cols-1">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                active ? "bg-emerald-100 text-emerald-700" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <button onClick={logout} className="btn-secondary mt-4 w-full">
        Sair
      </button>
    </aside>
  );
};

export default Sidebar;
