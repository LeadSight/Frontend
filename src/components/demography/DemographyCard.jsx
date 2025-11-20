import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const statusColor = (value, type) => {
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
    if (n <= 0) return 'bg-red-500';
    if (n < 50) return 'bg-yellow-400';
    return 'bg-green-500';
  }
  return 'bg-green-500';
};

const DemographyCard = ({ customer }) => {
  if (!customer) return null;

  const demographics = [
    { label: 'Age', value: customer.age, type: 'age' },
    { label: 'Job', value: customer.job, type: 'text' },
    { label: 'Balance', value: customer.balance, type: 'numeric' },
    { label: 'Contact Duration', value: customer.duration, type: 'numeric' },
    { label: 'Total Campaign', value: customer.campaign, type: 'numeric' },
    { label: 'Total Contact', value: customer.previous, type: 'numeric' },
    { label: 'Last Campaign', value: customer.poutcome, type: 'text' },
    { label: 'Price Index', value: customer.cons_price_idx ?? customer['cons.price.idx'], type: 'numeric' },
    { label: 'Confidence Index', value: customer.cons_conf_idx ?? customer['cons.conf.idx'], type: 'numeric' },
  ];

  const probability = customer.probability || '0%';

  return (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{customer.customerId}</CardTitle>
            <p className="text-sm text-gray-600">{customer.customerName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-lg">{customer.category || 'Unknown'}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Demografi</h4>
            <ul className="space-y-1 text-sm">
              {demographics.map((d) => (
                <li key={d.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`${statusColor(d.value, d.type)} w-3 h-3 rounded-full shrink-0`} />
                    <span className="text-gray-700">{d.label}</span>
                  </div>
                  <span className="text-gray-600 truncate max-w-[120px]">{d.value ?? '-'}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ml-4 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {probability}
            </div>
            <div className="text-xs text-gray-500 mt-2">Score</div>
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-md p-3">
          <h5 className="font-semibold text-gray-800 text-sm">AI Insight</h5>
          <p className="text-xs text-gray-600 mt-2">No insight available</p>
        </div>

        <div className="mt-4 text-xs text-gray-600">
          <div className="font-semibold mb-2">Legend :</div>
          <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-red-500" /> <span>Red : Need Improvement / Below Average</span></div>
          <div className="flex items-center space-x-2 mt-1"><span className="w-3 h-3 rounded-full bg-green-500" /> <span>Green : Good</span></div>
          <div className="flex items-center space-x-2 mt-1"><span className="w-3 h-3 rounded-full bg-yellow-400" /> <span>Yellow : Need Action</span></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemographyCard;
