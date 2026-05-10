import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { hashPassword } from '@/lib/auth';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const usersCollection = await getCollection('users');

        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);
        const result = await usersCollection.insertOne({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        });

        return NextResponse.json(
            { message: 'User created successfully', userId: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
