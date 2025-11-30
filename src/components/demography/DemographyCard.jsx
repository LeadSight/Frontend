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
    { label: 'Contact Duration', value: customer.duration, type: 'numeric', key: 'duration' },
    { label: 'Total Campaign', value: customer.campaign, type: 'numeric' },
    { label: 'Total Contact', value: customer.previous, type: 'numeric' },
    { label: 'Poutcome', value: customer.poutcome, type: 'text' },
    { label: 'Price Index', value: customer.cons_price_idx ?? customer['cons.price.idx'], type: 'numeric' },
    { label: 'Confidence Index', value: customer.cons_conf_idx ?? customer['cons.conf.idx'], type: 'numeric' },
  ];

  const probability = customer.probability || '0%';

  return (
    <div className="w-80 bg-gray-50 rounded-lg p-4 shadow-sm border">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">{customer.customerId}</h3>
          <p className="text-sm text-gray-600">{customer.customerName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-lg">{customer.category || 'Unknown'}</span>
        </div>
      </div>

      <hr className="my-3" />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Demografi</h4>
          <ul className="space-y-1 text-sm">
            {demographics.map((d) => (
              <li key={d.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`${statusColor(d.value, d.type)} w-3 h-3 rounded-full flex-shrink-0`} />
                  <span className="text-gray-700">{d.label}</span>
                </div>
                <span className="text-gray-600 truncate max-w-[120px]" title={formatValue(d.value, d.key)}>
                  {formatValue(d.value, d.key)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ml-4 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {probability}
          </div>
          <div className="text-xs text-gray-500 mt-2">Skor</div>
        </div>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-md p-3">
        <h5 className="font-semibold text-gray-800 text-sm">AI Insight</h5>
        <p className="text-xs text-gray-600 mt-2">{customer.notes && customer.notes.length > 0 ? customer.notes[0].content : 'Tidak ada insight tersedia'}</p>
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <div className="font-semibold mb-2">Keterangan :</div>
        <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-red-500" /> <span>Red : Negative Value / Dibawah Rata-rata</span></div>
        <div className="flex items-center space-x-2 mt-1"><span className="w-3 h-3 rounded-full bg-green-500" /> <span>Green : Good / Above Average</span></div>
        <div className="flex items-center space-x-2 mt-1"><span className="w-3 h-3 rounded-full bg-yellow-400" /> <span>Yellow : Need Attention</span></div>
      </div>
    </div>
  );
};

export default DemographyCard;