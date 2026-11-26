/**
 * Handover Centralized Frontend HTTP API Client
 * Connects frontend to the Express backend server on http://localhost:5000
 */

const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_API_URL"]) ||
  "http://localhost:5000";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  let url = `${API_BASE_URL}${endpoint}`;

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...((options.headers as Record<string, string>) || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const json = (await response.json().catch(() => ({}))) as ApiResponse<T>;

    if (!response.ok) {
      return {
        success: false,
        error: json.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return json;
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to connect to backend server. Make sure the server is running on port 5000.";
    return {
      success: false,
      error: message,
    };
  }
}

export const api = {
  get: <T = unknown>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),
  post: <T = unknown>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => {
    const opts: ApiRequestOptions = { ...options, method: "POST" };
    if (body !== undefined) {
      opts.body = JSON.stringify(body);
    }
    return apiRequest<T>(endpoint, opts);
  },
  put: <T = unknown>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => {
    const opts: ApiRequestOptions = { ...options, method: "PUT" };
    if (body !== undefined) {
      opts.body = JSON.stringify(body);
    }
    return apiRequest<T>(endpoint, opts);
  },
  delete: <T = unknown>(endpoint: string, options?: ApiRequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
