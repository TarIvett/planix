// src/api/auth.js
export function setAuthToken(token) {
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
}

export function getAuthToken() {
    return localStorage.getItem("authToken");
}

export function authHeaders(extra = {}) {
    const token = getAuthToken();
    return {
        ...(extra || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

export async function authFetch(url, options = {}) {
    const res = await fetch(url, {
        ...options,
        headers: authHeaders(options.headers),
    });
    if (res.status === 401) throw new Error("Unauthorized");
    return res;
}
