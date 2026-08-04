import Dexie from "dexie";

export const db = new Dexie("financas");

db.version(1).stores({
  transactions: "++id, type, date, category",
  goals: "++id, deadline",
});
