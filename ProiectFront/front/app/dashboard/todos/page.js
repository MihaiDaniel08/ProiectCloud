'use client';
import { useState, useEffect } from 'react';

export default function TodosPage() {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetch('/api/todos').then(res => res.json()).then(data => setTodos(data.todos || []));
    }, []);

    const handleAddTodo = async (e) => {
        e.preventDefault();
        if (!newTask) return;
        const res = await fetch('/api/todos', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: newTask }),
        });
        const data = await res.json();
        setTodos([data.todo, ...todos]);
        setNewTask('');
    };

    const toggleTodo = async (id, currentStatus) => {
        setTodos(todos.map(t => t._id === id ? { ...t, completed: !currentStatus } : t));
        await fetch('/api/todos', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, completed: !currentStatus }) });
    };

    const deleteTodo = async (id) => {
        setTodos(todos.filter(t => t._id !== id));
        await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Lista mea de sarcini</h1>

            <form onSubmit={handleAddTodo} className="mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Adauga sarcina noua..."
                    className="border border-gray-400 p-2 w-64 mr-2"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2">Adauga</button>
            </form>

            <div className="bg-white p-4 border border-gray-300">
                {todos.map((todo) => (
                    <div key={todo._id} className="flex justify-between items-center mb-2 p-2 border-b">
                        <div>
                            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo._id, todo.completed)} className="mr-2" />
                            <span className={todo.completed ? 'line-through text-gray-500' : ''}>{todo.title}</span>
                        </div>
                        <button onClick={() => deleteTodo(todo._id)} className="bg-red-500 text-white px-2 py-1 text-sm">Sterge</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
