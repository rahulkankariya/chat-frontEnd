import React from 'react';

interface TabItemProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  activeBg?: string;
  inactiveBg?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
}

const TabItem: React.FC<TabItemProps> = ({
  label,
  isSelected,
  onClick,
  activeBg = 'bg-white',
  inactiveBg = 'bg-gray-100',
  activeTextColor = 'text-blue-600',
  inactiveTextColor = 'text-gray-700',
}) => (
  <div
    onClick={onClick}
    className={`
      flex-shrink-0 text-sm font-bold px-4 py-1 rounded-3xl cursor-pointer transition-colors
      ${isSelected ? `${activeBg} ${activeTextColor}` : `${inactiveBg} ${inactiveTextColor} hover:bg-gray-200`}
    `}
  >
    {label}
  </div>
);

export default TabItem;