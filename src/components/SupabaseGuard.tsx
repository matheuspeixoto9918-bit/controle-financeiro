const SupabaseGuard = ({ children }: { children: React.ReactNode }) => {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (url && key) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card w-full max-w-2xl space-y-3">
        <h1 className="text-2xl font-bold text-rose-600">Supabase não configurado</h1>
        <p className="text-sm text-slate-600">
          Defina as variáveis de ambiente para habilitar login em múltiplos dispositivos:
        </p>
        <pre className="overflow-x-auto rounded-xl bg-slate-100 p-3 text-xs">
{`VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON`}
        </pre>
        <p className="text-sm text-slate-600">
          Depois rode o SQL de <code>src/data/supabase.sql</code> no SQL Editor do Supabase.
        </p>
      </div>
    </div>
  );
};

export default SupabaseGuard;
