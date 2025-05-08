import React, { useRef, useEffect } from 'react';
import TabItem from './tabItem';

interface TabGroupProps {
  tabs: string[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
  activeBg?: string;
  inactiveBg?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
}

const TabGroup: React.FC<TabGroupProps> = ({
  tabs,
  selectedTab,
  onTabChange,
  activeBg = 'bg-white',
  inactiveBg = 'bg-gray-100',
  activeTextColor = 'text-blue-600',
  inactiveTextColor = 'text-gray-700',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const idx = tabs.findIndex(tab => tab === selectedTab);
    const node = itemRefs.current[idx];
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selectedTab, tabs]);

  return (
    <div ref={containerRef} className="overflow-x-auto w-full max-w-full scrollbar-x">
  <div className="flex gap-2 p-3 rounded-3xl w-max min-w-full bg-[#F7F7F7] border border-[#F7F7F7]">
    {tabs.map((tab, i) => (
      <div key={tab} ref={el => { itemRefs.current[i] = el; }}>
        <TabItem
          label={tab}
          isSelected={selectedTab === tab}
          onClick={() => onTabChange(tab)}
          activeBg={activeBg}
          inactiveBg={inactiveBg}
          activeTextColor={activeTextColor}
          inactiveTextColor={inactiveTextColor}
        />
      </div>
    ))}
  </div>
</div>

  );
};

export default TabGroup;
