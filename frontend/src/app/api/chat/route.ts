import { NextRequest, NextResponse } from "next/server";
import { getStoredChats, saveStoredChat, type StoredChat } from "@/app/lib/localStore";

const OMNIROUTE_BASE = process.env.OMNIROUTE_BASE_URL || "http://localhost:20128/v1";
const OMNIROUTE_KEY = process.env.OMNIROUTE_API_KEY || "sk-bd9e1c4cd67dc5b4-870f61-159e861e";

const SYSTEM_PROMPT = `You are LexNigeriana AI, an advanced Nigerian Legal Intelligence Assistant.
You possess deep expertise in Nigerian Jurisprudence, statutory frameworks, procedural law, and judicial precedents.

Core Directives:
1. Nigerian Law Default Rule: UNLESS OTHERWISE EXPRESSLY INDICATED, ALL ENQUIRIES RELATE TO NIGERIAN LAW. Every legal problem, query, term of art, statutory interpretation, procedural question, or dispute analysis MUST automatically be evaluated and resolved under Nigerian law, statutes, and judicial authorities.
2. Constitutional Primacy: The Constitution of the Federal Republic of Nigeria 1999 (as amended) is the supreme law. Any law inconsistent with its provisions is void to the extent of the inconsistency (Sections 1(1) and 1(3)).
3. Statutory Mastery: Cite and interpret the governing Nigerian statutes directly (e.g., Companies and Allied Matters Act (CAMA) 2020, Evidence Act 2011 (as amended 2023), Administration of Criminal Justice Act (ACJA) 2015, Land Use Act 1978, Arbitration and Mediation Act 2023, Criminal Code Act, Penal Code Act, Labour Act, Trade Marks Act).
4. Judicial Precedents & Stare Decisis: Anchor conclusions in binding Nigerian Supreme Court and Court of Appeal precedents with accurate legal citations (NWLR, LPELR, SCNJ, FWLR).
5. Procedural Precision: Apply relevant civil/criminal procedure rules (Federal High Court Rules, High Court Rules of Lagos/Abuja/States, Court of Appeal Rules, Supreme Court Rules).
6. Professional Decorum: Deliver rigorous, polished legal analysis tailored for legal practitioners, corporate counsel, judges, and scholars.`;

export async function GET() {
    const stored = getStoredChats();
    const chats = stored.map((c) => ({
        id: c.id,
        project_id: null,
        user_id: "lex-counsel-01",
        title: c.title,
        model: c.model || "auto",
        reasoning_level: "high",
        created_at: c.created_at,
    }));
    return NextResponse.json(chats);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages = [], model = "auto", reasoning = "high", chat_id } = body;
        const chatId = chat_id || crypto.randomUUID();

        // Format OpenAI-compatible messages for OmniRoute
        const formattedMessages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map((m: any) => {
                let text = m.content || "";
                if (m.files && Array.isArray(m.files) && m.files.length > 0) {
                    const attached = m.files.map((f: any) => `[Attachment: ${f.filename || "file"}]`).join("\n");
                    text = `${attached}\n\n${text}`;
                }
                return { role: m.role, content: text };
            }),
        ];

        // Call OmniRoute backend
        const upstreamResponse = await fetch(`${OMNIROUTE_BASE}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OMNIROUTE_KEY}`,
            },
            body: JSON.stringify({
                model: model || "auto",
                messages: formattedMessages,
                stream: true,
            }),
        });

        if (!upstreamResponse.ok) {
            const errText = await upstreamResponse.text();
            return new Response(
                `data: {"type":"error","message":${JSON.stringify("OmniRoute error: " + errText)}}\n\n`,
                {
                    headers: {
                        "Content-Type": "text/event-stream; charset=utf-8",
                        "Cache-Control": "no-cache",
                    },
                }
            );
        }

        const upstreamReader = upstreamResponse.body?.getReader();
        if (!upstreamReader) {
            throw new Error("No upstream response body");
        }

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        let accumulatedContent = "";
        const userPrompt = messages.findLast((m: any) => m.role === "user")?.content || "Legal Query";
        const chatTitle = userPrompt.length > 40 ? userPrompt.slice(0, 37) + "..." : userPrompt;

        const stream = new ReadableStream({
            async start(controller) {
                // Send initial chat_id event
                controller.enqueue(encoder.encode(`data: {"type":"chat_id","chatId":${JSON.stringify(chatId)}}\n\n`));

                let buffer = "";
                try {
                    while (true) {
                        const { done, value } = await upstreamReader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split("\n");
                        buffer = lines.pop() || "";

                        for (const line of lines) {
                            const trimmed = line.trim();
                            if (!trimmed || !trimmed.startsWith("data:")) continue;

                            const dataStr = trimmed.slice(5).trim();
                            if (dataStr === "[DONE]") continue;

                            try {
                                const parsed = JSON.parse(dataStr);
                                const choice = parsed.choices?.[0];
                                if (!choice) continue;

                                const delta = choice.delta;
                                if (!delta) continue;

                                if (delta.reasoning_content) {
                                    controller.enqueue(
                                        encoder.encode(`data: {"type":"reasoning_delta","text":${JSON.stringify(delta.reasoning_content)}}\n\n`)
                                    );
                                }

                                if (delta.content) {
                                    accumulatedContent += delta.content;
                                    controller.enqueue(
                                        encoder.encode(`data: {"type":"content_delta","text":${JSON.stringify(delta.content)}}\n\n`)
                                    );
                                }
                            } catch {
                                // Ignore non-JSON chunks
                            }
                        }
                    }

                    // Send content done and title
                    controller.enqueue(encoder.encode(`data: {"type":"content_done"}\n\n`));
                    controller.enqueue(
                        encoder.encode(`data: {"type":"chat_title","chatId":${JSON.stringify(chatId)},"title":${JSON.stringify(chatTitle)}}\n\n`)
                    );
                    controller.enqueue(encoder.encode(`data: [DONE]\n\n`));

                    // Save chat to local store
                    const now = new Date().toISOString();
                    const newChat: StoredChat = {
                        id: chatId,
                        title: chatTitle,
                        model: model || "auto",
                        created_at: now,
                        updated_at: now,
                        messages: [
                            ...messages.map((m: any, idx: number) => ({
                                id: `msg-u-${idx}-${now}`,
                                role: m.role as "user" | "assistant",
                                content: typeof m.content === "string" ? m.content : JSON.stringify(m.content),
                                created_at: now,
                            })),
                            {
                                id: `msg-a-${now}`,
                                role: "assistant",
                                content: accumulatedContent,
                                created_at: now,
                            },
                        ],
                    };
                    saveStoredChat(newChat);
                } catch (err: any) {
                    controller.enqueue(
                        encoder.encode(`data: {"type":"error","message":${JSON.stringify(err?.message || "Stream error")}}\n\n`)
                    );
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream; charset=utf-8",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Chat failed" }, { status: 500 });
    }
}
