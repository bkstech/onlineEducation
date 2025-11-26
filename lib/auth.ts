// API Configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:5001";

// Types
export interface LoginRequest {
  email: string;
  password: string;
  role?: "student" | "teacher";
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
  role?: "student" | "teacher";
}

// User info management (no JWT storage)
const USER_KEY = "auth_user";
export const saveUserInfo = (user: Omit<AuthResponse, "token">) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getUserInfo = ():
  | (Omit<AuthResponse, "token"> & { role?: "student" | "teacher" })
  | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const removeUserInfo = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  // With HttpOnly cookie, you may need to check by calling a /me or /profile endpoint
  return !!getUserInfo();
};

// API Functions
export const login = async (request: LoginRequest): Promise<AuthResponse> => {
  const endpoint =
    request.role === "teacher"
      ? `${API_BASE_URL}/api/Auth/login/teacher`
      : `${API_BASE_URL}/api/Auth/Login`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Send/receive cookies
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Login failed" }));
    throw new Error(error.message || "Login failed");
  }

  const data: AuthResponse = await response.json();

  // Only save user info (not token)
  saveUserInfo({
    email: data.email,
    firstname: data.firstname,
    lastname: data.lastname,
    id: data.id,
    role: request.role,
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
    credentials: "include", // Send/receive cookies
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Registration failed" }));
    throw new Error(error.message || "Registration failed");
  }

  const data: AuthResponse = await response.json();

  // Only save user info (not token)
  saveUserInfo({
    email: data.email,
    firstname: data.firstname,
    lastname: data.lastname,
    id: data.id,
  });

  return data;
};

export const logout = () => {
  removeUserInfo();
  if (typeof window !== "undefined") {
    window.location.href = "/signin";
  }
};

// Helper function to make authenticated API calls (cookie-based)
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: "include", // Always send cookies
  });

  if (response.status === 401) {
    removeUserInfo();
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
    throw new Error("Authentication required");
  }

  return response;
};
