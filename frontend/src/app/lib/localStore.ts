import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CHATS_FILE = path.join(DATA_DIR, "chats.json");

export interface StoredMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    created_at: string;
}

export interface StoredChat {
    id: string;
    title: string;
    model: string;
    created_at: string;
    updated_at: string;
    messages: StoredMessage[];
}

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(CHATS_FILE)) {
        fs.writeFileSync(CHATS_FILE, JSON.stringify([]), "utf-8");
    }
}

export function getStoredChats(): StoredChat[] {
    try {
        ensureDataDir();
        const data = fs.readFileSync(CHATS_FILE, "utf-8");
        return JSON.parse(data) as StoredChat[];
    } catch {
        return [];
    }
}

export function getStoredChatById(id: string): StoredChat | null {
    const chats = getStoredChats();
    return chats.find((c) => c.id === id) || null;
}

export function saveStoredChat(chat: StoredChat) {
    ensureDataDir();
    const chats = getStoredChats();
    const index = chats.findIndex((c) => c.id === chat.id);
    if (index >= 0) {
        chats[index] = chat;
    } else {
        chats.unshift(chat);
    }
    fs.writeFileSync(CHATS_FILE, JSON.stringify(chats, null, 2), "utf-8");
}

export function deleteStoredChat(id: string) {
    ensureDataDir();
    const chats = getStoredChats().filter((c) => c.id !== id);
    fs.writeFileSync(CHATS_FILE, JSON.stringify(chats, null, 2), "utf-8");
}
