import { NextResponse } from 'next/server';

const API = 'http://localhost:5000/api/students';

export async function GET() {
    try {
        const res = await fetch(API);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}