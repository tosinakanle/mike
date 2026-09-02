import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        omniroute: true,
        claude: true,
        gemini: true,
        openai: true,
        openrouter: true,
        vercel: true,
        "opencode-go": true,
        courtlistener: true,
        sources: {
            omniroute: "env",
            claude: "env",
            gemini: "env",
            openai: "env",
            openrouter: "env",
            vercel: "env",
            "opencode-go": "env",
            courtlistener: "env",
        },
    });
}
