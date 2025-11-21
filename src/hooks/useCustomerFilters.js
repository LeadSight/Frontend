import { useMemo } from 'react';

export const useCustomerFilters = (customers, searchTerm, filters) => {
  return useMemo(() => {

    // ======== SEARCH ========
    const matchesSearch = (customer) =>
      !searchTerm ||
      (customer.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.customerId || '').toLowerCase().includes(searchTerm.toLowerCase());

    // ======== CATEGORY ========
    const matchesCategory = (customer) => {
      if (!filters.categories?.length) return true;
      return filters.categories.includes(customer.category);
    };

    // ======== PROBABILITY ========
    const getProbabilityValue = (customer) =>
      Number((customer.probability || '').replace('%', '')) || 0;

    const matchesProbability = (customer) => {
      if (!filters.probabilityRanges?.length) return true;
      const val = getProbabilityValue(customer);
      return filters.probabilityRanges.some(range => {
        if (range === '<10%') return val < 10;
        if (range === '10%-30%') return val >= 10 && val <= 30;
        if (range === '30%-50%') return val >= 30 && val <= 50;
        if (range === '50%-70%') return val >= 50 && val <= 70;
        if (range === '70%-90%') return val >= 70 && val <= 90;
        if (range === '>90%') return val > 90;
        return false;
      });
    };

    // ======== AGE ========
    const matchesAge = (customer) => {
      if (!filters.ageRanges?.length) return true;
      const age = Number(customer.age) || 0;
      return filters.ageRanges.some(range => {
        if (range === '<30 yo') return age < 30;
        if (range === '30-50 yo') return age >= 30 && age <= 50;
        if (range === '50-70 yo') return age >= 50 && age <= 70;
        if (range === '>70 yo') return age > 70;
        return false;
      });
    };

    // ======== BALANCE FILTER ========
    const matchesBalance = (customer) => {
      if (!filters.excludeZeroBalance) return true;
      return Number(customer.balance) > 0;
    };

    // ======== APPLY ALL FILTERS ========
    const filtered = customers.filter(customer =>
      matchesSearch(customer) &&
      matchesCategory(customer) &&
      matchesProbability(customer) &&
      matchesAge(customer) &&
      matchesBalance(customer) &&
      (filters.hasDeposit == null || customer.hasDeposit === filters.hasDeposit) &&
      (filters.hasLoan == null || customer.hasLoan === filters.hasLoan)
    );

    // ======== COMPARATOR (FINAL FIX) ========
    const comparator = (a, b) => {
      const getRank = (c) => Number(c.originalRank ?? c.rank ?? 999);
      const getBalance = (c) => Number(c.balance) || 0;

      const priorityList = filters.sortOrder || []; // PRIMARY → SECONDARY → etc

      for (const key of priorityList) {
        let diff = 0;

        if (key === 'balanceSort' && filters.balanceSort) {
          diff = filters.balanceSort === 'highest'
            ? getBalance(b) - getBalance(a)
            : getBalance(a) - getBalance(b);
        }

        if (key === 'rank' && filters.rank) {
          diff = filters.rank === 'highest'
            ? getRank(a) - getRank(b)
            : getRank(b) - getRank(a);
        }

        if (diff !== 0) return diff; // Stop when we find difference (PRIMARY or SECONDARY)
      }

      // DEFAULT fallback
      return getProbabilityValue(b) - getProbabilityValue(a);
    };

    return [...filtered].sort(comparator);

  }, [customers, searchTerm, filters]);
};
