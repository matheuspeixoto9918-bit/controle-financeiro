import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Sidebar from "./components/Sidebar";
import SupabaseGuard from "./components/SupabaseGuard";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Gastos from "./pages/Gastos";
import Extras from "./pages/Extras";
import Historico from "./pages/Historico";
import Configuracoes from "./pages/Configuracoes";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen md:flex">
    <Sidebar />
    <main className="flex-1 p-4 md:p-6">{children}</main>
  </div>
);

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <SupabaseGuard>
      {!isAuthenticated ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <PrivateLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/gastos" element={<Gastos />} />
            <Route path="/extras" element={<Extras />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PrivateLayout>
      )}
    </SupabaseGuard>
  );
};

export default App;