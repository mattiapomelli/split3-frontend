import crypto from "crypto";

import {NextResponse} from "next/server";

import {buildMessage} from "../utils";

export async function GET() {
    const nonce = crypto.randomInt(111111, 999999)
    return NextResponse.json({
        nonce,
        message: buildMessage(nonce),
    })
}