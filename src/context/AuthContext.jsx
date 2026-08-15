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

  const [sessionExpired, setSessionExpired] = useState(false);

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

  useEffect(() => {
    if (!token) {
      return;
    }

    try {
      const tokenParts = token.split(".");

      if (tokenParts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      const payload = JSON.parse(
        atob(
          tokenParts[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        )
      );

      if (!payload.exp) {
        console.warn(
          "Token does not contain an expiration date."
        );

        return;
      }

      const expirationTime =
        payload.exp * 1000;

      const currentTime = Date.now();

      if (expirationTime <= currentTime) {
        handleSessionExpired();
        return;
      }

      const timeUntilExpiration =
        expirationTime - currentTime;

      const timer = setTimeout(() => {
        handleSessionExpired();
      }, timeUntilExpiration);

      return () => {
        clearTimeout(timer);
      };
    } catch (error) {
      console.error(
        "Failed to decode authentication token:",
        error
      );
    }
  }, [token]);

  const handleSessionExpired = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setToken(null);
    setUser(null);

    setSessionExpired(true);
  };

  const login = (data, remember = false) => {
    const storage = remember
      ? localStorage
      : sessionStorage;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    storage.setItem(
      "token",
      data.token
    );

    if (data.user) {
      storage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }

    setToken(data.token);
    setUser(data.user || null);

    setSessionExpired(false);
  };

  const updateUser = (updatedUser) => {
    if (!updatedUser) {
      return;
    }

    setUser(updatedUser);

    const userData =
      JSON.stringify(updatedUser);

    if (localStorage.getItem("token")) {
      localStorage.setItem(
        "user",
        userData
      );
    }

    if (sessionStorage.getItem("token")) {
      sessionStorage.setItem(
        "user",
        userData
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    setToken(null);
    setUser(null);

    setSessionExpired(false);
  };

  const clearSessionExpired = () => {
    setSessionExpired(false);
  };

  const value = {
    user,
    token,
    loading,

    isAuthenticated: !!token,

    login,
    logout,

    updateUser,

    sessionExpired,
    clearSessionExpired,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}