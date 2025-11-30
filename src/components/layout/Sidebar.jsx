import React, { useState, useEffect } from 'react';
import StatCard from '../common/StatCard';
import { statsData } from '../../data/statsData';

const Sidebar = () => {
  const [animate, setAnimate] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      statsData.forEach((stat, index) => {
        setTimeout(() => {
          setAnimate(prev => ({ ...prev, [stat.id]: true }));
        }, index * 200);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-44 bg-linear-to-b from-purple-100 to-purple-100 p-4 space-y-4 rounded-3xl sticky top-4 self-start shrink-0">
      {statsData.map((item, index) => (
        <StatCard
          key={item.id}
          title={item.title}
          value={item.value}
          trend={item.trend}
          bgColor={item.bgColor}
          animate={animate[item.id]}
          delay={index * 100}
        />
      ))}
    </div>
  );
};

export default Sidebar;