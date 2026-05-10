import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <nav className="bg-blue-600 text-white p-4">
                <h1>Aplicatie Study Tracker</h1>
            </nav>

            <main className="p-8">
                <h2 className="text-2xl font-bold mb-4">Proiect Cloud Computing</h2>
                <p className="mb-4">
                    Aceasta este o aplicatie pentru studiu. Contine un timer Pomodoro, o lista de sarcini si un consilier AI.
                </p>

                <div className="flex gap-4 mt-6">
                    <Link href="/login" className="bg-gray-200 px-4 py-2 border border-gray-400 text-black">
                        Login
                    </Link>
                    <Link href="/register" className="bg-gray-200 px-4 py-2 border border-gray-400 text-black">
                        Inregistrare
                    </Link>
                </div>
            </main>
        </div>
    );
}