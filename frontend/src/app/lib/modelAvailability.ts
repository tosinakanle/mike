import {
    SETTINGS_MODELS,
    type ModelOption,
} from "../components/assistant/ModelToggle";
import type { ApiKeyState } from "@/app/lib/mikeApi";

export type ModelProvider =
    | "omniroute"
    | "claude"
    | "gemini"
    | "openai"
    | "openrouter"
    | "vercel"
    | "opencode-go"
    | "ollama";

export function getModelProvider(modelId: string): ModelProvider | null {
    if (modelId === "auto" || modelId.startsWith("auto/")) return "omniroute";
    if (modelId.startsWith("ollama/")) return "ollama"; // dynamic, not in the static list
    if (modelId.startsWith("openrouter/")) return "openrouter";
    if (modelId.startsWith("vercel/")) return "vercel";
    if (modelId.startsWith("opencode-go/")) return "opencode-go";
    const model = SETTINGS_MODELS.find((m) => m.id === modelId);
    if (!model) return "omniroute";
    return modelGroupToProvider(model.group);
}

export function isModelAvailable(
    modelId: string,
    apiKeys: ApiKeyState,
): boolean {
    if (modelId === "auto" || modelId.startsWith("auto/")) return true;
    const provider = getModelProvider(modelId);
    if (!provider || provider === "omniroute") return true;
    return isProviderAvailable(provider, apiKeys);
}

export function isProviderAvailable(
    provider: ModelProvider,
    apiKeys: ApiKeyState,
): boolean {
    if (provider === "omniroute" || provider === "ollama") return true; // managed backend, ready
    return !!apiKeys[provider]?.configured;
}

export function providerLabel(provider: ModelProvider): string {
    if (provider === "omniroute") return "OmniRoute AI Gateway";
    if (provider === "claude") return "Anthropic (Claude)";
    if (provider === "openai") return "OpenAI";
    if (provider === "openrouter") return "OpenRouter";
    if (provider === "vercel") return "Vercel AI Gateway";
    if (provider === "opencode-go") return "OpenCode Go";
    if (provider === "ollama") return "Local (Ollama)";
    return "Google (Gemini)";
}

export function modelGroupToProvider(
    group: ModelOption["group"],
): ModelProvider {
    if (group === "Legal Intelligence" || group === "OmniRoute") return "omniroute";
    if (group === "Anthropic") return "claude";
    if (group === "OpenAI") return "openai";
    if (group === "OpenRouter") return "openrouter";
    if (group === "Vercel AI Gateway") return "vercel";
    if (group === "OpenCode Go") return "opencode-go";
    if (group === "Local") return "ollama";
    return "gemini";
}
