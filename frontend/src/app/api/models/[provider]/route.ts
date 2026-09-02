import { NextRequest, NextResponse } from "next/server";

const OMNIROUTE_BASE = process.env.OMNIROUTE_BASE_URL || "http://localhost:20128/v1";
const OMNIROUTE_KEY = process.env.OMNIROUTE_API_KEY || "sk-bd9e1c4cd67dc5b4-870f61-159e861e";

export async function GET(request: NextRequest, context: { params: Promise<{ provider: string }> }) {
    const { provider } = await context.params;

    try {
        const res = await fetch(`${OMNIROUTE_BASE}/models`, {
            headers: {
                Authorization: `Bearer ${OMNIROUTE_KEY}`,
            },
            cache: "no-store",
        });
        if (!res.ok) {
            return NextResponse.json({ models: [] });
        }
        const data = await res.json();
        const allModels = data.data || [];
        
        const filtered = allModels.map((m: any) => ({
            id: m.id,
            label: m.name || m.id,
            group: "Legal Intelligence",
        }));

        return NextResponse.json({ models: filtered });
    } catch {
        return NextResponse.json({ models: [] });
    }
}
