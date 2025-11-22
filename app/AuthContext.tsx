"use client";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { getUserInfo, saveUserInfo, removeUserInfo } from "@/lib/auth";

// Auth state type
interface AuthState {
  user: {
    firstname: string;
    lastname: string;
    email: string;
    id: number;
  } | null;
}

// Actions
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

type AuthAction =
  | { type: typeof LOGIN; payload: AuthState["user"] }
  | { type: typeof LOGOUT };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case LOGIN:
      return { user: action.payload };
    case LOGOUT:
      return { user: null };
    default:
      return state;
  }
}

// Context
const AuthContext = createContext<
  | {
      state: AuthState;
      login: (user: AuthState["user"]) => void;
      logout: () => void;
    }
  | undefined
>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, { user: null });

  useEffect(() => {
    // Load user info from localStorage on mount
    const info = getUserInfo();
    if (info) {
      dispatch({ type: LOGIN, payload: info });
    }
  }, []);

  const login = (user: AuthState["user"]) => {
    if (user) {
      saveUserInfo(user);
    }
    dispatch({ type: LOGIN, payload: user });
  };

  const logout = () => {
    removeUserInfo();
    dispatch({ type: LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
