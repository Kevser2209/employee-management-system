import { useContext } from "react";

import { AuthContext } from "./AuthContext.js";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth yalnızca AuthProvider içinde kullanılabilir.");
  }

  return context;
}
