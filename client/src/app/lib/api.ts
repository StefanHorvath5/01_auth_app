import { getAccessToken, setAccessToken } from "./auth";

async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {},
  retry = true
): Promise<Response> {
  const headers: Record<string, string> = {
    ...((init.headers as Record<string, string>) || {}),
    ...(getAccessToken()
      ? { Authorization: `Bearer ${getAccessToken()}` }
      : {}),
  };
  const res = await fetch(input, { ...init, headers, credentials: "include" });

  if (res.status === 401 && retry) {
    // Try to refresh token
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (refreshRes.ok) {
        const { accessToken } = await refreshRes.json();
        setAccessToken(accessToken);
        // Retry original request once
        return fetchWithAuth(input, init, false);
      }
    } catch {}
  }
  return res;
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  console.log("1");
  console.log(res);
  if (!res.ok) throw new Error((await res.json()).message || "Login failed");
  console.log("2");
  const result = await res.json();
  console.log("3");
  console.log(result);
  setAccessToken(result.accessToken);
  return result;
}

export async function register(data: { email: string; password: string }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error((await res.json()).message || "Register failed");
  const result = await res.json();
  setAccessToken(result.accessToken);
  return result;
}

export async function refresh() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  if (!res.ok) throw new Error("Failed to refresh token");
  const result = await res.json();
  setAccessToken(result.accessToken);
  return result;
}

export async function getProfile() {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`
  );
  if (!res.ok) return null;
  return res.json();
}

export async function logout() {
  await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
    method: "POST",
  });
  setAccessToken(null);
}

export async function getItems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`);
  console.log(res);
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

export async function createItem(data: { title: string; description: string }) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/api/items`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
}

export async function updateItem(
  id: string,
  data: { title: string; description: string }
) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/api/items/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}

export async function deleteItem(id: string) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/api/items/${id}`,
    {
      method: "DELETE",
    }
  );
  if (!res.ok) throw new Error("Failed to delete item");
  return res.json();
}
