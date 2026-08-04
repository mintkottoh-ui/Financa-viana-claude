import { useEffect, useRef, useState } from "react";
import { repository } from "../db/repository";
import { formatCurrencyCompact } from "../constants";

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function Backup() {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  async function loadStats() {
    const summary = await repository.getDashboardSummary();
    const transactions = await repository.listTransactions({ limit: 100000 });
    setStats({
      transactionCount: transactions.length,
      goalCount: summary.goals.length,
      balance: summary.balance_summary.balance,
    });
  }

  useEffect(() => {
    loadStats();
  }, []);

  async function handleExport() {
    const data = await repository.exportAll();
    const today = new Date().toISOString().slice(0, 10);
    downloadJson(data, `financas-backup-${today}.json`);
    setMessage({ type: "success", text: "Backup exportado com sucesso." });
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const confirmed = window.confirm(
      "Importar este backup vai substituir todos os dados atuais neste aparelho. Deseja continuar?"
    );
    if (!confirmed) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await repository.importAll(data);
      await loadStats();
      setMessage({ type: "success", text: "Backup importado com sucesso." });
    } catch (err) {
      setMessage({ type: "error", text: `Falha ao importar: ${err.message}` });
    }
  }

  return (
    <>
      <h1 className="page-title">Backup</h1>

      {message && (
        <div className={message.type === "error" ? "error-banner" : "success-banner"}>{message.text}</div>
      )}

      <div className="card">
        <h2>Seus dados neste aparelho</h2>
        {stats ? (
          <div className="stat-row">
            <div className="stat-tile">
              <div className="label">Transações</div>
              <div className="value">{stats.transactionCount}</div>
            </div>
            <div className="stat-tile">
              <div className="label">Metas</div>
              <div className="value">{stats.goalCount}</div>
            </div>
            <div className="stat-tile">
              <div className="label">Saldo</div>
              <div className="value">{formatCurrencyCompact(stats.balance)}</div>
            </div>
          </div>
        ) : (
          <p className="empty-state">Carregando...</p>
        )}
      </div>

      <div className="card">
        <h2>Exportar backup</h2>
        <p className="hint-text">
          Baixa um arquivo .json com todas as suas transações e metas. Guarde-o em um lugar seguro (ex: Google
          Drive, e-mail) para não perder os dados se trocar de celular ou desinstalar o app.
        </p>
        <button className="btn-primary" onClick={handleExport}>
          Exportar backup
        </button>
      </div>

      <div className="card">
        <h2>Importar backup</h2>
        <p className="hint-text">
          Restaura os dados a partir de um arquivo .json exportado anteriormente.{" "}
          <strong>Isso substitui todos os dados atuais neste aparelho.</strong>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <button className="btn-secondary" onClick={handleImportClick}>
          Importar backup
        </button>
      </div>

      <div className="card">
        <h2>Onde os dados ficam guardados</h2>
        <p className="hint-text">
          Este app funciona 100% no seu celular: os dados são salvos localmente no navegador (não existe servidor
          por trás). Isso significa que eles não são sincronizados entre aparelhos e podem ser apagados se você
          limpar os dados do navegador — por isso o backup acima é recomendado periodicamente.
        </p>
      </div>
    </>
  );
}
