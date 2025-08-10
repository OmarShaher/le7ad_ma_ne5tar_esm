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

  // Handle empty or invalid JSON response
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Unexpected end of JSON input");
  }

  if (!res.ok) throw new Error(data.error || "Failed to login");
  return data;
}

export async function authMe() {
  const token = getToken();
  const res = await fetch("/api/auth/me", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  
  // Handle empty or invalid JSON response
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server returned invalid response");
  }
  
  if (!res.ok) throw new Error(data.error || "Failed to load user");
  return data;
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
  
  // Handle empty or invalid JSON response
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server returned invalid response");
  }
  
  if (!res.ok) throw new Error(data.error || "Failed to update profile");
  return data;
}

export type DashboardSummary = {
  userId: string;
  mockInterviewsCount: number;
  successRate: number; // 0..1
  problemsSolvedCount: number;
  cards: {
    technicalQuestions: { total: number; completed: number; progressPercent: number };
    mockInterviews: { scheduled: number; completed: number; avgScore: number };
    companyPrep: { activeCompany: string; progressPercent: number };
  };
  stats: {
    completed: number;
    inProgress: number;
    studyTimeHours: number;
    streak: number;
  };
  lastUpdated: string;
};

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const token = getToken();
  const res = await fetch("/api/dashboard/summary", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  
  // Handle empty or invalid JSON response
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server returned invalid response");
  }
  
  if (!res.ok) throw new Error(data.error || "Failed to load summary");
  return data;
}

export type Question = {
  _id: string;
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  choices?: string[];
  correctIndex?: number;
};

export async function fetchQuestions(params?: { limit?: number; difficulty?: string }): Promise<Question[]> {
  const token = getToken();
  const q = new URLSearchParams();
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.difficulty) q.set('difficulty', params.difficulty);
  const res = await fetch(`/api/questions?${q.toString()}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  
  // Handle empty or invalid JSON response
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server returned invalid response");
  }
  
  if (!res.ok) throw new Error(data.error || 'Failed to load questions');
  return data;
}

export async function submitAttempt(questionId: string, selectedIndex: number) {
  const token = getToken();
  const res = await fetch(`/api/questions/${questionId}/attempt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ selectedIndex })
  });
  
  // Handle empty or invalid JSON response
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Server returned invalid response");
  }
  
  if (!res.ok) throw new Error(data.error || 'Failed to submit');
  return data;
}


