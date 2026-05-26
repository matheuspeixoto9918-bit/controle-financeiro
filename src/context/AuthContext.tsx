import { createContext, useEffect, useMemo, useState } from "react";
import { seedFinanceData } from "../data/seed";
import { supabase } from "../lib/supabase";
import type { User } from "../types";

interface RegisterPayload {
  email: string;
  password: string;
  loadExampleData?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const hydrate = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setUser(null);
        return;
      }
      setUser({
        id: data.user.id,
        email: data.user.email ?? "",
        createdAt: data.user.created_at ?? new Date().toISOString(),
      });
    };
    void hydrate();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const authUser = session?.user;
      if (!authUser) {
        setUser(null);
        return;
      }
      setUser({
        id: authUser.id,
        email: authUser.email ?? "",
        createdAt: authUser.created_at ?? new Date().toISOString(),
      });
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error || !data.user) {
      throw new Error(error?.message ?? "Falha ao entrar.");
    }
    setUser({
      id: data.user.id,
      email: data.user.email ?? "",
      createdAt: data.user.created_at ?? new Date().toISOString(),
    });
  };

  const register = async ({ email, password, loadExampleData }: RegisterPayload): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error || !data.user) {
      throw new Error(error?.message ?? "Falha ao cadastrar.");
    }
    setUser({
      id: data.user.id,
      email: data.user.email ?? "",
      createdAt: data.user.created_at ?? new Date().toISOString(),
    });

    if (loadExampleData) {
      const seeded = seedFinanceData();
      const { error: baseError } = await supabase.from("finance_data").upsert({
        user_id: data.user.id,
        salario: seeded.salario,
        valor_extra_base: seeded.valorExtraBase,
      });
      if (baseError) throw new Error(baseError.message);

      await supabase.from("gastos").delete().eq("user_id", data.user.id);
      await supabase.from("extras").delete().eq("user_id", data.user.id);

      const gastosRows = seeded.gastos.map((g) => ({
        user_id: data.user.id,
        descricao: g.descricao,
        valor: g.valor,
        data: g.data,
        categoria: g.categoria,
        status: g.status,
      }));
      const { error: gastosError } = await supabase.from("gastos").insert(gastosRows);
      if (gastosError) throw new Error(gastosError.message);
    }
  };

  const logout = (): void => {
    void supabase.auth.signOut();
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
