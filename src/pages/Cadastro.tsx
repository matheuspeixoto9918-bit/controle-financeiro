import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFinance } from "../hooks/useFinance";

const Cadastro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const { loadSeedData } = useFinance();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Informe um e-mail válido.");
    if (password.length < 6) return setError("A senha deve ter no mínimo 6 caracteres.");
    if (password !== confirm) return setError("As senhas não coincidem.");
    try {
      await register({ email, password });
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold">Cadastro</h1>
        <p className="mt-1 text-sm text-slate-500">Crie sua conta</p>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <input className="input" placeholder="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input
            className="input"
            placeholder="Confirmar senha"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button className="btn-primary w-full" type="submit">
            Criar conta
          </button>
        </form>
        <button
          className="btn-secondary mt-3 w-full"
          onClick={() => {
            loadSeedData();
          }}
        >
          Carregar dados de exemplo
        </button>
        <p className="mt-4 text-sm">
          Já tem conta?{" "}
          <Link className="font-semibold text-emerald-700" to="/login">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;
