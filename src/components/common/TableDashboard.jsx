import ProbabilityScore from "../table/ProbabilityScore";
import TableBase from "./TableBase";

// TAMBAHKAN: expandedRow dan renderExpanded di sini
const TableDashboard = ({
  data = [],
  onRowClick,
  expandedRow = null,
  renderExpanded = null,
}) => {
  const columns = [
    {
      key: "originalRank",
      label: "Rank",
      render: (r) => r.originalRank ?? "-",
    },
    { key: "customerId", label: "Cust. ID" },
    { key: "customerName", label: "Cust. Name" },
    {
      key: "hasLoan",
      label: "Loan",
      render: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            r.hasLoan === "Yes"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {r.hasLoan}
        </span>
      ),
    },
    {
      key: "hasDeposit",
      label: "Deposite",
      render: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            r.hasDeposit === "Yes"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {r.hasDeposit}
        </span>
      ),
    },
    {
      key: "housing",
      label: "Housing",
      render: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            r.housing === "yes"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {r.housing === "yes" ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "hasDefault",
      label: "Default",
      render: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            r.hasDefault === "Yes"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {r.hasDefault}
        </span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            r.category === "Priority"
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {r.category}
        </span>
      ),
    },
    {
      key: "probability",
      label: "Probability Score",
      render: (r) => <ProbabilityScore percentage={r.probability} />,
    },
  ];

  // TERUSKAN props tersebut ke TableBase
  return (
    <TableBase
      columns={columns}
      data={data}
      rowKey={"id"}
      onRowClick={onRowClick}
      expandedRow={expandedRow} // <--- PENTING
      renderExpanded={renderExpanded} // <--- PENTING
    />
  );
};

export default TableDashboard;
