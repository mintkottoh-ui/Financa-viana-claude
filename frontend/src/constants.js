export const CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Salário",
  "Investimentos",
  "Outros",
];

export const CATEGORY_COLORS = [
  "var(--series-blue)",
  "var(--series-orange)",
  "var(--series-aqua)",
  "var(--series-yellow)",
  "var(--series-magenta)",
  "var(--series-green)",
  "var(--series-violet)",
  "var(--series-red)",
];

export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value ?? 0);
}

export function formatCurrencyCompact(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}
