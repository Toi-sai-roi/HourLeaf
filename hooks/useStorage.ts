// hooks/useStorage.ts
import { useState, useCallback } from "react";
import {
  loadAccounts,
  registerAccount,
  loginAccount,
  loadCurrentUser,
  logoutUser,
  loadAllOrders,
  StoredUser,
} from "../services/StorageService";

export function useStorage() {
  const [loadingCount, setLoadingCount] = useState(0);

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setLoadingCount(prev => prev + 1); // Tăng counter
    try {
      return await fn();
    } finally {
      setLoadingCount(prev => Math.max(0, prev - 1)); // Giảm counter
    }
  }, []);

  return {
    loading: loadingCount > 0,

    loadAccounts: () => withLoading(loadAccounts), 

    registerAccount: (user: StoredUser) =>
      withLoading(() => registerAccount(user)),

    loginAccount: (email: string, password: string) =>
      withLoading(() => loginAccount(email, password)),

    loadCurrentUser: () => withLoading(loadCurrentUser),

    logoutUser: () => withLoading(logoutUser),

    loadAllOrders: () => withLoading(loadAllOrders),
  };
}