import { useState } from "react";
import { formatCurrency, formatDate } from "../constants";

function GoalCard({ goal, onContribute, onDelete }) {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleContribute() {
    if (!amount || Number(amount) <= 0) return;
    setSubmitting(true);
    try {
      await onContribute(goal.id, Number(amount));
      setAmount("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="goal-card">
      <div className="goal-header">
        <span className="goal-name">{goal.name}</span>
        {goal.deadline && <span className="goal-deadline">até {formatDate(goal.deadline)}</span>}
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${goal.progress_percent}%` }} />
      </div>
      <div className="goal-figures">
        <span>
          {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
        </span>
        <span>{goal.progress_percent.toFixed(0)}%</span>
      </div>
      <div className="goal-actions">
        <input
          type="number"
          inputMode="decimal"
          min="0.01"
          step="0.01"
          placeholder="Adicionar valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn-secondary" onClick={handleContribute} disabled={submitting}>
          Guardar
        </button>
        <button className="btn-danger" onClick={() => onDelete(goal.id)}>
          Excluir
        </button>
      </div>
    </div>
  );
}

export function GoalList({ goals, onContribute, onDelete }) {
  if (goals.length === 0) {
    return <p className="empty-state">Nenhuma meta cadastrada ainda.</p>;
  }

  return (
    <div>
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} onContribute={onContribute} onDelete={onDelete} />
      ))}
    </div>
  );
}
