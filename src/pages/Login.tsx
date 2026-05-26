import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFinance } from "../hooks/useFinance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const { loadSeedData } = useFinance();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold">Entrar</h1>
        <p className="mt-1 text-sm text-slate-500">Acesse sua conta</p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input className="input" placeholder="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button className="btn-primary w-full" type="submit">
            Entrar
          </button>
        </form>
        <button className="btn-secondary mt-3 w-full" onClick={loadSeedData}>
          Carregar dados de exemplo
        </button>
        <p className="mt-4 text-sm">
          Sem conta?{" "}
          <Link className="font-semibold text-emerald-700" to="/cadastro">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
