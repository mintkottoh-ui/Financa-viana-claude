import { useState } from "react";

export function GoalForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("0");
  const [deadline, setDeadline] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!name || !targetAmount || Number(targetAmount) <= 0) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name,
        target_amount: Number(targetAmount),
        current_amount: Number(currentAmount || 0),
        deadline: deadline || null,
      });
      setName("");
      setTargetAmount("");
      setCurrentAmount("0");
      setDeadline("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="goal-name">Nome da meta</label>
        <input
          id="goal-name"
          type="text"
          placeholder="Ex: Viagem de férias"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="goal-target">Valor alvo (R$)</label>
        <input
          id="goal-target"
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
        />
      </div>

      <div className="form-row">
        <label htmlFor="goal-current">Valor já economizado (R$)</label>
        <input
          id="goal-current"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label htmlFor="goal-deadline">Prazo (opcional)</label>
        <input
          id="goal-deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? "Salvando..." : "Criar meta"}
      </button>
    </form>
  );
}
