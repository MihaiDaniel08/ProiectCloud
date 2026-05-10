'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        if (res.ok) {
            toast.success('Cont creat, acum te poti loga!');
            router.push('/login');
        } else {
            toast.error('Eroare');
        }
    };

    return (
        <div className="p-8 font-sans h-screen flex flex-col items-center">
            <div className="w-full max-w-md bg-gray-100 p-6 border border-gray-300 shadow-sm mt-12">
                <h2 className="text-xl font-bold mb-6 text-center">Inregistrare Cont Nou</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1">Nume:</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full border border-gray-400 p-2"
                        />
                    </div>

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

                    <button type="submit" className="w-full bg-green-600 text-white py-2 mt-4">
                        Creeaza Cont
                    </button>
                </form>

                <p className="mt-4 text-sm text-center">
                    Ai cont? <Link href="/login" className="text-blue-600 underline">Logare</Link>
                </p>
            </div>
        </div>
    );
}
