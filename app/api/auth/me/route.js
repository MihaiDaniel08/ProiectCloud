import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { serialize } from 'cookie';

export async function GET(req) {
    try {
        const authToken = req.cookies.get('auth_token')?.value;

        if (!authToken) {
            return NextResponse.json(
                { message: 'Unauthorized, no token' },
                { status: 401 }
            );
        }

        const payload = await verifyToken(authToken);

        if (!payload) {
            const response = NextResponse.json(
                { message: 'Unauthorized, invalid token' },
                { status: 401 }
            );
            response.headers.append('Set-Cookie', serialize('auth_token', '', {
                httpOnly: true,
                expires: new Date(0),
                path: '/',
            }));
            return response;
        }
        return NextResponse.json(
            { user: { userId: payload.userId, name: payload.name, email: payload.email } },
            { status: 200 }
        );
    } catch (error) {
        console.error('Me Auth Check Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    // A logout endpoint basically
    const response = NextResponse.json({ message: 'Logged out' }, { status: 200 });
    response.headers.append('Set-Cookie', serialize('auth_token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    }));
    return response;
}
