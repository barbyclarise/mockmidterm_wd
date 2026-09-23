const API_BASE = "http://localhost:3000/api";
export const login = async (
  email: string,
  password: string,
): Promise<{ token: string }> => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Invalid credentials");
  return response.json();
};
export const register = async (
  email: string,
  password: string,
): Promise<void> => {
  const response = await fetch(`${API_BASE}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error("Failed to register");
};
