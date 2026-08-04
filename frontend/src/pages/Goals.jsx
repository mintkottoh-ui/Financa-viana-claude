import { useEffect, useState } from "react";
import { api } from "../api/client";
import { GoalForm } from "../components/GoalForm";
import { GoalList } from "../components/GoalList";

export function Goals() {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await api.listGoals();
      setGoals(data);
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
      await api.createGoal(payload);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleContribute(id, amount) {
    setError("");
    try {
      await api.contributeToGoal(id, amount);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await api.deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <h1 className="page-title">Metas de economia</h1>
      {error && <div className="error-banner">{error}</div>}

      <div className="card">
        <h2>Nova meta</h2>
        <GoalForm onSubmit={handleCreate} />
      </div>

      <div className="card">
        <h2>Suas metas</h2>
        {loading ? (
          <p className="empty-state">Carregando...</p>
        ) : (
          <GoalList goals={goals} onContribute={handleContribute} onDelete={handleDelete} />
        )}
      </div>
    </>
  );
}
