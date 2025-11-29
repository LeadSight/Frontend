import { createContext, useState, useEffect, useCallback } from "react";
import { getCustomers } from "../api/api";
import { useAuth } from "../hooks/useAuth";

const CustomersContext = createContext();

export function CustomersProvider({ children }) {
  const { token } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!token) return;
      const data = await getCustomers(token);

      const sorted = [...data].sort((a, b) => {
        const pa = parseInt(a.probability.replace("%", "")) || 0;
        const pb = parseInt(b.probability.replace("%", "")) || 0;
        return pb - pa;
      });

      const ranked = sorted.map((c, i) => ({
        ...c,
        originalRank: i + 1,
      }));

      setCustomers(ranked);
    } catch (err) {
      console.error("Failed to load customers", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <CustomersContext.Provider
      value={{ customers, isLoading, setCustomers, refreshCustomers: fetchCustomers }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

export default CustomersContext;