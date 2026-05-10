'use client';
import { useState } from 'react';

export default function ChatbotPage() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Salut! Cu ce te ajut la studiu?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input || loading) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: newMessages }),
        });

        const data = await res.json();
        if (res.ok) {
            setMessages([...newMessages, { role: 'assistant', content: data.reply.content }]);
        } else {
            alert('Eroare conectare chat');
        }
        setLoading(false);
    };

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Consilier AI</h1>

            <div className="flex-1 bg-white border border-gray-300 p-4 overflow-y-auto mb-4 flex flex-col gap-2">
                {messages.map((msg, i) => (
                    <div key={i} className={`p-2 border ${msg.role === 'user' ? 'bg-blue-100 self-end ml-12' : 'bg-gray-100 self-start mr-12'}`}>
                        <span className="font-bold">{msg.role === 'user' ? 'Eu: ' : 'Consilier: '}</span>
                        <span>{msg.content}</span>
                    </div>
                ))}
                {loading && <div className="p-2 bg-gray-100 self-start">Se gandeste...</div>}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Scrie un mesaj..."
                    disabled={loading}
                    className="flex-1 border border-gray-400 p-2"
                />
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2">
                    Trimite
                </button>
            </form>
        </div>
    );
}
