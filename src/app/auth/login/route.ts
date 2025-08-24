import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Login route handler' });
}

export async function POST() {
  return NextResponse.json({ message: 'Handle login POST request' });
}
