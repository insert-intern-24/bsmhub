import React from 'react'

interface SortToggleButtonProps {
  label: string;
  selectedTab: string;
  onClick: () => void;
}

const SortToggleButton: React.FC<SortToggleButtonProps> = ({ label, selectedTab, onClick }) => {
  return (
    <div
      className={`flex px-2 py-4 justify-center items-center gap-[0.625rem] self-stretch rounded-lg font-pretendard text-base font-normal leading-none cursor-pointer ${
        selectedTab === label ? "bg-white text-black" : "text-black"
      }`}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

export default SortToggleButton