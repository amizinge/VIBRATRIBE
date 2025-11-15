import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const body = formData.get('body');

  if (!body) {
    return NextResponse.json({ error: 'Body required' }, { status: 400 });
  }

  return NextResponse.json({
    id: crypto.randomUUID(),
    body,
    media: formData.get('media') ? 'uploaded://mock' : null
  });
}
