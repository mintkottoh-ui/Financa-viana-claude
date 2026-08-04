import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CATEGORY_COLORS, formatCurrency } from "../constants";

const MAX_SLICES = 7;

function collapseToTop(data) {
  if (data.length <= MAX_SLICES) return data;
  const sorted = [...data].sort((a, b) => b.total - a.total);
  const top = sorted.slice(0, MAX_SLICES);
  const rest = sorted.slice(MAX_SLICES);
  const otherTotal = rest.reduce((sum, item) => sum + item.total, 0);
  return [...top, { category: "Outros", total: otherTotal }];
}

export function CategoryPieChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="empty-state">Nenhum gasto registrado ainda.</p>;
  }

  const chartData = collapseToTop(data);

  return (
    <div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="total"
            nameKey="category"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.category} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} stroke="var(--surface-1)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [formatCurrency(value), name]}
            contentStyle={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              color: "var(--text-primary)",
              fontSize: 13,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="legend">
        {chartData.map((entry, index) => (
          <div className="legend-item" key={entry.category}>
            <span
              className="legend-swatch"
              style={{ background: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
            />
            <span>
              {entry.category} · {formatCurrency(entry.total)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
