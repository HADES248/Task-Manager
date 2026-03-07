import { useAuth } from "../context/authContext";

const { accessToken, setAccessToken } = useAuth();

const fetchDashboard = async () => {
  try {
    const res = await fetch("/api/dashboard", {
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include", 
    });

    if (res.status === 401) {
      const refreshRes = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      const refreshData = await refreshRes.json();
      setAccessToken(refreshData.accessToken);
      return fetchDashboard();
    }

    return res.json();
  } catch (err) {
    console.error(err);
  }
};