import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(req) {
    try {
        const token = req.cookies.get('auth_token')?.value;
        const user = token ? await verifyToken(token) : null;
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { messages } = await req.json();
        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ message: 'Invalid messages array' }, { status: 400 });
        }

        const apiKey = process.env.TOGETHER_API_KEY;
        if (!apiKey || apiKey === 'YOUR_TOGETHER_API_KEY_HERE') {
            return NextResponse.json({
                error: 'Api key not configured. Add TOGETHER_API_KEY in .env file.'
            }, { status: 500 });
        }

        const payload = {
            model: "Qwen/Qwen2.5-7B-Instruct-Turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an enthusiastic, concise, and helpful study advisor named "StudyTracker AI". 
You help students with their homework, study strategies, and give motivation. Keep answers concise, max 3 paragraphs. Respond in Romanian, addressing them as a friend. The student's name is ${user.name}.`
                },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 300,
        };

        const response = await fetch("https://api.together.xyz/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Together API Error:', errorData);
            return NextResponse.json({ message: 'Failed to fetch from Together AI API' }, { status: response.status });
        }

        const data = await response.json();
        const reply = data.choices[0]?.message || { content: "Scuze, nu am putut genera un răspuns." };

        return NextResponse.json({ reply }, { status: 200 });
    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}