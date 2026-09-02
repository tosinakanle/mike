import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        user: {
            id: "lex-counsel-01",
            email: "counsel@lexnigeriana.com",
            pendingEmail: null,
            createdWithGoogle: false,
        },
    });
}
