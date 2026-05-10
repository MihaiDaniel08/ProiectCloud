'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (res.ok) {
            toast.success('Logat cu succes');
            router.refresh();
            router.push('/dashboard');
        } else {
            toast.error('Date incorecte');
        }
    };

    return (
        <div className="p-8 font-sans h-screen flex flex-col items-center">
            <div className="w-full max-w-md bg-gray-100 p-6 border border-gray-300 shadow-sm mt-12">
                <h2 className="text-xl font-bold mb-6 text-center">Logare Cont</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Email:</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full border border-gray-400 p-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Parola:</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full border border-gray-400 p-2"
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 mt-4">
                        Trimite
                    </button>
                </form>

                <p className="mt-4 text-sm text-center">
                    Nu ai cont? <Link href="/register" className="text-blue-600 underline">Inregistrare</Link>
                </p>
            </div>
        </div>
    );
}