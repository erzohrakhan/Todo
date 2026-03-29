import React, { useState, useEffect } from "react";
import "./App.css";

const API = "/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchTodos = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    setDescription("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await fetch(`${API}/${todo.todo_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });
    fetchTodos();
  };

  const startEdit = (todo) => {
    setEditId(todo.todo_id);
    setEditText(todo.description);
  };

  const saveEdit = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: editText }),
    });
    setEditId(null);
    setEditText("");
    fetchTodos();
  };

  return (
    <div className="app">
      <h1>PERN Todo List</h1>

      <form onSubmit={addTodo} className="add-form">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a new todo..."
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.todo_id} className={todo.completed ? "completed" : ""}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo)}
            />

            {editId === todo.todo_id ? (
              <div className="edit-row">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.todo_id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <span className="todo-text">{todo.description}</span>
                <div className="actions">
                  <button onClick={() => startEdit(todo)}>Edit</button>
                  <button
                    className="delete"
                    onClick={() => deleteTodo(todo.todo_id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="empty">No todos yet. Add one!</p>}
    </div>
  );
}

export default App;
