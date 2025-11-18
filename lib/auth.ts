// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  middlename?: string;
  lastname: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  dob: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstname: string;
  lastname: string;
  id: number;
}

// Token Management
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const saveAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const saveUserInfo = (user: Omit<AuthResponse, "token">) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getUserInfo = (): Omit<AuthResponse, "token"> | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// API Functions
export const login = async (
  request: LoginRequest
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/Auth/Login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Login failed" }));
    throw new Error(error.message || "Login failed");
  }

  const data: AuthResponse = await response.json();
  
  // Save token and user info
  saveAuthToken(data.token);
  saveUserInfo({
    email: data.email,
    firstname: data.firstname,
    lastname: data.lastname,
    id: data.id,
  });

  return data;
};

export const register = async (
  request: RegisterRequest
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/Auth/Register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Registration failed" }));
    throw new Error(error.message || "Registration failed");
  }

  const data: AuthResponse = await response.json();
  
  // Save token and user info
  saveAuthToken(data.token);
  saveUserInfo({
    email: data.email,
    firstname: data.firstname,
    lastname: data.lastname,
    id: data.id,
  });

  return data;
};

export const logout = () => {
  removeAuthToken();
  if (typeof window !== "undefined") {
    window.location.href = "/signin";
  }
};

// Helper function to make authenticated API calls
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    removeAuthToken();
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
    throw new Error("Authentication required");
  }

  return response;
};
