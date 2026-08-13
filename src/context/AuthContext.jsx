import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore login after refreshing the page
  useEffect(() => {
    const savedToken =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    const savedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error(
          "Failed to parse saved user:",
          error
        );

        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // Login
  const login = (data, remember = false) => {
    const storage = remember
      ? localStorage
      : sessionStorage;

    // Clear previous session
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Save new session
    storage.setItem("token", data.token);

    if (data.user) {
      storage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }

    // Update React state
    setToken(data.token);
    setUser(data.user || null);
  };

  // Logout
  const logout = () => {
    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Clear React state
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}