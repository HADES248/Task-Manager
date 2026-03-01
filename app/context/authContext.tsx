"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => { },
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);
        } else {
          setAccessToken(null);
        }
      } catch (err) {
        console.error("Auth refresh failed:", err);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, loading }}>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <p>Loading session...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);