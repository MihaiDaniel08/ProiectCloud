'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => {
                if (!res.ok) throw new Error('Unauthorized');
                return res.json();
            })
            .then(data => setUser(data.user))
            .catch(() => router.push('/login'));
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/auth/me', { method: 'POST' });
        router.refresh();
        router.push('/login');
    };

    if (!user) return <p className="p-8">Se incarca...</p>;

    return (
        <div className="min-h-screen bg-gray-50 text-black flex">
            <aside className="w-64 bg-gray-200 border-r border-gray-400 p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-4">Meniu Student</h2>
                <p className="mb-6 text-sm text-gray-700">Logat ca: {user.name}</p>

                <nav className="flex flex-col gap-2 flex-1">
                    <Link href="/dashboard" className={`p-2 border ${pathname === '/dashboard' ? 'bg-blue-200 border-blue-400' : 'bg-white border-gray-300'}`}>
                        Acasa
                    </Link>
                    <Link href="/dashboard/todos" className={`p-2 border ${pathname === '/dashboard/todos' ? 'bg-blue-200 border-blue-400' : 'bg-white border-gray-300'}`}>
                        Sarcini de studiu
                    </Link>
                    <Link href="/dashboard/pomodoro" className={`p-2 border ${pathname === '/dashboard/pomodoro' ? 'bg-blue-200 border-blue-400' : 'bg-white border-gray-300'}`}>
                        Timer Pomodoro
                    </Link>
                    <Link href="/dashboard/chat" className={`p-2 border ${pathname === '/dashboard/chat' ? 'bg-blue-200 border-blue-400' : 'bg-white border-gray-300'}`}>
                        Consilier AI
                    </Link>
                </nav>

                <button onClick={handleLogout} className="mt-auto bg-red-500 text-white p-2">
                    Deconectare
                </button>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
