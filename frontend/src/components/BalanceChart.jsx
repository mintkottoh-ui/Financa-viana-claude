import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatDate } from "../constants";

export function BalanceChart({ series }) {
  if (!series || series.length === 0) {
    return <p className="empty-state">Sem dados suficientes para o gráfico.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={series} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <CartesianGrid stroke="var(--gridline)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 11, fill: "var(--text-muted)" }}
          stroke="var(--axis)"
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--text-muted)" }}
          stroke="var(--axis)"
          tickFormatter={(v) => formatCurrency(v).replace("R$", "").trim()}
          width={56}
        />
        <Tooltip
          formatter={(value, name) => [formatCurrency(value), name]}
          labelFormatter={formatDate}
          contentStyle={{
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            color: "var(--text-primary)",
            fontSize: 13,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "var(--text-secondary)" }} />
        <Bar dataKey="income" name="Entradas" fill="var(--income)" radius={[3, 3, 0, 0]} barSize={10} />
        <Bar dataKey="expense" name="Saídas" fill="var(--expense)" radius={[3, 3, 0, 0]} barSize={10} />
        <Line
          type="monotone"
          dataKey="balance"
          name="Saldo acumulado"
          stroke="var(--series-blue)"
          strokeWidth={2}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
