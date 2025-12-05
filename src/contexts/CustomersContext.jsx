import { createContext, useState, useEffect, useCallback } from "react";
import { getCustomers, updateCustomerProbability, calculateProbability } from "../api/api";
import { useAuth } from "../hooks/useAuth";

const CustomersContext = createContext();

export function CustomersProvider({ children }) {
  const { token } = useAuth();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});

  // Response data
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const processMissingProbabilities = useCallback(
    async (customerList) => {
      if (!customerList || customerList.length === 0) return;

      // 1. Find customers missing probability
      const missing = customerList.filter(
        (c) => c.probability === null || c.probability === undefined
      );

      if (missing.length === 0) return;

      for (const customer of missing) {
        try {
          // 2. Reorder object according to ML API requirement
          const mlInput = {
            age: customer.age,
            job: customer.job,
            marital: customer.marital,
            education: customer.education,
            default: customer.default,
            housing: customer.housing,
            loan: customer.loan,
            contact: customer.contact,
            month: customer.month,
            day_of_week: customer.day,
            duration: customer.duration,
            campaign: customer.campaign,
            pdays: customer.pdays,
            previous: customer.previous,
            poutcome: customer.poutcome,
            "emp.var.rate": customer.emp_var_rate,
            "cons.price.idx": customer.cons_price_idx,
            "cons.conf.idx": customer.cons_conf_idx,
            euribor3m: customer.euribor3m,
            "nr.employed": customer.nr_employed,
            balance: customer.balance
          };

          // 3. Call ML API
          const predicted = await calculateProbability(mlInput);

          // 4. Update database through backend API (placeholder)
          await updateCustomerProbability(token, { id: customer.id, probability: predicted.predicted });

        } catch (err) {
          console.error("Failed processing probability for customer", customer.id, err);
        }
      }
    },
    [token]
  );
  
  const fetchCustomers = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);

    try {      
      const response = await getCustomers(
        token,
        {
          page,
          pageSize,
          search,
          filters
        }
      );

      const customerList = response.customers || [];

      setCustomers(customerList);
      setTotalPages(response.totalPages || 1);
      setTotalItems(response.totalItems || 0);

      await processMissingProbabilities(customerList);

    } catch (err) {
      console.error("Failed to load customers", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, page, pageSize, search, filters, processMissingProbabilities]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <CustomersContext.Provider
      value={{
        customers,
        isLoading,
        page,
        pageSize,
        totalPages,
        totalItems,
        setPage,
        setPageSize,
        setFilters,
        setSearch,
        refreshCustomers: fetchCustomers
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
}

export default CustomersContext;