import { useCallback, useEffect, useMemo, useState } from "react";

import * as authService from "../services/authService";
import { getToken, removeToken, setToken } from "../utils/tokenStorage";
import { getUserRoles, hasManagementAccess } from "../utils/roles";
import { AuthContext } from "./AuthContext.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
  }, []);

  const login = useCallback(async (credentials) => {
    const tokenResponse = await authService.login(credentials);
    setToken(tokenResponse.access_token);
    setTokenState(tokenResponse.access_token);

    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);

    return currentUser;
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getToken();

      if (!storedToken) {
        setLoading(false);
        return;
      }

      setTokenState(storedToken);

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch {
        removeToken();
        setTokenState(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      roles: getUserRoles(user),
      hasManagementAccess: hasManagementAccess(user),
      isAuthenticated: Boolean(token && user),
      loading,
      login,
      logout,
    }),
    [user, token, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
