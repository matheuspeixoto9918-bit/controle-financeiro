import { createContext, useEffect, useMemo, useState } from "react";
import { comparePassword, hashPassword } from "../lib/auth";
import { storage } from "../lib/storage";
import type { User } from "../types";

interface RegisterPayload {
  email: string;
  password: string;
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
    const session = storage.getSession();
    if (!session) return;
    const existing = storage.getUsers().find((u) => u.id === session.userId) ?? null;
    setUser(existing);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const normalized = email.trim().toLowerCase();
    const existing = storage.getUsers().find((u) => u.email === normalized);
    if (!existing) throw new Error("Usuário não encontrado.");
    if (!comparePassword(password, existing.passwordHash)) {
      throw new Error("Senha inválida.");
    }
    storage.saveSession({ userId: existing.id });
    setUser(existing);
  };

  const register = async ({ email, password }: RegisterPayload): Promise<void> => {
    const normalized = email.trim().toLowerCase();
    const users = storage.getUsers();
    if (users.some((u) => u.email === normalized)) {
      throw new Error("Este e-mail já está cadastrado.");
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      email: normalized,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    const updated = [...users, newUser];
    storage.saveUsers(updated);
    storage.saveSession({ userId: newUser.id });
    setUser(newUser);
  };

  const logout = (): void => {
    storage.clearSession();
    setUser(null);
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
