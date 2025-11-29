import { useMemo, useState } from "react";

// Components
import ExpandedRowContent from "../components/common/ExpandedRowContent";
import Pagination from "../components/common/Pagination";
import SearchBar from "../components/common/SearchBar";
import TableDashboard from "../components/common/TableDashboard";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import LoadingScreen from "../components/LoadingScreen";
import NoteModal from "../components/notes/NoteModal";

// Top Charts
import { CampaignChart } from "../components/dashboard/CampaignChart";
import { SegmentationChart } from "../components/dashboard/SegmentationChart";
import { TrendChart } from "../components/dashboard/TrendChart";

// Middle Charts (Below Table)
import { CreditStatusChart } from "../components/dashboard/CreditStatusChart";
import { JobDepositChart } from "../components/dashboard/JobDepositChart";
import { JobSaldoChart } from "../components/dashboard/JobSaldoChart";

// Bottom Charts (Campaign Efectivity)
import { ContactDistributionChart } from "../components/dashboard/ContactDistributionChart";
import { ContactDurationChart } from "../components/dashboard/ContactDurationChart";
import { ContactEfectivityChart } from "../components/dashboard/ContactEfectivityChart";
import { ContactTypeChart } from "../components/dashboard/ContactTypeChart";

// Hooks
import { useCustomerFilters } from "../hooks/useCustomerFilters";
import { useCustomers } from "../hooks/useCustomers";
import { useDashboard } from "../hooks/useDashboard";
import { useNoteManager } from "../hooks/useNoteManager";

const Dashboard = () => {
  // Ambil data
  const { customers, isLoading: customersLoading } = useCustomers();
  const { distData, isLoading: dashboardLoading } = useDashboard();

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  const filters = useMemo(() => ({}), []);
  const safeCustomers = customers || [];
  const filteredCustomers = useCustomerFilters(
    safeCustomers,
    searchTerm,
    filters
  );

  const {
    showNoteModal,
    noteTitle,
    setNoteTitle,
    noteContent,
    setNoteContent,
    editingNote,
    handleSaveNote,
    closeNoteModal,
    handleAddNote,
    handleEditNote,
    handleDeleteNote,
  } = useNoteManager(safeCustomers, () => {});

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // =====================================================================
  // DATA MAPPING
  // =====================================================================

  // 1. SEGMENTATION
  const segmentationData = useMemo(() => {
    if (!safeCustomers) return [];
    const priority = safeCustomers.filter(
      (c) => c.category === "Priority"
    ).length;
    const nonPriority = safeCustomers.filter(
      (c) => c.category === "Non Priority" || c.category === "Non-Priority"
    ).length;
    const others = Math.max(0, safeCustomers.length - priority - nonPriority);
    return [
      { name: "Priority", value: priority },
      { name: "Not Priority", value: nonPriority },
      { name: "Others", value: others },
    ].filter((d) => d.value > 0);
  }, [safeCustomers]);

  // 2. CAMPAIGN RATE
  const campaignData = useMemo(() => {
    if (!distData?.campaignDistribution) return [];
    const entries = Object.entries(distData.campaignDistribution);
    let c1 = 0,
      c2 = 0,
      c3 = 0,
      cMore = 0;
    entries.forEach(([campaignCount, total]) => {
      const count = Number(campaignCount);
      if (count === 1) c1 += total;
      else if (count === 2) c2 += total;
      else if (count === 3) c3 += total;
      else cMore += total;
    });
    return [
      { name: "1x Contact", value: c1 },
      { name: "2x Contacts", value: c2 },
      { name: "3x Contacts", value: c3 },
      { name: ">3x Contacts", value: cMore },
    ].filter((d) => d.value > 0);
  }, [distData]);

  // 3. TREND CHART
  const trendData = useMemo(() => {
    if (!distData?.promotionTrends?.daily) return [];
    return distData.promotionTrends.daily.map((item) => ({
      name: item.day.charAt(0).toUpperCase() + item.day.slice(1),
      current: item.total_contacted,
      last: Math.round(item.total_contacted * 0.7),
    }));
  }, [distData]);

  // 4. JOB DEPOSIT CHART
  const jobDepositData = useMemo(() => {
    if (!distData?.jobDepositDistribution) return [];
    return distData.jobDepositDistribution.slice(0, 7).map((item) => ({
      name: item.job,
      deposit: item.total_deposit_subscribers,
    }));
  }, [distData]);

  // 5. JOB SALDO CHART
  const jobSaldoData = useMemo(() => {
    if (!distData?.topAverageBalanceByJob) return [];
    return distData.topAverageBalanceByJob.slice(0, 6).map((item) => ({
      job: item.job,
      saldo: item.avg_deposit_balance,
    }));
  }, [distData]);

  // 6. CREDIT STATUS CHART (NEW!)
  const creditStatusData = useMemo(() => {
    if (!safeCustomers || safeCustomers.length === 0) return [];

    // Kita buat Range (Binning) berdasarkan Balance
    const ranges = [
      { label: "0 - 500", min: 0, max: 500 },
      { label: "500 - 1k", min: 500, max: 1000 },
      { label: "1k - 1.5k", min: 1000, max: 1500 },
      { label: "1.5k - 2k", min: 1500, max: 2000 },
      { label: "> 2k", min: 2000, max: 9999999 },
    ];

    // Inisialisasi hasil
    const result = ranges.map((r) => ({ name: r.label, macet: 0, lancar: 0 }));

    safeCustomers.forEach((customer) => {
      const bal = customer.balance || 0;
      // Cari customer masuk range mana
      const rangeIndex = ranges.findIndex((r) => bal >= r.min && bal < r.max);

      if (rangeIndex !== -1) {
        // Jika default 'yes' = Macet, jika 'no' = Lancar
        if (customer.default === "yes") {
          result[rangeIndex].macet += 1;
        } else {
          result[rangeIndex].lancar += 1;
        }
      }
    });

    return result;
  }, [safeCustomers]);

  // =====================================================================

  const totalItems = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentTableData = filteredCustomers.slice(startIndex, endIndex);

  const toggleRow = (customerId) => {
    setExpandedRow((prev) => (prev === customerId ? null : customerId));
  };

  const CAMPAIGN_COLORS = ["#6366f1", "#06b6d4", "#f59e0b", "#64748b"];

  if (customersLoading || dashboardLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      <Navbar />

      <div className="flex flex-1 p-6 gap-6 overflow-hidden">
        <div className="shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col gap-6 overflow-y-auto h-[calc(100vh-100px)] pr-2 scrollbar-hide min-w-[1300px]">
          {/* --- 1. TOP CHARTS --- */}
          <div className="flex flex-row gap-6 w-full h-[280px]">
            {/* Kartu Ungu */}
            <div className="w-1/2 bg-gradient-to-br from-[#bd76f6] to-[#7c3aed] rounded-2xl p-6 shadow-lg text-white relative overflow-hidden flex flex-col justify-between">
              <h3 className="text-sm font-medium opacity-90 z-10">
                Cust. Segmentation Distribution
              </h3>
              <div className="flex-1 flex flex-row items-center justify-center gap-8 relative z-10 pl-2">
                <div className="scale-110 shrink-0">
                  <SegmentationChart data={segmentationData} />
                </div>
                <div className="flex flex-col gap-4">
                  {segmentationData.slice(0, 2).map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full shadow-sm ring-2 ring-white/20 ${
                          idx === 0 ? "bg-[#fbbf24]" : "bg-[#2dd4bf]"
                        }`}
                      ></span>
                      <div>
                        <div className="text-xl font-bold leading-none">
                          {item.value}
                        </div>
                        <div className="text-xs opacity-80">{item.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute top-[-50%] right-[-10%] w-80 h-80 bg-white opacity-10 rounded-full blur-[80px] pointer-events-none"></div>
            </div>

            {/* Kartu Putih */}
            <div className="w-1/2 bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700">
                Campaign Rate Distribution
              </h3>
              <div className="flex-1 flex flex-row items-center justify-center gap-8">
                <div className="scale-110 shrink-0">
                  <CampaignChart data={campaignData} />
                </div>
                <div className="flex flex-col gap-4">
                  {campaignData.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span
                        className="w-2 h-2 rounded-full shadow-sm shrink-0"
                        style={{
                          backgroundColor:
                            CAMPAIGN_COLORS[idx % CAMPAIGN_COLORS.length],
                        }}
                      ></span>
                      <div>
                        <div className="text-xl font-bold leading-none text-gray-800">
                          {item.value}
                        </div>
                        <div className="text-xs text-gray-500">{item.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- 2. TREND CHART --- */}
          <div className="bg-[#1a1b2e] rounded-2xl p-6 shadow-lg text-white">
            <h3 className="text-lg font-medium mb-4">Promotion Trends</h3>
            <TrendChart data={trendData} />
          </div>

          {/* --- 3. TABLE --- */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">Customer Rank</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden pt-4">
              <div className="flex justify-between items-center px-4 mb-2 gap-4">
                <div className="w-full">
                  <SearchBar
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Type here..."
                  />
                </div>
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition shadow-md font-medium">
                  Filter
                </button>
              </div>
              <TableDashboard
                data={currentTableData}
                onRowClick={(customer) => toggleRow(customer.id)}
                expandedRow={expandedRow}
                renderExpanded={(row) => (
                  <ExpandedRowContent
                    customer={row}
                    onAddNote={() => {}}
                    onEditNote={() => {}}
                    onDeleteNote={() => {}}
                    hideNotes={true}
                  />
                )}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                itemsPerPageOptions={[5, 10, 20]}
                totalItems={totalItems}
                startIndex={startIndex}
                endIndex={endIndex}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* --- 4. MIDDLE CHARTS --- */}
          <div className="flex flex-row gap-6 pb-6 w-full">
            <div className="w-2/3 flex flex-col gap-6">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-6">
                  Total Deposite by Credit Status
                </h3>
                {/* Menggunakan Data Real */}
                <CreditStatusChart data={creditStatusData} />
              </div>
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-6">
                  Total Deposite by Job
                </h3>
                <JobDepositChart data={jobDepositData} />
              </div>
            </div>
            <div className="w-1/3">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200 h-full flex flex-col">
                <h3 className="text-lg font-medium text-gray-800 mb-6">
                  Top Average Saldo by job
                </h3>
                <div className="flex-1 flex flex-col justify-center">
                  <JobSaldoChart data={jobSaldoData} />
                </div>
              </div>
            </div>
          </div>

          {/* --- 5. CAMPAIGN EFECTIVITY --- */}
          <div className="pt-2 pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Campaign Efectivity
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-4">
                  Contact Duration
                </h4>
                <ContactDurationChart />
              </div>
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-4">
                  Contact Efectivity
                </h4>
                <ContactEfectivityChart />
              </div>
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-4">
                  Contact Distribution each Month
                </h4>
                <ContactDistributionChart />
              </div>
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-4">
                  Type of Contact
                </h4>
                <ContactTypeChart />
              </div>
            </div>
          </div>
        </div>
      </div>

      <NoteModal
        show={showNoteModal}
        onClose={closeNoteModal}
        onSave={handleSaveNote}
        noteTitle={noteTitle}
        setNoteTitle={setNoteTitle}
        noteContent={noteContent}
        setNoteContent={setNoteContent}
        editingNote={editingNote}
      />
    </div>
  );
};

export default Dashboard;
