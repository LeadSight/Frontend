import { useState, useEffect } from 'react';
import { initialCustomers } from '../data/initialData';

const STORAGE_KEY = 'leadsight_customers_v1';

export const useCustomers = () => {
  const [customers, setCustomers] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasRank = parsed.every(c => typeof c.originalRank === 'number');
          if (hasRank) {
            // Merge dengan initialCustomers untuk memastikan semua field ada
            const merged = parsed.map(c => {
              const original = initialCustomers.find(ic => ic.id === c.id);
              return original ? { ...original, ...c } : c;
            });
            return merged;
          }
          
          const ranking = [...initialCustomers].sort((a, b) => {
            const pa = parseInt(a.probability.replace('%', '')) || 0;
            const pb = parseInt(b.probability.replace('%', '')) || 0;
            return pb - pa;
          });
          const rankMap = {};
          ranking.forEach((c, i) => { rankMap[c.id] = i + 1; });
          
          // Merge dan tambahkan rank
          const merged = parsed.map(c => {
            const original = initialCustomers.find(ic => ic.id === c.id);
            const base = original ? { ...original, ...c } : c;
            return { ...base, originalRank: rankMap[c.id] ?? null };
          });
          return merged;
        }
      }
    } catch (err) {
      console.warn('Failed to load from localStorage:', err);
    }

    // Fallback: gunakan initialCustomers dengan ranking
    const copy = [...initialCustomers];
    copy.sort((a, b) => {
      const pa = parseInt(a.probability.replace('%', '')) || 0;
      const pb = parseInt(b.probability.replace('%', '')) || 0;
      return pb - pa;
    });
    return copy.map((c, i) => ({ ...c, originalRank: i + 1 }));
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
    } catch (err) {
      console.warn('Failed to persist customers', err);
    }
  }, [customers]);

  // Function to reset data to initial state
  const resetCustomers = () => {
    const copy = [...initialCustomers];
    copy.sort((a, b) => {
      const pa = parseInt(a.probability.replace('%', '')) || 0;
      const pb = parseInt(b.probability.replace('%', '')) || 0;
      return pb - pa;
    });
    const reset = copy.map((c, i) => ({ ...c, originalRank: i + 1 }));
    setCustomers(reset);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reset));
  };

  return [customers, setCustomers, resetCustomers];
};