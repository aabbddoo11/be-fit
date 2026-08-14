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

  // ⭐ حالة انتهاء صلاحية الجلسة
  const [sessionExpired, setSessionExpired] = useState(false);


  /*
  ==========================================
  Restore Login After Refresh
  ==========================================
  */

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


  /*
  ==========================================
  ⭐ Check JWT Expiration
  ==========================================
  */

  useEffect(() => {

    if (!token) {
      return;
    }


    try {

      // JWT consists of:
      // header.payload.signature

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );


      if (!payload.exp) {
        console.warn(
          "Token does not contain an expiration date."
        );

        return;
      }


      const expirationTime =
        payload.exp * 1000;

      const currentTime =
        Date.now();


      /*
      ==========================================
      Token Already Expired
      ==========================================
      */

      if (expirationTime <= currentTime) {

        handleSessionExpired();

        return;
      }


      /*
      ==========================================
      ⭐ Set Timer Until Token Expires
      ==========================================
      */

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


  /*
  ==========================================
  ⭐ Session Expired
  ==========================================
  */

  const handleSessionExpired = () => {

    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");


    // Clear React authentication state
    setToken(null);
    setUser(null);


    // ⭐ Tell the application that the session expired
    setSessionExpired(true);
  };


  /*
  ==========================================
  Login
  ==========================================
  */

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


    // Update React state
    setToken(data.token);
    setUser(data.user || null);


    // ⭐ New login means session is active again
    setSessionExpired(false);
  };


  /*
  ==========================================
  Logout
  ==========================================
  */

  const logout = () => {

    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");


    // Clear React state
    setToken(null);
    setUser(null);


    // ⭐ Normal logout is NOT session expiration
    setSessionExpired(false);
  };


  /*
  ==========================================
  Close Session Expired Message
  ==========================================
  */

  const clearSessionExpired = () => {
    setSessionExpired(false);
  };


  /*
  ==========================================
  Context Value
  ==========================================
  */

  const value = {
    user,
    token,
    loading,

    isAuthenticated: !!token,

    login,
    logout,

    // ⭐ Session expiration state
    sessionExpired,

    // ⭐ Used after displaying the message
    clearSessionExpired,
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