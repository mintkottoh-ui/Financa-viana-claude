import { formatCurrency, formatDate } from "../constants";

export function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return <p className="empty-state">Nenhuma transação registrada ainda.</p>;
  }

  return (
    <div>
      {transactions.map((t) => (
        <div className="transaction-item" key={t.id}>
          <div className="transaction-info">
            <span className="transaction-category">{t.category}</span>
            <span className="transaction-meta">
              {formatDate(t.date)}
              {t.description ? ` · ${t.description}` : ""}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              className="transaction-amount"
              style={{ color: t.type === "entrada" ? "var(--income)" : "var(--expense)" }}
            >
              {t.type === "entrada" ? "+" : "-"} {formatCurrency(t.amount)}
            </span>
            <button className="btn-danger" onClick={() => onDelete(t.id)} aria-label="Excluir transação">
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
