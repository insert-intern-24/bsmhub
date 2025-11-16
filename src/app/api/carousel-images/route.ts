import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg']);

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'card', 'Carousel');
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((name) => ALLOWED_EXTENSIONS.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const images = files.map((name) => `/card/Carousel/${name}`);
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] }, { status: 200 });
  }
}


