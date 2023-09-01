import crypto from "crypto";

import {buildMessage} from "../utils";

export async function GET() {
    const nonce = crypto.randomInt(111111, 999999)
    return {
        nonce,
        message: buildMessage(nonce),
    }
}