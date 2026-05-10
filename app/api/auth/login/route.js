import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { verifyPassword, signToken } from '@/lib/auth';
import { serialize } from 'cookie';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const usersCollection = await getCollection('users');

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const tokenPayload = { userId: user._id.toString(), email: user.email, name: user.name };
        const token = await signToken(tokenPayload);

        const serialized = serialize('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        const response = NextResponse.json(
            { message: 'Logged in successfully', user: { name: user.name, email: user.email } },
            { status: 200 }
        );
        response.headers.append('Set-Cookie', serialized);

        return response;
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
