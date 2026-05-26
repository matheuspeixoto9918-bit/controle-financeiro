import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatBRL = (value: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const formatDate = (isoDate: string): string => {
  try {
    return format(parseISO(isoDate), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return isoDate;
  }
};

export const toInputDate = (isoDate: string): string => isoDate.slice(0, 10);
