import { useEffect, useState } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import StatCard from "../common/StatCard";

const Sidebar = () => {
  const { statsData, isLoading } = useDashboard();

  const [animate, setAnimate] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const [navHeight, setNavHeight] = useState(0);

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

  useEffect(() => {
    const updateNavHeight = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        const height = nav.getBoundingClientRect().height;
        setNavHeight(height);
      }
    };

    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
    };

    // Initial setup
    updateNavHeight();
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateNavHeight);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateNavHeight);
    };
  }, []);

  if (isLoading) {
    return (
      <>
        {/* mobile: horizontal compact stats strip while loading */}
        <div className="w-full bg-[#F3E8FF] p-4 rounded-lg shadow-sm flex gap-3 overflow-x-auto lg:hidden scrolling-touch show-scrollbar" 
             style={{ WebkitOverflowScrolling: 'touch' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-36 h-20 rounded-lg bg-purple-200/40 animate-pulse" />
          ))}
        </div>

        {/* desktop: full sidebar loading state */}
        <div className="hidden lg:block w-40 bg-[#F3E8FF] p-8 space-y-4 rounded-[15px] self-start shrink-0 h-auto animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-purple-200 rounded-sm"></div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* mobile: compact horizontal strip */}
      <div className="w-full bg-[#F3E8FF] p-4 rounded-lg shadow-sm overflow-x-auto lg:hidden scrolling-touch show-scrollbar" 
           style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex gap-2 w-max">
          {statsData.slice(0, 6).map((item, idx) => (
            <div
              key={item.id || idx}
              className={`w-30 shrink-0 rounded-lg p-2 text-white ${item.bgColor || 'bg-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-white">{item.value}</div>
                  <div className="text-xs text-white/90">{item.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* desktop: full sidebar with smooth scroll behavior */}
      <div
        className={`hidden lg:block w-48 bg-[#F3E8FF] p-3 space-y-3 rounded-[15px] overflow-y-auto self-start shrink-0 fixed left-4 lg:left-6 transition-all duration-300 ease-in-out ${
          scrolled ? 'shadow-lg' : 'shadow-sm'
        }`}
        style={{
          top: scrolled ? 0 : `100px`,
          height: scrolled ? '100vh' : `calc(100vh - ${navHeight}px - 10px)`,
          zIndex: 30
        }}
      >
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
    </>
  );
};

export default Sidebar;