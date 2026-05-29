import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [githubToken, setGithubToken] = useState(null);

  useEffect(() => {
    // GitHub OAuth callback detection
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      api.post("/auth/github/callback", { code })
        .then((res) => {
          const jwtToken = res.data.accessToken;  // backend uses accessToken, not token
          const userData = res.data.user;
          localStorage.setItem("token", jwtToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${jwtToken}`;
          setToken(jwtToken);
          setUser(userData);
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          console.error("GitHub OAuth failed:", err);
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .finally(() => setLoading(false));
      return;
    }
  
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { access_token, user: userData } = res.data;
    localStorage.setItem("token", access_token);
    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, institution) => {
    const res = await api.post("/auth/register", { name, email, password, institution });
    const { access_token, user: userData } = res.data;
    localStorage.setItem("token", access_token);
    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    setGithubToken(null);
  };

  const setGitHubAccessToken = (tok) => setGithubToken(tok);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, githubToken, setGitHubAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
