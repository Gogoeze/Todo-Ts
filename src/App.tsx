// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
// import React, { useEffect, useMemo, useState } from "react";
// import "tailwindcss";

// export type Todo = {
//   id: string;
//   text: string;
//   completed: boolean;
//   createdAt: number;
// };

// const STORAGE_KEY = "ugomma_todos_v1";
// function uid() {
//   return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
// }

// export default function App(): JSX.Element {
//   const [todos, setTodos] = useState<Todo[]>(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       if (!raw) return [];
//       return JSON.parse(raw) as Todo[];
//     } catch (e) {
//       console.warn("Failed to load todos from localStorage", e);
//       return [];
//     }
//   });

//   const [query, setQuery] = useState("");
//   const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editText, setEditText] = useState("");

//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
//     } catch (e) {
//       console.warn("Failed to save todos", e);
//     }
//   }, [todos]);

//   const addTodo = (text: string) => {
//     const trimmed = text.trim();
//     if (!trimmed) return;
//     const next: Todo = { id: uid(), text: trimmed, completed: false, createdAt: Date.now() };
//     setTodos((s) => [next, ...s]);
//   };

//   const toggle = (id: string) => setTodos((s) => s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

//   const remove = (id: string) => {
//     const ok = confirm("Delete this task? This cannot be undone.");
//     if (!ok) return;
//     setTodos((s) => s.filter((t) => t.id !== id));
//   };

//   const startEdit = (t: Todo) => {
//     setEditingId(t.id);
//     setEditText(t.text);
//   };

//   const commitEdit = (id: string) => {
//     const trimmed = editText.trim();
//     if (!trimmed) {
//       // If empty after edit, remove the todo
//       setTodos((s) => s.filter((t) => t.id !== id));
//     } else {
//       setTodos((s) => s.map((t) => (t.id === id ? { ...t, text: trimmed } : t)));
//     }
//     setEditingId(null);
//     setEditText("");
//   };

//   const clearCompleted = () => {
//     const ok = confirm("Remove all completed tasks?");
//     if (!ok) return;
//     setTodos((s) => s.filter((t) => !t.completed));
//   };

//   const activeCount = todos.filter((t) => !t.completed).length;

//   const filtered = useMemo(() => {
//     let list = todos;
//     if (filter === "active") list = list.filter((t) => !t.completed);
//     if (filter === "completed") list = list.filter((t) => t.completed);
//     if (query.trim()) {
//       const q = query.toLowerCase();
//       list = list.filter((t) => t.text.toLowerCase().includes(q));
//     }
//     return list;
//   }, [todos, filter, query]);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-6">
//       <div className="w-full max-w-2xl ">
//         <header className="mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <h1 className="text-3xl font-extrabold tracking-tight ml-4">Todos</h1>
//             <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
//           </div>

//           <AddTodo onAdd={addTodo} />

//           <div className="mt-4 flex gap-2 items-center">
//             <div className="flex items-center gap-2 bg-white shadow-sm rounded-full px-3 py-2">
//               <input
//                 className="outline-none text-sm w-48"
//                 placeholder="Search todos..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//               />
//               <div className="h-5 w-px bg-gray-200" />
//               <div className="flex gap-1">
//                 <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All</FilterButton>
//                 <FilterButton active={filter === "active"} onClick={() => setFilter("active")}>Active</FilterButton>
//                 <FilterButton active={filter === "completed"} onClick={() => setFilter("completed")}>Completed</FilterButton>
//               </div>
//             </div>

//             <div className="ml-auto text-sm text-gray-600">{activeCount} active</div>
//           </div>
//         </header>

//         <main>
//           <div className="bg-white shadow-md rounded-2xl overflow-hidden">
//             <ul className="divide-y">
//               {filtered.length === 0 ? (
//                 <li className="p-8 text-center text-gray-400">No tasks found — add something to get started ✨</li>
//               ) : (
//                 filtered.map((t) => (
//                   <li key={t.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
//                     <label className="flex items-center gap-3 w-full">
//                       <input
//                         type="checkbox"
//                         className="h-5 w-5 rounded-md"
//                         checked={t.completed}
//                         onChange={() => toggle(t.id)}
//                         aria-label={`Toggle ${t.text}`}
//                       />

//                       <div className="flex-1 min-w-0">
//                         {editingId === t.id ? (
//                           <form
//                             onSubmit={(e) => {
//                               e.preventDefault();
//                               commitEdit(t.id);
//                             }}
//                           >
//                             <input
//                               autoFocus
//                               value={editText}
//                               onChange={(e) => setEditText(e.target.value)}
//                               onBlur={() => commitEdit(t.id)}
//                               className="w-full bg-gray-50 rounded-md px-3 py-2 outline-none"
//                             />
//                           </form>
//                         ) : (
//                           <div className="flex items-center justify-between gap-4">
//                             <div className={`truncate ${t.completed ? "line-through text-gray-400" : "text-gray-800"}`}>{t.text}</div>
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => startEdit(t)}
//                                 className="text-sm px-2 py-1 rounded-md hover:bg-gray-100"
//                                 aria-label={`Edit ${t.text}`}
//                               >
//                                 Edit
//                               </button>

//                               <button
//                                 onClick={() => remove(t.id)}
//                                 className="text-sm px-2 py-1 rounded-md text-red-600 hover:bg-red-50"
//                                 aria-label={`Delete ${t.text}`}
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </label>
//                   </li>
//                 ))
//               )}
//             </ul>

//             <div className="p-4 flex items-center gap-3 justify-between">
//               <div className="text-sm text-gray-600">{todos.length} total</div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setTodos((s) => s.map((t) => ({ ...t, completed: true })))}
//                   className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
//                 >
//                   Mark all done
//                 </button>
//                 <button
//                   onClick={() => setTodos((s) => s.map((t) => ({ ...t, completed: false })))}
//                   className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
//                 >
//                   Unmark all
//                 </button>
//                 <button onClick={clearCompleted} className="text-sm px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100">
//                   Clear completed
//                 </button>
//               </div>
//             </div>
//           </div>

//           <footer className="mt-6 text-center text-sm text-gray-500">Designed with care — TypeScript + React + Tailwind</footer>
//         </main>
//       </div>
//     </div>
//   );
// }

// // ---------- Small components ----------

// function AddTodo({ onAdd }: { onAdd: (text: string) => void }) {
//   const [value, setValue] = useState("");

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         onAdd(value);
//         setValue("");
//       }}
//       className="flex items-center gap-3 bg-white shadow rounded-xl p-3"
//     >
//       <input
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         placeholder="What do you want to do today?"
//         className="flex-1 px-3 py-2 rounded-md outline-none bg-gray-50"
//       />
//       <button
//         type="submit"
//         className="px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:opacity-90"
//         aria-label="Add todo"
//       >
//         Add
//       </button>
//     </form>
//   );
// }

// function FilterButton({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`px-3 py-1 rounded-full text-sm ${active ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"}`}
//     >
//       {children}
//     </button>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import "./App.css"; // import your CSS file here

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

export default function App(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Todo[];
    } catch {
      return [];
    }
  });

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

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

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div className="header-top">
            <h1>Todos</h1>
            <div className="date">{new Date().toLocaleDateString()}</div>
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
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggle(t.id)}
                      />

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
                <button onClick={() => setTodos((s) => s.map((t) => ({ ...t, completed: true })))}>
                  Mark all done
                </button>
                <button onClick={() => setTodos((s) => s.map((t) => ({ ...t, completed: false })))}>
                  Unmark all
                </button>
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
