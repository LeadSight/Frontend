import { useEffect, useState } from "react";
// PERBAIKAN PATH IMPORT:
import { useDashboard } from "../../hooks/useDashboard";
import StatCard from "../common/StatCard";

const Sidebar = () => {
  const { statsData, isLoading } = useDashboard();

  const [animate, setAnimate] = useState({});

  useEffect(() => {
    if (statsData && statsData.length > 0) {
      const timer = setTimeout(() => {
        statsData.forEach((stat, index) => {
          setTimeout(() => {
            setAnimate((prev) => ({ ...prev, [stat.id]: true }));
          }, index * 200);
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [statsData]);

  if (isLoading) {
    return (
      <div className="w-48 bg-[#F3E8FF] p-3 space-y-4 rounded-[30px] sticky top-4 self-start shrink-0 h-screen animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-purple-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-48 bg-[#F3E8FF] p-3 space-y-4 rounded-[30px] sticky top-4 self-start shrink-0 h-fit shadow-sm">
      {statsData.map((item, index) => (
        <StatCard
          key={item.id || index}
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
