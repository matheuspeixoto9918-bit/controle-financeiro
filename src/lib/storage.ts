import type { FinanceData, Session, User } from "../types";

const USERS_KEY = "cfp:users";
const SESSION_KEY = "cfp:session";
const FIN_KEY = (userId: string) => `cfp:finance:${userId}`;

const readJSON = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const storage = {
  getUsers(): User[] {
    return readJSON<User[]>(USERS_KEY, []);
  },
  saveUsers(users: User[]): void {
    writeJSON(USERS_KEY, users);
  },
  getSession(): Session | null {
    return readJSON<Session | null>(SESSION_KEY, null);
  },
  saveSession(session: Session): void {
    writeJSON(SESSION_KEY, session);
  },
  clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  },
  getFinance(userId: string): FinanceData | null {
    return readJSON<FinanceData | null>(FIN_KEY(userId), null);
  },
  saveFinance(userId: string, data: FinanceData): void {
    writeJSON(FIN_KEY(userId), data);
  },
  hasFinance(userId: string): boolean {
    return !!localStorage.getItem(FIN_KEY(userId));
  },
};
