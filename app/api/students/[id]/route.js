import { NextResponse } from 'next/server';

const BASE = 'http://localhost:5000/api/students';

export async function PUT(req, { params }) {
    try {
        const body = await req.json();
        const res = await fetch(`${BASE}/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const res = await fetch(`${BASE}/${params.id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}