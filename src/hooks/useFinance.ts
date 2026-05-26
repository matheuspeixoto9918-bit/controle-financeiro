import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";

export const useFinance = () => {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance deve ser usado dentro de FinanceProvider.");
  return ctx;
};
