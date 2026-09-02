import { NextResponse } from "next/server";

export async function GET() {
    const baseUrl = process.env.OMNIROUTE_BASE_URL || "http://localhost:20128/v1";
    const apiKey = process.env.OMNIROUTE_API_KEY || "";
    
    let isConnected = false;
    let modelCount = 0;
    let latencyMs = 0;
    
    try {
        const start = Date.now();
        const res = await fetch(`${baseUrl}/models`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
            signal: AbortSignal.timeout(3000),
        });
        latencyMs = Date.now() - start;
        if (res.ok) {
            const data = await res.json();
            isConnected = true;
            modelCount = Array.isArray(data.data) ? data.data.length : (Array.isArray(data) ? data.length : 0);
        }
    } catch {
        isConnected = false;
    }
    
    return NextResponse.json({
        connected: isConnected,
        baseUrl,
        modelCount,
        latencyMs,
        dashboardUrl: "http://localhost:20128/dashboard",
        activeKeyMasked: apiKey ? `${apiKey.slice(0, 10)}••••••••${apiKey.slice(-6)}` : "Not configured",
        routingStrategy: "OmniRoute Smart Auto-Router with dynamic failover & token compression",
    });
}
