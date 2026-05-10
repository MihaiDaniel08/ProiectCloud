import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

async function getUserFromReq(req) {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return null;
    return await verifyToken(token);
}

export async function GET(req) {
    try {
        const user = await getUserFromReq(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const todosCollection = await getCollection('todos');
        const todos = await todosCollection.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({ todos }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching todos' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const user = await getUserFromReq(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { title } = await req.json();
        if (!title) return NextResponse.json({ message: 'Title required' }, { status: 400 });

        const todosCollection = await getCollection('todos');
        const newTodo = {
            userId: user.userId,
            title,
            completed: false,
            createdAt: new Date()
        };

        const result = await todosCollection.insertOne(newTodo);
        return NextResponse.json({ todo: { ...newTodo, _id: result.insertedId } }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating todo' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const user = await getUserFromReq(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const { id, completed } = await req.json();

        const todosCollection = await getCollection('todos');
        await todosCollection.updateOne(
            { _id: new ObjectId(id), userId: user.userId },
            { $set: { completed: !!completed } }
        );

        return NextResponse.json({ message: 'Updated' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating todo' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const user = await getUserFromReq(req);
        if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        const todosCollection = await getCollection('todos');
        await todosCollection.deleteOne({ _id: new ObjectId(id), userId: user.userId });

        return NextResponse.json({ message: 'Deleted' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting todo' }, { status: 500 });
    }
}
