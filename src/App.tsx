import { useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { Ledger } from "./components/Ledger";
import { LootTracker } from "./components/LootTracker";
import { Settings } from "./components/Settings";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useSRD } from "./hooks/useSRD";
import { exportJson, parseImport } from "./utils/data";
import { DEFAULT_STATE } from "./utils/defaults";
import type { CampaignState, TabId, Transaction, Item } from "./types";
import { ThemeToggle } from "./components/ui/ThemeToggle";

export default function App() {
  const [state, setState] = useLocalStorage<CampaignState>(
    "loot-tracker-v2",
    DEFAULT_STATE,
  );
  // After
  const [tab, setTab] = useLocalStorage<TabId>("active-tab", "dashboard");
  // After
  const systemDefault: "light" | "dark" =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const [theme, setTheme] = useLocalStorage<"light" | "dark">(
    "theme",
    systemDefault,
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }
  const {
    items: srdItems,
    status: srdStatus,
    statusText,
    fetchItemDetail,
  } = useSRD();

  // ── State helpers ────────────────────────────────────────────────

  function patch(update: Partial<CampaignState>) {
    setState((prev) => ({ ...prev, ...update }));
  }

  // Transactions
  function addTx(tx: Transaction) {
    patch({ transactions: [...state.transactions, tx] });
  }
  function updateTx(tx: Transaction) {
    patch({
      transactions: state.transactions.map((t) => (t.id === tx.id ? tx : t)),
    });
  }
  function deleteTx(id: string) {
    patch({ transactions: state.transactions.filter((t) => t.id !== id) });
  }

  // Items
  function addItem(item: Item) {
    patch({ items: [...state.items, item] });
  }
  function updateItem(item: Item) {
    patch({ items: state.items.map((i) => (i.id === item.id ? item : i)) });
  }
  function deleteItem(id: string) {
    patch({ items: state.items.filter((i) => i.id !== id) });
  }
  function updateQty(id: string, qty: number) {
    patch({
      items: state.items.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, qty) } : i,
      ),
    });
  }

  // Import
  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = parseImport(ev.target?.result as string);
        setState(imported);
        setTab("dashboard");
      } catch {
        alert(
          "Could not parse JSON file — make sure it is a valid loot tracker export.",
        );
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "transactions", label: "Ledger" },
    { id: "items", label: "Loot" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="app">
      {/* Top bar */}
      <div className="topbar">
        <div className="topbar-left">
          <span style={{ fontSize: 18 }}>⚔</span>
          <h1>{state.campaign}</h1>
        </div>
        <div className="topbar-actions">
          {statusText && <span className="srd-status">{statusText}</span>}
          <label className="btn sm" style={{ cursor: "pointer" }}>
            Import
            <input
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleImport}
            />
          </label>
          <button className="btn sm primary" onClick={() => exportJson(state)}>
            Export JSON
          </button>
          <ThemeToggle mode={theme} onToggle={toggleTheme} />
        </div>
      </div>

      {/* Nav */}
      <div className="nav">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "active" : ""}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="content">
        {tab === "dashboard" && <Dashboard state={state} />}
        {tab === "transactions" && (
          <Ledger
            state={state}
            onAdd={addTx}
            onUpdate={updateTx}
            onDelete={deleteTx}
          />
        )}
        {tab === "items" && (
          <LootTracker
            state={state}
            srdItems={srdItems}
            srdReady={srdStatus === "ready"}
            fetchItemDetail={fetchItemDetail}
            onAdd={addItem}
            onUpdate={updateItem}
            onDelete={deleteItem}
            onQtyChange={updateQty}
          />
        )}
        {tab === "settings" && (
          <Settings
            state={state}
            onUpdate={patch}
            onReset={() => setState({ ...DEFAULT_STATE })}
          />
        )}
      </div>
    </div>
  );
}
