import { HashRouter, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Goals } from "./pages/Goals";

function App() {
  return (
    <HashRouter>
      <NavBar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transacoes" element={<Transactions />} />
          <Route path="/metas" element={<Goals />} />
        </Routes>
      </main>
    </HashRouter>
  );
}

export default App;
