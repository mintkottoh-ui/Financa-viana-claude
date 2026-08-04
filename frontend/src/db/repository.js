import { db } from "./index";

function goalProgressPercent(goal) {
  if (!goal.target_amount || goal.target_amount <= 0) return 0;
  return Math.round(Math.min(goal.current_amount / goal.target_amount, 1) * 10000) / 100;
}

function withProgress(goal) {
  return { ...goal, progress_percent: goalProgressPercent(goal) };
}

function sortTransactions(list) {
  return [...list].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return b.id - a.id;
  });
}

function sortGoalsByDeadline(list) {
  return [...list].sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0;
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return a.deadline < b.deadline ? -1 : a.deadline > b.deadline ? 1 : 0;
  });
}

export const repository = {
  // ---------- Transactions ----------
  async listTransactions({ type, category, start_date, end_date, skip = 0, limit = 200 } = {}) {
    let list = await db.transactions.toArray();
    if (type) list = list.filter((t) => t.type === type);
    if (category) list = list.filter((t) => t.category === category);
    if (start_date) list = list.filter((t) => t.date >= start_date);
    if (end_date) list = list.filter((t) => t.date <= end_date);
    return sortTransactions(list).slice(skip, skip + limit);
  },

  async createTransaction(data) {
    const record = { ...data, description: data.description ?? "", created_at: new Date().toISOString() };
    const id = await db.transactions.add(record);
    return { ...record, id };
  },

  async updateTransaction(id, data) {
    await db.transactions.update(id, data);
    return db.transactions.get(id);
  },

  async deleteTransaction(id) {
    await db.transactions.delete(id);
  },

  // ---------- Goals ----------
  async listGoals() {
    const goals = await db.goals.toArray();
    return sortGoalsByDeadline(goals).map(withProgress);
  },

  async createGoal(data) {
    const record = {
      ...data,
      current_amount: data.current_amount ?? 0,
      deadline: data.deadline || null,
      created_at: new Date().toISOString(),
    };
    const id = await db.goals.add(record);
    return withProgress({ ...record, id });
  },

  async updateGoal(id, data) {
    await db.goals.update(id, data);
    const goal = await db.goals.get(id);
    return withProgress(goal);
  },

  async contributeToGoal(id, amount) {
    const goal = await db.goals.get(id);
    const current_amount = (goal?.current_amount ?? 0) + amount;
    await db.goals.update(id, { current_amount });
    return withProgress({ ...goal, current_amount });
  },

  async deleteGoal(id) {
    await db.goals.delete(id);
  },

  // ---------- Dashboard ----------
  async getDashboardSummary({ start_date, end_date } = {}) {
    let transactions = await db.transactions.toArray();
    if (start_date) transactions = transactions.filter((t) => t.date >= start_date);
    if (end_date) transactions = transactions.filter((t) => t.date <= end_date);

    const totalsByDay = new Map();
    let total_income = 0;
    let total_expense = 0;

    for (const t of transactions) {
      const day = totalsByDay.get(t.date) ?? { income: 0, expense: 0 };
      if (t.type === "entrada") {
        day.income += t.amount;
        total_income += t.amount;
      } else {
        day.expense += t.amount;
        total_expense += t.amount;
      }
      totalsByDay.set(t.date, day);
    }

    const series = [];
    let running_balance = 0;
    for (const day of [...totalsByDay.keys()].sort()) {
      const { income, expense } = totalsByDay.get(day);
      running_balance += income - expense;
      series.push({ date: day, income, expense, balance: running_balance });
    }

    const spendingByCategory = new Map();
    for (const t of transactions) {
      if (t.type !== "saida") continue;
      spendingByCategory.set(t.category, (spendingByCategory.get(t.category) ?? 0) + t.amount);
    }
    const spending_by_category = [...spendingByCategory.entries()]
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);

    const goals = await this.listGoals();

    return {
      balance_summary: { total_income, total_expense, balance: total_income - total_expense, series },
      spending_by_category,
      goals,
    };
  },

  // ---------- Backup ----------
  async exportAll() {
    const [transactions, goals] = await Promise.all([db.transactions.toArray(), db.goals.toArray()]);
    return {
      app: "financas-viana",
      version: 1,
      exported_at: new Date().toISOString(),
      transactions,
      goals,
    };
  },

  async importAll(data) {
    if (!data || !Array.isArray(data.transactions) || !Array.isArray(data.goals)) {
      throw new Error("Arquivo de backup inválido");
    }
    await db.transaction("rw", db.transactions, db.goals, async () => {
      await db.transactions.clear();
      await db.goals.clear();
      await db.transactions.bulkAdd(data.transactions);
      await db.goals.bulkAdd(data.goals);
    });
  },
};
