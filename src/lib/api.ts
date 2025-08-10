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

// Auth helpers
const TOKEN_KEY = "navitech_token";
export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function authRegister(payload: { name: string; email: string; password: string; confirmPassword: string }) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to register");
  return res.json();
}

export async function authLogin(payload: { email: string; password: string }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to login");
  return res.json();
}

export async function authMe() {
  const token = getToken();
  const res = await fetch("/api/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to load user");
  return res.json();
}

export async function updateProfile(payload: { name?: string; email?: string; university?: string }) {
  const token = getToken();
  const res = await fetch("/api/auth/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to update profile");
  return res.json();
}


