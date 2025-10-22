import React from 'react';
import { Ad, DisplayMode } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import { useView } from '../../../../App';
import Icon from '../../../../components/Icon';
import { useAuth } from '../../../../hooks/useAuth';
import UserTierBadge from '../users/UserTierBadge';

interface AdCardProps {
  ad: Ad;
  displayMode: DisplayMode;
}

const AdCard: React.FC<AdCardProps> = ({ ad, displayMode }) => {
  const { setView } = useView();
  const { language } = useLocalization();
  const { toggleLike, isLiked } = useMarketplace();
  const { getUserById } = useAuth();
  
  const seller = getUserById(ad.seller.id);

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
      onClick={() => setView({ type: 'ad', id: ad.id })}
    >
      <div className="relative">
        <img src={ad.images[0]} alt={ad.title} className={`${imageSizeClass} w-full object-cover`} />
        <button 
          onClick={handleLike}
          aria-label="Like ad"
          className="absolute top-2 right-2 bg-white/70 dark:bg-gray-900/70 p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Icon name="heart" className={`w-5 h-5 transition-colors ${isLiked(ad.id) ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-300'}`} />
        </button>
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
                    <p className="text-xs text-gray-500">{seller.rating.toFixed(1)} ★</p>
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