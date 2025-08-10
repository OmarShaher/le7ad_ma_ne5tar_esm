export type Message = {
  id?: string;
  _id?: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  language: "en" | "ar";
};

function normalizeMessage(doc: any): Message {
  return {
    id: doc._id ?? doc.id,
    _id: doc._id,
    text: doc.text,
    isBot: Boolean(doc.isBot),
    timestamp: new Date(doc.timestamp ?? Date.now()),
    language: doc.language === "ar" ? "ar" : "en",
  };
}

export async function fetchMessages(): Promise<Message[]> {
  const res = await fetch("/api/messages");
  if (!res.ok) throw new Error("Failed to fetch messages");
  const data = await res.json();
  return Array.isArray(data) ? data.map(normalizeMessage) : [];
}

export async function sendChat(text: string): Promise<{ userMessage: Message; botMessage: Message }> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Failed to send chat");
  const data = await res.json();
  return {
    userMessage: normalizeMessage(data.userMessage),
    botMessage: normalizeMessage(data.botMessage),
  };
}


