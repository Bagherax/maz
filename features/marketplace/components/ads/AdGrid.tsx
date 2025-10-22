
import React, { useState, useEffect, useRef } from 'react';
import { Ad, DisplayMode } from '../../../../types';
import AdCard from './AdCard';
import ListViewItem from '../browsing/ListViewItem';
import ExpandedAdDetail from './ExpandedAdDetail';
import { useDisplayMode } from '../../../../hooks/useDisplayMode';

interface AdGridProps {
  ads: Ad[];
  displayMode: DisplayMode;
  expandedAdId: string | null;
  onAdExpand: (adId: string | null) => void;
}

const AdGrid: React.FC<AdGridProps> = ({ ads, displayMode, expandedAdId, onAdExpand }) => {
  const { currentDisplayConfig } = useDisplayMode();
  const gridRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(4); // Default assumption for standard view

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || displayMode === 'list') return;

    // Function to calculate columns based on grid-template-columns
    const updateColumns = () => {
      const gridComputedStyle = window.getComputedStyle(grid);
      const gridTemplateColumns = gridComputedStyle.getPropertyValue('grid-template-columns');
      const columnCount = gridTemplateColumns.split(' ').length;
      setColumns(columnCount);
    };

    // Initial calculation
    updateColumns();
    
    // Use ResizeObserver to detect changes in grid layout
    const resizeObserver = new ResizeObserver(updateColumns);
    resizeObserver.observe(grid);

    // Also listen for window resize as a fallback
    window.addEventListener('resize', updateColumns);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateColumns);
    };
  }, [displayMode]);

  if (displayMode === 'list') {
    return (
      <div className="space-y-1">
        {ads.map(ad => (
          <React.Fragment key={ad.id}>
            <ListViewItem ad={ad} onExpandClick={() => onAdExpand(ad.id)} />
            {expandedAdId === ad.id && (
              <ExpandedAdDetail ad={ad} onClose={() => onAdExpand(null)} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  const expandedAd = expandedAdId ? ads.find(ad => ad.id === expandedAdId) : null;
  const expandedIndex = expandedAdId ? ads.findIndex(ad => ad.id === expandedAdId) : -1;

  // Calculate where to insert the detail view: at the end of the row containing the expanded item.
  const insertAfterIndex = expandedIndex !== -1
    ? Math.floor(expandedIndex / columns) * columns + columns - 1
    : -1;

  const gridItems = [];
  for (let i = 0; i < ads.length; i++) {
    const ad = ads[i];
    gridItems.push(
      <AdCard
        key={ad.id}
        ad={ad}
        displayMode={displayMode}
        onExpandClick={() => onAdExpand(ad.id)}
      />
    );

    // If this is the last item in the row where the expanded view should be, inject it.
    if (i === insertAfterIndex && expandedAd) {
      gridItems.push(
        <div key="expanded-detail" style={{ gridColumn: `1 / -1` }}>
          <ExpandedAdDetail ad={expandedAd} onClose={() => onAdExpand(null)} />
        </div>
      );
    }
  }

  return (
    <div ref={gridRef} className={`grid gap-6 ${currentDisplayConfig.gridClass}`}>
      {gridItems}
    </div>
  );
};

export default AdGrid;