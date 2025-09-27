import "./App.css"; // import your CSS file here
import React, { useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, signOut} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./components/Login";

// ---- Todo type & helper ----
export type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

const STORAGE_KEY = "ugomma_todos_v1";
function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

// ---- Main App ----
export default function App(): JSX.Element {
  const [user, setUser] = useState<User | null>(null);

  // Watch login state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsub;
  }, []);

  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Todo[]) : [];
    } catch {
      return [];
    }
  });

    

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Persist todos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);


    const filtered = useMemo(() => {
    let list = todos;
    if (filter === "active") list = list.filter((t) => !t.completed);
    if (filter === "completed") list = list.filter((t) => t.completed);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.text.toLowerCase().includes(q));
    }
    return list;
  }, [todos, filter, query]);


  // Show login page if not logged in
  if (!user) {
    return <Login/>;
  }

  // --- Todos logic ---

  // --- Todo actions ---
  const addTodo = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const next: Todo = { id: uid(), text: trimmed, completed: false, createdAt: Date.now() };
    setTodos((s) => [next, ...s]);
  };

  const toggle = (id: string) =>
    setTodos((s) => s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  const remove = (id: string) => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    setTodos((s) => s.filter((t) => t.id !== id));
  };

  const startEdit = (t: Todo) => {
    setEditingId(t.id);
    setEditText(t.text);
  };

  const commitEdit = (id: string) => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setTodos((s) => s.filter((t) => t.id !== id));
    } else {
      setTodos((s) => s.map((t) => (t.id === id ? { ...t, text: trimmed } : t)));
    }
    setEditingId(null);
    setEditText("");
  };

  const clearCompleted = () => {
    if (!window.confirm("Remove all completed tasks?")) return;
    setTodos((s) => s.filter((t) => !t.completed));
  };

  const activeCount = todos.filter((t) => !t.completed).length;



  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-top">
            <h1>Todos</h1>
            <div className="date">{new Date().toLocaleDateString()}</div>
            <button onClick={() => signOut(auth)}>Logout</button>
          </div>

          <AddTodo onAdd={addTodo} />

          <div className="filters">
            <input
              className="search"
              placeholder="Search todos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="filter-buttons">
              <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
                All
              </FilterButton>
              <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>
                Active
              </FilterButton>
              <FilterButton active={filter === "completed"} onClick={() => setFilter("completed")}>
                Completed
              </FilterButton>
            </div>
            <div className="active-count">{activeCount} active</div>
          </div>
        </header>

        <main>
          <div className="todos-box">
            <ul className="todo-list">
              {filtered.length === 0 ? (
                <li className="empty">No tasks found! — Add something to get started</li>
              ) : (
                filtered.map((t) => (
                  <li key={t.id} className="todo-item">
                    <label className="todo-label">
                      <input type="checkbox" checked={t.completed} onChange={() => toggle(t.id)} />
                      <div className="todo-text">
                        {editingId === t.id ? (
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              commitEdit(t.id);
                            }}
                          >
                            <input
                              autoFocus
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onBlur={() => commitEdit(t.id)}
                              className="edit-input"
                            />
                          </form>
                        ) : (
                          <div className="todo-content">
                            <div className={t.completed ? "completed" : ""}>{t.text}</div>
                            <div className="actions">
                              <button onClick={() => startEdit(t)}>Edit</button>
                              <button className="delete" onClick={() => remove(t.id)}>
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  </li>
                ))
              )}
            </ul>

            <div className="bulk-actions">
              <div>{todos.length} total</div>
              <div>
                <button onClick={() => setTodos((s) => s.map((t) => ({ ...t, completed: true })))}>Mark all done</button>
                <button onClick={() => setTodos((s) => s.map((t) => ({ ...t, completed: false })))}>Unmark all</button>
                <button className="delete" onClick={clearCompleted}>
                  Clear completed
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ---- AddTodo + FilterButton ----
function AddTodo({ onAdd }: { onAdd: (text: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(value);
        setValue("");
      }}
      className="add-form"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What do you want to do today?"
      />
      <button type="submit">Add</button>
    </form>
  );
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className={`filter-button ${active ? "active" : ""}`}>
      {children}
    </button>
  );
}
