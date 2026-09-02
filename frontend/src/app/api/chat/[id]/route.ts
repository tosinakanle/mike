import { NextRequest, NextResponse } from "next/server";
import { getStoredChatById, deleteStoredChat, updateStoredChat } from "@/app/lib/localStore";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const stored = getStoredChatById(id);
    if (!stored) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({
        chat: {
            id: stored.id,
            project_id: null,
            user_id: "lex-counsel-01",
            title: stored.title,
            model: stored.model,
            reasoning_level: "high",
            created_at: stored.created_at,
        },
        messages: stored.messages.map((m) => {
            if (m.role === "assistant") {
                return {
                    id: m.id,
                    chat_id: stored.id,
                    role: "assistant",
                    content: [
                        {
                            type: "content",
                            text: m.content,
                        },
                    ],
                    citations: [],
                    created_at: m.created_at,
                };
            }
            return {
                id: m.id,
                chat_id: stored.id,
                role: "user",
                content: m.content,
                created_at: m.created_at,
            };
        }),
    });
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    try {
        const body = await request.json();
        const updated = updateStoredChat(id, body);
        if (!updated) {
            return NextResponse.json({ error: "Chat not found" }, { status: 404 });
        }
        return NextResponse.json({
            id: updated.id,
            title: updated.title,
            model: updated.model,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err?.message || "Update failed" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    deleteStoredChat(id);
    return new NextResponse(null, { status: 204 });
}
