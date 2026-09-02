import { NextResponse } from "next/server";

const OMNIROUTE_BASE = process.env.OMNIROUTE_BASE_URL || "http://localhost:20128/v1";
const OMNIROUTE_KEY = process.env.OMNIROUTE_API_KEY || "sk-bd9e1c4cd67dc5b4-870f61-159e861e";

export async function GET() {
    try {
        const res = await fetch(`${OMNIROUTE_BASE}/models`, {
            headers: {
                Authorization: `Bearer ${OMNIROUTE_KEY}`,
            },
            cache: "no-store",
        });
        if (!res.ok) {
            return NextResponse.json({ models: [{ id: "auto", label: "Auto (Optimal Legal AI)" }] });
        }
        const data = await res.json();
        const models = (data.data || []).map((m: any) => ({
            id: m.id,
            label: m.name || m.id,
        }));
        return NextResponse.json({ models: [{ id: "auto", label: "Auto (Optimal Legal AI)" }, ...models] });
    } catch {
        return NextResponse.json({ models: [{ id: "auto", label: "Auto (Optimal Legal AI)" }] });
    }
}
