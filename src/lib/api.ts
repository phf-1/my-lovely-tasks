const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

let token: string | null = localStorage.getItem("auth-token");

export function setToken(t: string | null) {
  token = t;
  if (t) {
    localStorage.setItem("auth-token", t);
  } else {
    localStorage.removeItem("auth-token");
  }
}

export function getToken(): string | null {
  return token;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json();

  if (!res.ok) {
    throw new ApiError(body.error ?? "Unknown error", res.status);
  }

  return body as T;
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Auth ────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: { email: string };
}

export interface User {
  email: string;
}

export async function apiSignUp(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function apiSignIn(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function apiSignOut(): Promise<void> {
  return request<void>("/auth/signout", { method: "POST" });
}

export async function apiGetMe(): Promise<User> {
  return request<User>("/auth/me");
}

// ── Todos ───────────────────────────────────────────

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export async function apiListTodos(): Promise<Todo[]> {
  return request<Todo[]>("/todos");
}

export async function apiCreateTodo(text: string): Promise<Todo> {
  return request<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export async function apiUpdateTodo(
  todoId: string,
  data: { text?: string; completed?: boolean }
): Promise<Todo> {
  return request<Todo>(`/todos/${todoId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function apiDeleteTodo(todoId: string): Promise<void> {
  return request<void>(`/todos/${todoId}`, { method: "DELETE" });
}
