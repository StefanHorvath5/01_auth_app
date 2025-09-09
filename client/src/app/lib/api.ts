export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {},
  accessToken: string | null,
  setAccessToken: (token: string | null) => void,
  retry = true
): Promise<Response> {
  const headers: Record<string, string> = {
    ...((init.headers as Record<string, string>) || {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
  const res = await fetch(input, { ...init, headers, credentials: "include" });

  if (res.status === 401 && retry) {
    try {
      const refreshRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (refreshRes.ok) {
        const { accessToken: newToken } = await refreshRes.json();
        setAccessToken(newToken);
        localStorage.setItem("accessToken", newToken);
        // Retry original request once
        return fetchWithAuth(input, init, newToken, setAccessToken, false);
      }
    } catch {}
  }
  return res;
}

export async function login(
  data: { email: string; password: string },
  setAccessToken: (token: string | null) => void
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error((await res.json()).message || "Login failed");
  const result = await res.json();
  setAccessToken(result.accessToken);
  localStorage.setItem("accessToken", result.accessToken);
  return result;
}

export async function register(
  data: { email: string; password: string },
  setAccessToken: (token: string | null) => void
) {
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
  localStorage.setItem("accessToken", result.accessToken);
  return result;
}

export async function refresh(setAccessToken: (token: string | null) => void) {
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
  localStorage.setItem("accessToken", result.accessToken);
  return result;
}

export async function getProfile(
  accessToken: string | null,
  setAccessToken: (token: string | null) => void
) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
    {},
    accessToken,
    setAccessToken
  );
  if (!res.ok) return null;
  return res.json();
}

export async function logout(
  accessToken: string | null,
  setAccessToken: (token: string | null) => void
) {
  await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
    { method: "POST" },
    accessToken,
    setAccessToken
  );
  setAccessToken(null);
  localStorage.removeItem("accessToken");
}

export async function getItems() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/items`);
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

export async function createItem(
  data: { title: string; description: string },
  accessToken: string | null,
  setAccessToken: (token: string | null) => void
) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/api/items`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    accessToken,
    setAccessToken
  );
  if (!res.ok) throw new Error("Failed to create item");
  return res.json();
}

export async function updateItem(
  id: string,
  data: { title: string; description: string },
  accessToken: string | null,
  setAccessToken: (token: string | null) => void
) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/api/items/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
    accessToken,
    setAccessToken
  );
  if (!res.ok) throw new Error("Failed to update item");
  return res.json();
}

export async function deleteItem(
  id: string,
  accessToken: string | null,
  setAccessToken: (token: string | null) => void
) {
  const res = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/api/items/${id}`,
    {
      method: "DELETE",
    },
    accessToken,
    setAccessToken
  );
  if (!res.ok) throw new Error("Failed to delete item");
  return res.json();
}
