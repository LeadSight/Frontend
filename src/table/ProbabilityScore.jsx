import React from 'react';

const ProbabilityScore = ({ percentage }) => {
  const score = parseInt(percentage.replace('%', ''));
  
  // Score Color
  const getColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-green-400';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Progress Bar */}
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor(score)} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      {/* Percentage Text */}
      <span className="text-sm font-semibold text-gray-700 min-w-[3rem]">
        {percentage}
      </span>
    </div>
  );
};

export default ProbabilityScore;