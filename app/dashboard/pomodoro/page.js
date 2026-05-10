'use client';
import { useState, useEffect } from 'react';

export default function Pomodoro() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            alert('Timpul a expirat!');
        }
        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const formatTime = (secs) => `${Math.floor(secs / 60)}:${(secs % 60).toString().padStart(2, '0')}`;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Pomodoro Timer</h1>

            <div className="bg-white p-8 border border-gray-300 text-center w-64 mx-auto mt-10">
                <div className="text-4xl font-bold mb-6">{formatTime(timeLeft)}</div>

                <div className="flex gap-2 justify-center">
                    <button onClick={() => setIsRunning(!isRunning)} className="bg-green-600 text-white px-4 py-2">
                        {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button onClick={() => { setIsRunning(false); setTimeLeft(25 * 60); }} className="bg-gray-400 text-black px-4 py-2">
                        Reset
                    </button>
                </div>
                <div className="mt-4 flex gap-2 justify-center text-sm">
                    <button onClick={() => { setIsRunning(false); setTimeLeft(25 * 60) }} className="underline">Studiu (25m)</button>
                    <button onClick={() => { setIsRunning(false); setTimeLeft(5 * 60) }} className="underline text-blue-600">Pauza (5m)</button>
                </div>
            </div>
        </div>
    );
}
