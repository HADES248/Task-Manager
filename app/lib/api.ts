const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"; // fallback for local dev

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include", // if you need cookies
  });

  if (!res.ok) {
    let errorMessage = "Something went wrong";
    try {
      const error = await res.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMessage);
  }

  return res.json();
}