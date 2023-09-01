import { NextResponse } from 'next/server'

import {verifyTokenAndGetUser} from "./app/api/auth/utils";

import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
    const authorization = req.headers.get('authorization');
    if (!authorization || !authorization.includes('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401})
    }
    try {
        const token = authorization.replace('Bearer ', '')
        req.user = await verifyTokenAndGetUser(token)
    } catch (e) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401})
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/api/check']
};