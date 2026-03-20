"use client";

import React, { useState, useEffect } from "react";

interface Todo {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return `${yyyy}-${mm}-${dd} ${strTime}`;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("todos");
      if (stored) {
        setTodos(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Failed to parse todos from localStorage", err);
      setTodos([]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("todos", JSON.stringify(todos));
      } catch (err) {
        console.warn("Failed to save todos to localStorage", err);
      }
    }
  }, [todos, isLoaded]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setError("");

    const now = new Date();
    const formattedDate = formatDate(now);

    const newTodo: Todo = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      description: description.trim(),
      createdAt: formattedDate,
      updatedAt: formattedDate,
    };

    setTodos([newTodo, ...todos]);
    setTitle("");
    setDescription("");
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditError("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditError("");
  };

  const saveEditing = (id: string) => {
    if (!editTitle.trim()) {
      setEditError("Title is required.");
      return;
    }
    
    const now = new Date();
    const formattedDate = formatDate(now);

    setTodos(
      todos.map((t) =>
        t.id === id
          ? {
              ...t,
              title: editTitle.trim(),
              description: editDescription.trim(),
              updatedAt: formattedDate,
            }
          : t
      )
    );
    cancelEditing();
  };

  if (!isLoaded) return null; // Avoid hydration mismatch

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 rounded-xl border border-gray-700 shadow-2xl p-6 md:p-8 text-gray-100">
        <h1 className="text-3xl font-bold text-center mb-6 tracking-tight">Todo List</h1>

        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="mb-8 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Enter todo title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              className={`w-full bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
            />
            {error && <p className="text-red-400 text-sm mt-1.5 ml-1">{error}</p>}
          </div>

          <div>
            <textarea
              placeholder="Enter description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none h-24"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg px-4 py-3 transition-colors duration-200"
          >
            Add Todo
          </button>
        </form>

        {/* Todo List */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
          {todos.length === 0 ? (
            <p className="text-center text-gray-400 py-6">No todos yet.</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-5 flex flex-col gap-3 transition-colors hover:border-gray-600"
              >
                {editingId === todo.id ? (
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => {
                          setEditTitle(e.target.value);
                          if (editError) setEditError("");
                        }}
                        className={`w-full bg-gray-900 border ${editError ? 'border-red-500' : 'border-gray-600'} rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      {editError && <p className="text-red-400 text-xs mt-1.5 ml-1">{editError}</p>}
                    </div>
                    <div>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20 text-sm"
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEditing(todo.id)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-white break-words">{todo.title}</h3>
                      {todo.description && (
                        <p className="text-gray-300 mt-1.5 whitespace-pre-wrap text-sm break-words leading-relaxed">
                          {todo.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="text-xs text-gray-400 italic">Created: {todo.createdAt}</span>
                      <span className="text-xs text-gray-400 italic">Last updated: {todo.updatedAt}</span>
                    </div>
                    <div className="flex gap-2 justify-end mt-2">
                      <button
                        onClick={() => startEditing(todo)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
