import { useState } from "react";
import { CATEGORIES } from "../constants";

const today = () => new Date().toISOString().slice(0, 10);

export function TransactionForm({ onSubmit }) {
  const [type, setType] = useState("saida");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today());
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setSubmitting(true);
    try {
      await onSubmit({
        type,
        amount: Number(amount),
        date,
        category,
        description,
      });
      setAmount("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="type-toggle">
        <button
          type="button"
          data-type="entrada"
          className={type === "entrada" ? "active" : ""}
          onClick={() => setType("entrada")}
        >
          Entrada
        </button>
        <button
          type="button"
          data-type="saida"
          className={type === "saida" ? "active" : ""}
          onClick={() => setType("saida")}
        >
          Saída
        </button>
      </div>

      <div className="form-row">
        <label htmlFor="amount">Valor (R$)</label>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="date">Data</label>
        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className="form-row">
        <label htmlFor="category">Categoria</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <label htmlFor="description">Descrição (opcional)</label>
        <input
          id="description"
          type="text"
          placeholder="Ex: Supermercado do mês"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Salvando..." : "Adicionar transação"}
      </button>
    </form>
  );
}
