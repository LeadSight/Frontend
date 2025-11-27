import { createContext, useState, useEffect, useCallback } from "react";
import { getDashboard } from "../api/api";
import { useAuth } from "../hooks/useAuth";

// Use This Context to Get the dashboard data. statsData is every data needed for the sidebar. distData is other distribution data such as Job Distribution, etc. 

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const { token } = useAuth();

  const [statsData, setStatsData] = useState([]);
  const [distData, setDistData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      if (!token) return;
      const data = await getDashboard(token);      

      setStatsData(data.statsData);
      setDistData(data.distData);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);
  
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return (
    <DashboardContext.Provider
      value={{ statsData, isLoading, distData }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export default DashboardContext;