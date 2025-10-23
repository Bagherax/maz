import React from 'react';
import Icon from '../../../../components/Icon';
import { useTheme } from '../../../../hooks/useTheme';

interface AdQuickActionsProps {
  adId: string;
}

const AdQuickActions: React.FC<AdQuickActionsProps> = ({ adId }) => {
  const { theme, toggleTheme } = useTheme();

  const handleActionClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    alert(`${action} for Ad ID: ${adId} is coming soon!`);
  };
  
  const handleThemeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTheme();
  };

  const buttonClass = "flex-1 flex flex-col items-center justify-center text-white text-[10px] font-semibold hover:bg-white/20 p-1 rounded-md transition-colors";

  return (
    <div className="flex items-center justify-around gap-1 w-full h-full">
      <button className={buttonClass} onClick={(e) => handleActionClick(e, 'Paid Boost')}>
        <Icon name="rocket-launch" className="w-4 h-4 mb-0.5" />
        <span>Boost</span>
      </button>
      <button className={buttonClass} onClick={(e) => handleActionClick(e, 'Social Media Boost')}>
        <Icon name="share" className="w-4 h-4 mb-0.5" />
        <span>Social</span>
      </button>
      <button className={buttonClass} onClick={handleThemeToggle}>
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="w-4 h-4 mb-0.5" />
        <span>Theme</span>
      </button>
      <button className={buttonClass} onClick={(e) => handleActionClick(e, 'Quick Similar Ad')}>
        <Icon name="plus" className="w-4 h-4 mb-0.5" />
        <span>Similar</span>
      </button>
    </div>
  );
};

export default AdQuickActions;
