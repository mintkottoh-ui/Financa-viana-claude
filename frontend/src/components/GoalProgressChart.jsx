import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "../constants";

export function GoalProgressChart({ goals }) {
  if (!goals || goals.length === 0) {
    return <p className="empty-state">Nenhuma meta cadastrada ainda.</p>;
  }

  const data = goals.map((g) => ({
    id: g.id,
    name: g.name,
    percent: g.progress_percent,
    current: g.current_amount,
    target: g.target_amount,
  }));

  const height = Math.max(60 * data.length, 120);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
          stroke="var(--axis)"
        />
        <Tooltip
          formatter={(value, name, props) => [
            `${formatCurrency(props.payload.current)} de ${formatCurrency(props.payload.target)} (${value.toFixed(0)}%)`,
            "Progresso",
          ]}
          contentStyle={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            color: "var(--text-primary)",
            fontSize: 13,
          }}
        />
        <Bar dataKey="percent" fill="var(--series-blue)" radius={[0, 4, 4, 0]} barSize={18}>
          {data.map((entry) => (
            <Cell key={entry.id} fill={entry.percent >= 100 ? "var(--income)" : "var(--series-blue)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
