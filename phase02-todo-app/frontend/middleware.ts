import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// TODO: Add proper middleware after backend is set up
// Currently using a pass-through middleware to satisfy Next.js requirements
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
