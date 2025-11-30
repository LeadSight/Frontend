import React from 'react';

const statusColor = (value, type) => {
  // status dot color
  if (type === 'boolean') return value === 'Yes' || value === 'yes' || value === true ? 'bg-green-500' : 'bg-red-500';
  if (type === 'probability') {
    const v = parseInt(String(value).replace('%', '')) || 0;
    if (v >= 70) return 'bg-green-500';
    if (v >= 50) return 'bg-yellow-400';
    return 'bg-red-500';
  }
  if (type === 'age') {
    const a = Number(value) || 0;
    if (a >= 30 && a <= 60) return 'bg-green-500';
    if (a > 60) return 'bg-yellow-400';
    return 'bg-green-500';
  }
  if (type === 'numeric') {
    const n = Number(String(value).replace(/[^0-9.-]+/g, '')) || 0;
    if (n < 0) return 'bg-red-500';
    if (n >= 0 && n < 1000) return 'bg-yellow-400';
    return 'bg-green-500';
  }
  return 'bg-green-500';
};

const formatValue = (value, key) => {
  if (value === undefined || value === null) return '-';
  
  // Format balance
  if (key === 'balance') {
    const numValue = Number(value);
    if (isNaN(numValue)) return String(value);
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numValue);
  }
  
  // Format duration (detik)
  if (key === 'duration') {
    return `${value}s`;
  }
  
  return String(value);
};

const DemographyCard = ({ customer }) => {
  if (!customer) return null;

  const demographics = [
    { label: 'Age', value: customer.age, type: 'age' },
    { label: 'Job', value: customer.job, type: 'text' },
    { label: 'Balance', value: customer.balance, type: 'numeric', key: 'balance' },
    { label: 'Campaign Status', value: customer.poutcome, type: 'text' },
    { label: 'Total Campaign', value: customer.campaign, type: 'numeric' },
    { label: 'Total Contact', value: customer.previous, type: 'numeric' },
    { label: 'Contact Duration', value: customer.duration, type: 'numeric', key: 'duration' },
    { label: 'Price Index', value: customer.cons_price_idx ?? customer['cons.price.idx'], type: 'numeric' },
    { label: 'Confidence Index', value: customer.cons_conf_idx ?? customer['cons.conf.idx'], type: 'numeric' },
  ];

  const probability = customer.probability || '0%';

  return (
    <div className="w-full bg-gray-50 rounded-lg p-6 border-2">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* top row: customerId (expandable) and badge to the right */}
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold truncate mr-3 w-full" title={customer.customerId}>{customer.customerId}</h3>
            {/* badge: purple when Priority, gray when not */}
            {(() => {
              const cat = (customer.category || '').toString();
              const isPriority = cat.trim().toLowerCase() === 'priority';
              return (
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 ml-2 ${isPriority ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {cat || 'Unknown'}
                </span>
              );
            })()}
          </div>
          <p className="text-sm font-semibold text-gray-600 mt-3">{customer.customerName}</p>
        </div>
      </div>

      {/* simple non-blurred separator */}
      <div className="border-t border-gray-300 my-4 opacity-100" />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Demografi</h4>
          <ul className="space-y-1 text-sm">
            {demographics.map((d) => (
              <li key={d.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {d.label === 'Age' || d.label === 'Job' ? (
                    <span className="w-3 h-3 rounded-full shrink-0 invisible" />
                  ) : (
                    <span className={`${statusColor(d.value, d.type)} w-3 h-3 rounded-full shrink-0`} />
                  )}
                  <span className="text-gray-700">{d.label}</span>
                </div>
                <span className="text-gray-600 truncate max-w-[220px] text-right" title={formatValue(d.value, d.key)}>
                  {formatValue(d.value, d.key)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ml-7 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
            {probability}
          </div>
          <div className="text-xs font-semibold text-gray-500 mt-2">Skor</div>
        </div>
      </div>

        <div className="mt-4 w-full bg-amber-50 border border-amber-100 rounded-md p-3">
          <h5 className="font-semibold text-gray-800 text-sm">AI Insight</h5>
          {/* For now AI insight is a dedicated field on customer object when available.
              Do not read from notes -- fall back to the placeholder string if missing. */}
          {(() => {
            const insight = (customer.aiInsight ?? customer.insight ?? null);
            return (
              <p className="text-sm text-gray-700 mt-2 text-left whitespace-pre-wrap wrap-break-word">
                {insight && String(insight).trim().length > 0 ? String(insight).trim() : 'No insights available.'}
              </p>
            );
          })()}
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <div className="font-semibold mb-2">Information :</div>
        <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-red-500" /> <span>Red : Negative Value / Underperforming</span></div>
        <div className="flex items-center space-x-2 mt-1"><span className="w-3 h-3 rounded-full bg-green-500" /> <span>Green : Good / High-Performing</span></div>
        <div className="flex items-center space-x-2 mt-1"><span className="w-3 h-3 rounded-full bg-yellow-400" /> <span>Yellow : Need Attention</span></div>
      </div>
    </div>
  );
};

export default DemographyCard;