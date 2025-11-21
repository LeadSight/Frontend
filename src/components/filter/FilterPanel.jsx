import React, { useState } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const defaultFilters = { 
  rank: null, 
  probabilityRanges: [], 
  categories: [], 
  ageRanges: [], 
  balanceSort: null, 
  hasDeposit: null, 
  hasLoan: null 
};

const FilterPanel = ({ show, onClose, filters = defaultFilters, onApply }) => {
  const [tempFilters, setTempFilters] = useState(filters);
  // const [sortOrder, setSortOrder] = useState([]); // Track order of user selections
  const [openBalance, setOpenBalance] = useState(true);
  const [openDeposit, setOpenDeposit] = useState(true);
  const [openLoan, setOpenLoan] = useState(true);
  const [openRank, setOpenRank] = useState(true);
  const [openProbability, setOpenProbability] = useState(true);
  const [openCategory, setOpenCategory] = useState(true);
  const [openAge, setOpenAge] = useState(true);

  // useEffect(() => {
  //   requestAnimationFrame(() => {
  //     setTempFilters(filters || defaultFilters);
  //     setSortOrder(filters.sortOrder || []);
  //   });
  // }, [filters, show]);

  // // Track when user selects a sort option
  // const handleSortSelection = (sortType, value) => {
  //   setTempFilters(prev => ({
  //     ...prev,
  //     [sortType]: value
  //   }));

  //   // Add to sortOrder if not already there and value is not null
  //   if (value != null && !sortOrder.includes(sortType)) {
  //     setSortOrder(prev => [...prev, sortType]);
  //   }
  //   // Remove from sortOrder if value is null (deselected)
  //   else if (value == null) {
  //     setSortOrder(prev => prev.filter(item => item !== sortType));
  //   }
  // };

  // Count active filters
  const countActiveFilters = (filters) => {
    let count = 0;
    if (filters.balanceSort != null) count++;
    if (filters.hasDeposit != null) count++;
    if (filters.hasLoan != null) count++;
    if (filters.rank != null) count++;
    if (filters.probabilityRanges?.length > 0) count++;
    if (filters.categories?.length > 0) count++;
    if (filters.ageRanges?.length > 0) count++;
    return count;
  };

  // Handle apply with sorting priority
  const handleApplyFilters = () => {
    const activeFilterCount = countActiveFilters(tempFilters);
    
    // Determine primary sort
    let primarySort = null;
    if (tempFilters.balanceSort) primarySort = 'balance';
    else if (tempFilters.hasDeposit) primarySort = 'deposit';
    else if (tempFilters.hasLoan) primarySort = 'loan';
    else if (tempFilters.probabilityRanges?.length > 0) primarySort = 'probability';
    else if (tempFilters.categories?.length > 0) primarySort = 'category';
    else if (tempFilters.ageRanges?.length > 0) primarySort = 'age';
    
    // Add sorting priority information
    const filtersWithPriority = {
      ...tempFilters,
      sortPriority: {
        // Primary is any other filter
        primary: primarySort,
        // Rank is ALWAYS secondary if selected with other filters
        secondary: (primarySort && tempFilters.rank) ? 'rank' : null,
        // If ONLY rank is selected, it becomes primary
        rankOnly: !primarySort && tempFilters.rank
      },
      activeFilterCount,
      // Flag to exclude zero balance when balance sort is active
      excludeZeroBalance: Boolean(tempFilters.balanceSort)
    };
    
    console.log('Filters being applied:', filtersWithPriority);
    
    if (onApply) onApply(filtersWithPriority);
    onClose();
  };

  const headerClass = (active) => `w-full ${active ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'} font-semibold py-2 px-4 rounded-lg text-left mb-2 transition-colors`;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="filter-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-end z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose && onClose();
          }}
        >
          <motion.div
            key="filter-panel"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white w-96 h-full overflow-y-auto p-6 shadow-2xl pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Preferences</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Balance Filter */}
              <div>
                <button type="button" onClick={() => setOpenBalance(v => !v)} className={headerClass(openBalance || tempFilters.balanceSort != null)}>
                  Balance
                </button>
                {openBalance && (
                  <div className="space-y-2 ml-4">
                    {['All', 'Highest', 'Lowest'].map((val) => (
                      <label key={val} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="balance"
                          checked={
                            val === 'All'
                              ? tempFilters.balanceSort == null
                              : tempFilters.balanceSort?.toLowerCase() === val.toLowerCase()
                          }
                          onChange={() =>
                            setTempFilters(prev => ({
                              ...prev,
                              balanceSort: val === 'All' ? null : val.toLowerCase()
                            }))
                          }
                          className="text-purple-600 cursor-pointer"
                        />
                        <span className="text-gray-600">{val}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Deposit Filter */}
              <div>
                <button type="button" onClick={() => setOpenDeposit(v => !v)} className={headerClass(openDeposit || tempFilters.hasDeposit != null)}>
                  Deposit
                </button>
                {openDeposit && (
                  <div className="space-y-2 ml-4">
                    {['All', 'Yes', 'No'].map((val) => (
                      <label key={val} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="deposit"
                          checked={
                            val === 'All' ? tempFilters.hasDeposit == null : tempFilters.hasDeposit === val
                          }
                          onChange={() =>
                            setTempFilters(prev => ({
                              ...prev,
                              hasDeposit: val === 'All' ? null : val
                            }))
                          }
                          className="text-purple-600 cursor-pointer"
                        />
                        <span className="text-gray-600">{val}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Loan Filter */}
              <div>
                <button type="button" onClick={() => setOpenLoan(v => !v)} className={headerClass(openLoan || tempFilters.hasLoan != null)}>
                  Loan
                </button>
                {openLoan && (
                  <div className="space-y-2 ml-4">
                    {['All', 'Yes', 'No'].map((val) => (
                      <label key={val} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="loan"
                          checked={
                            val === 'All' ? tempFilters.hasLoan == null : tempFilters.hasLoan === val
                          }
                          onChange={() =>
                            setTempFilters(prev => ({
                              ...prev,
                              hasLoan: val === 'All' ? null : val
                            }))
                          }
                          className="text-purple-600 cursor-pointer"
                        />
                        <span className="text-gray-600">{val}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Rank Filter */}
              <div>
                <button type="button" onClick={() => setOpenRank(v => !v)} className={headerClass(openRank || tempFilters.rank != null)}>
                  Rank
                </button>
                {openRank && (
                  <div className="space-y-2 ml-4">
                    {['highest', 'lowest'].map((val) => (
                      <label key={val} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rank"
                          checked={tempFilters.rank === val}
                          onChange={() => setTempFilters(prev => ({ ...prev, rank: val }))}
                          className="text-purple-600 cursor-pointer"
                        />
                        <span className="text-gray-600">{val === 'highest' ? 'Highest Rank' : 'Lowest Rank'}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Probability Score Filter */}
              <div>
                <button type="button" onClick={() => setOpenProbability(v => !v)} className={headerClass(openProbability || (tempFilters.probabilityRanges && tempFilters.probabilityRanges.length > 0))}>
                  Probability Score
                </button>
                {openProbability && (
                  <div className="space-y-2 ml-4">
                    {['<10%', '10%-30%', '30%-50%', '50%-70%', '70%-90%', '>90%'].map((range) => (
                      <label key={range} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempFilters.probabilityRanges?.includes(range)}
                          onChange={() =>
                            setTempFilters(prev => {
                              const list = prev.probabilityRanges || [];
                              return { ...prev, probabilityRanges: list.includes(range) ? list.filter(i => i !== range) : [...list, range] };
                            })
                          }
                          className="text-purple-600 cursor-pointer"
                        />
                        <span className="text-gray-600">{range}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <button type="button" onClick={() => setOpenCategory(v => !v)} className={headerClass(openCategory || (tempFilters.categories && tempFilters.categories.length > 0))}>
                  Category
                </button>
                {openCategory && (
                  <div className="space-y-2 ml-4">
                    {['Priority', 'Non Priority'].map((val) => (
                      <label key={val} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempFilters.categories?.includes(val)}
                          onChange={() =>
                            setTempFilters(prev => {
                              const list = prev.categories || [];
                              return { ...prev, categories: list.includes(val) ? list.filter(i => i !== val) : [...list, val] };
                            })
                          }
                          className="text-purple-600 cursor-pointer"
                        />
                        <span className="text-gray-600">{val === 'Non Priority' ? 'Not Priority' : val}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Age Filter */}
              <div>
                <button type="button" onClick={() => setOpenAge(v => !v)} className={headerClass(openAge || (tempFilters.ageRanges && tempFilters.ageRanges.length > 0))}>
                  Age
                </button>
                {openAge && (
                  <div className="space-y-2 ml-4">
                    {['<30 yo', '30-50 yo', '50-70 yo', '>70 yo'].map((range) => (
                      <label key={range} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempFilters.ageRanges?.includes(range)}
                          onChange={() =>
                            setTempFilters(prev => {
                              const list = prev.ageRanges || [];
                              return { ...prev, ageRanges: list.includes(range) ? list.filter(i => i !== range) : [...list, range] };
                            })
                          }
                          className="text-purple-600 cursor-pointer"
                        />
                        <span className="text-gray-600">{range}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Message - Show sorting priority */}
              {(tempFilters.balanceSort || tempFilters.rank || tempFilters.hasDeposit || tempFilters.hasLoan) && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-xs text-purple-800">
                    <strong>Sort Priority:</strong>
                    {tempFilters.balanceSort && (
                      <> Sort by Balance ({tempFilters.balanceSort}) first (excluding 0 balance)</>
                    )}
                    {!tempFilters.balanceSort && tempFilters.hasDeposit && (
                      <> Filter by Deposit ({tempFilters.hasDeposit}) first</>
                    )}
                    {!tempFilters.balanceSort && !tempFilters.hasDeposit && tempFilters.hasLoan && (
                      <> Filter by Loan ({tempFilters.hasLoan}) first</>
                    )}
                    {(tempFilters.balanceSort || tempFilters.hasDeposit || tempFilters.hasLoan) && tempFilters.rank && (
                      <>, then sort by Rank ({tempFilters.rank})</>
                    )}
                    {!tempFilters.balanceSort && !tempFilters.hasDeposit && !tempFilters.hasLoan && tempFilters.rank && (
                      <> Sort by Rank ({tempFilters.rank}) only</>
                    )}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setTempFilters(defaultFilters);
                    if (onApply) onApply(defaultFilters);
                    onClose();
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;