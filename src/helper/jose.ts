import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";


const {
    SECRET_KEY = "SECRET_KEY",
} = process.env

export async function encodeUserId(userId: string) {
    const token = await new SignJWT({})
        .setProtectedHeader({ alg: 'HS256' })
        .setJti(userId)
        .setIssuedAt()
        .setExpirationTime('7200d')
        .sign(new TextEncoder().encode(SECRET_KEY))
    return token;
}


export async function decodeUserId(token: string): Promise<string | undefined> {
    try {
        const verified = await jwtVerify(
            token ?? "",
            new TextEncoder().encode(SECRET_KEY)
        )
        return verified.payload?.jti;
    } catch (err) {
        console.log(err);
        return undefined;
    }
    
}

export async function decodeUserIdFromReq(req: NextRequest) {
    const token = await decodeUserId(req.headers.get("x-access-token") ?? "");
    return token;
}

export async function testJose() {
    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    const userId = "test";
    const token = await encodeUserId(userId);
    const decoded = await decodeUserId(token);

    console.log(decoded, userId);
}