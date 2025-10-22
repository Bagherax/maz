
import React from 'react';
import { Ad, DisplayMode } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import Icon from '../../../../components/Icon';
import { useAuth } from '../../../../hooks/useAuth';
import UserTierBadge from '../users/UserTierBadge';
import SeeMoreButton from '../../../../components/SeeMoreButton';
import { useView } from '../../../../App';


interface AdCardProps {
  ad: Ad;
  displayMode: DisplayMode;
  onExpandClick: () => void;
}

const AdCard: React.FC<AdCardProps> = ({ ad, displayMode, onExpandClick }) => {
  const { language } = useLocalization();
  const { toggleLike, isLiked } = useMarketplace();
  const { getUserById } = useAuth();
  const { setView } = useView();

  const seller = getUserById(ad.seller.id);

  // --- Smart Routing Simulation ---
  const isSellerOnline = React.useMemo(() => Math.random() > 0.3, [ad.id]);
  const mediaSource = (isSellerOnline || !seller?.cloudSync?.isEnabled || seller.cloudSync.provider === 'none') 
    ? 'P2P' 
    : seller.cloudSync.provider === 'google-drive' ? 'Cloud' : 'Cloud';

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(ad.id);
  };
  
  const isCompact = displayMode === 'compact';
  const isDetailed = displayMode === 'detailed';

  const imageSizeClass = isCompact ? 'h-32' : isDetailed ? 'h-64' : 'h-48';
  const paddingClass = isCompact ? 'p-2' : 'p-4';

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col" 
      onClick={onExpandClick}
    >
      <div className="relative">
        <img src={ad.images[0]} alt={ad.title} className={`${imageSizeClass} w-full object-cover`} />
        
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center space-x-1">
          <Icon name={mediaSource === 'P2P' ? 'share-network' : 'cloud-arrow-up'} className="w-3 h-3" />
          <span>{mediaSource}</span>
        </div>

        <button 
          onClick={handleLike}
          aria-label="Like ad"
          className="absolute top-2 right-2 bg-white/70 dark:bg-gray-900/70 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <Icon name="heart" className={`w-5 h-5 transition-colors ${isLiked(ad.id) ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300'}`} />
        </button>

        <SeeMoreButton onClick={onExpandClick} />

        {!isCompact && seller && (
            <div className="absolute bottom-2 left-2">
                <UserTierBadge tier={seller.tier} />
            </div>
        )}
      </div>
      <div className={`${paddingClass} flex-grow flex flex-col`}>
        {!isCompact && <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{ad.category}</p>}
        <h3 className={`font-semibold truncate text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-1 ${isCompact ? 'text-sm' : 'text-lg'}`}>{ad.title}</h3>
        
        {!isCompact && (
            <div className="flex-grow mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                {ad.location.city}, {ad.location.country}
                </p>
                {isDetailed && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{ad.description}</p>
                )}
            </div>
        )}

        <div className={`flex justify-between items-center ${isCompact ? 'mt-1' : 'mt-4'}`}>
          <p className={`text-indigo-500 dark:text-indigo-400 font-bold ${isCompact ? 'text-base' : 'text-xl'}`}>
            {new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency, notation: isCompact ? 'compact' : 'standard' }).format(ad.price)}
          </p>
          {!isCompact && seller && (
            <div className="flex items-center space-x-2 rtl:space-x-reverse hover:opacity-80" onClick={(e) => { e.stopPropagation(); setView({type: 'profile', id: seller.id })}}>
             <img className="h-8 w-8 rounded-full" src={seller.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${seller.name}`} alt={seller.name} />
             {!isDetailed && (
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{seller.name}</p>
                    <p className="text-xs text-gray-500 flex items-center justify-end">{seller.rating.toFixed(1)} <Icon name="heart" className="w-3 h-3 ml-0.5 fill-current text-amber-500" /></p>
                </div>
             )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdCard;