import React from 'react';
import { Ad, DisplayMode } from '../../../../types';
import AdCard from './AdCard';
import ListViewItem from '../browsing/ListViewItem';
import { useDisplayMode } from '../../../../hooks/useDisplayMode';

interface AdGridProps {
  ads: Ad[];
  displayMode: DisplayMode;
}

const AdGrid: React.FC<AdGridProps> = ({ ads, displayMode }) => {
  const { currentDisplayConfig } = useDisplayMode();

  if (displayMode === 'list') {
    return (
      <div className="space-y-4">
        {ads.map(ad => (
          <ListViewItem key={ad.id} ad={ad} />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${currentDisplayConfig.gridClass}`}>
      {ads.map(ad => (
        <AdCard key={ad.id} ad={ad} displayMode={displayMode} />
      ))}
    </div>
  );
};

export default AdGrid;
