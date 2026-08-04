import { useEffect, useState } from "react";
import { repository } from "../db/repository";
import { TransactionForm } from "../components/TransactionForm";
import { TransactionList } from "../components/TransactionList";

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await repository.listTransactions({ limit: 200 });
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload) {
    setError("");
    try {
      await repository.createTransaction(payload);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await repository.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1 className="page-title">Transações</h1>
      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <h2>Nova transação</h2>
        <TransactionForm onSubmit={handleCreate} />
      </div>

      <div className="card">
        <h2>Histórico</h2>
        {loading ? (
          <p className="empty-state">Carregando...</p>
        ) : (
          <TransactionList transactions={transactions} onDelete={handleDelete} />
        )}
      </div>
    </>
  );
}
