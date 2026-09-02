"use client";

import { useEffect, useState } from "react";
import { ExternalLink, CheckCircle2, XCircle, RefreshCw, Cpu, ShieldCheck } from "lucide-react";

interface OmniRouteStatus {
    connected: boolean;
    baseUrl: string;
    modelCount: number;
    latencyMs: number;
    dashboardUrl: string;
    activeKeyMasked: string;
    routingStrategy: string;
}

export function OmniRouteGatewayCard() {
    const [status, setStatus] = useState<OmniRouteStatus | null>(null);
    const [loading, setLoading] = useState(true);

    const checkStatus = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/settings/omniroute");
            if (res.ok) {
                const data = await res.json();
                setStatus(data);
            }
        } catch {
            setStatus(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    return (
        <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/40 via-white to-neutral-50/60 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-start gap-3.5">
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-700/20">
                        <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-semibold text-gray-900">
                                OmniRoute AI Gateway
                            </h3>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                {loading ? "Probing..." : status?.connected ? `Connected (${status.latencyMs}ms)` : "Offline"}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Superadmin backend managing frontier model routing, automated failover, and token compression.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={checkStatus}
                        disabled={loading}
                        aria-label="Refresh gateway status"
                        className="flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-emerald-600" : ""}`} />
                    </button>
                    <a
                        href={status?.dashboardUrl || "http://localhost:20128/dashboard"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-black transition-colors shadow-sm"
                    >
                        <span>Open Superadmin Dashboard</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                    <span className="text-[11px] font-medium text-gray-400 block uppercase tracking-wider">Gateway Endpoint</span>
                    <span className="text-xs font-mono font-medium text-gray-800 mt-1 block truncate">
                        {status?.baseUrl || "http://localhost:20128/v1"}
                    </span>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                    <span className="text-[11px] font-medium text-gray-400 block uppercase tracking-wider">Gateway Key</span>
                    <span className="text-xs font-mono font-medium text-gray-800 mt-1 block truncate">
                        {status?.activeKeyMasked || "sk-••••••••••••"}
                    </span>
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-2xs">
                    <span className="text-[11px] font-medium text-gray-400 block uppercase tracking-wider">Available Models</span>
                    <span className="text-xs font-medium text-gray-800 mt-1 flex items-center gap-1">
                        <span className="font-semibold text-emerald-600">{status?.modelCount || 0}</span> models cataloged
                    </span>
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50/80 px-3 py-2 text-xs text-gray-600 border border-gray-100">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                    OmniRoute acts as the superadmin provider infrastructure for LexNigeriana AI. Provider credentials, custom combos, and quotas are managed via the OmniRoute Superadmin dashboard.
                </span>
            </div>
        </div>
    );
}
