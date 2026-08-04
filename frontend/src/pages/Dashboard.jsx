import { useEffect, useState } from "react";
import { repository } from "../db/repository";
import { BalanceChart } from "../components/BalanceChart";
import { CategoryPieChart } from "../components/CategoryPieChart";
import { GoalProgressChart } from "../components/GoalProgressChart";
import { formatCurrencyCompact } from "../constants";

export function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    repository
      .getDashboardSummary()
      .then(setSummary)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <h1 className="page-title">Dashboard</h1>
        <p className="empty-state">Carregando...</p>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1 className="page-title">Dashboard</h1>
        <div className="error-banner">{error}</div>
      </>
    );
  }

  const { balance_summary, spending_by_category, goals } = summary;

  return (
    <>
      <h1 className="page-title">Dashboard</h1>

      <div className="card">
        <div className="stat-row">
          <div className="stat-tile">
            <div className="label">Entradas</div>
            <div className="value income">{formatCurrencyCompact(balance_summary.total_income)}</div>
          </div>
          <div className="stat-tile">
            <div className="label">Saídas</div>
            <div className="value expense">{formatCurrencyCompact(balance_summary.total_expense)}</div>
          </div>
          <div className="stat-tile">
            <div className="label">Saldo</div>
            <div className="value">{formatCurrencyCompact(balance_summary.balance)}</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Saldo ao longo do tempo</h2>
        <BalanceChart series={balance_summary.series} />
      </div>

      <div className="card">
        <h2>Gastos por categoria</h2>
        <CategoryPieChart data={spending_by_category} />
      </div>

      <div className="card">
        <h2>Progresso das metas</h2>
        <GoalProgressChart goals={goals} />
      </div>
    </>
  );
}
