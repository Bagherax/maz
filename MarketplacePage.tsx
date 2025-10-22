import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Ad, SortOption, DisplayMode } from '../../types';
import MarketplaceControls, { Filters } from './components/browsing/MarketplaceControls';
import Pagination from '../../components/Pagination';
import { useDisplayMode } from '../../hooks/useDisplayMode';
import { useSorting } from '../../hooks/useSorting';
import MarketplaceToolbar from './components/browsing/MarketplaceToolbar';
import AdGrid from './components/ads/AdGrid';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useLocalStorage } from '../../hooks/usePersistentState';

const ADS_PER_PAGE = 12;

interface MarketplacePageProps {
    filters: Filters;
    onFilterChange: (newFilters: Partial<Filters>) => void;
    onResetFilters: () => void;
    isFilterSidebarOpen: boolean;
    setIsFilterSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MarketplacePage: React.FC<MarketplacePageProps> = ({
    filters,
    onFilterChange,
    onResetFilters,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
}) => {
    const { ads, users } = useMarketplace();
    const { displayMode, setDisplayMode } = useDisplayMode();
    const [sortBy, setSortBy] = useLocalStorage<SortOption>('marketplaceSortBy', 'date-new-old');
    const [currentPage, setCurrentPage] = useState(1);
    const { location: userLocation, error: locationError } = useGeolocation();
    
    const filteredAds = useMemo(() => {
        return ads.filter(ad => {
            const { query, categories, condition, priceRange, sellerTiers } = filters;
            const seller = users.find(u => u.id === ad.seller.id);

            if (ad.status !== 'active') return false;
            if (query && !ad.title.toLowerCase().includes(query.toLowerCase()) && !ad.description.toLowerCase().includes(query.toLowerCase())) return false;
            if (categories.length > 0 && !categories.includes(ad.category)) return false;
            if (condition !== 'all' && ad.condition !== condition) return false;
            if (ad.price < priceRange[0] || ad.price > priceRange[1]) return false;
            if (sellerTiers.length > 0 && (!seller || !sellerTiers.includes(seller.tier))) return false;
            
            return true;
        });
    }, [ads, filters, users]);
    
    const sortedAds = useSorting(filteredAds, sortBy, userLocation);

    const totalPages = Math.ceil(sortedAds.length / ADS_PER_PAGE);
    const paginatedAds = sortedAds.slice((currentPage - 1) * ADS_PER_PAGE, currentPage * ADS_PER_PAGE);

    const handleFilterChangeWithReset = (newFilters: Partial<Filters>) => {
        onFilterChange(newFilters);
        setCurrentPage(1);
    };

    const handleResetWithReset = () => {
        onResetFilters();
        setCurrentPage(1);
    }

    const isLocationAvailable = !!userLocation && !locationError;

    return (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-8">
            <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block lg:col-span-1">
                    <MarketplaceControls
                        filters={filters}
                        onFilterChange={handleFilterChangeWithReset}
                        onReset={handleResetWithReset}
                    />
                </aside>

                 {/* Mobile Filter Drawer */}
                <div className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${isFilterSidebarOpen ? 'bg-black/60' : 'bg-transparent pointer-events-none'}`} onClick={() => setIsFilterSidebarOpen(false)}>
                    <div 
                        className={`transform transition-transform duration-300 ease-in-out w-full max-w-xs h-full bg-gray-50 dark:bg-gray-900 p-4 overflow-y-auto shadow-2xl ${isFilterSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <MarketplaceControls
                            filters={filters}
                            onFilterChange={handleFilterChangeWithReset}
                            onReset={handleResetWithReset}
                        />
                    </div>
                </div>

                <div className="lg:col-span-3 mt-8 lg:mt-0">
                    <MarketplaceToolbar
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        displayMode={displayMode}
                        onDisplayModeChange={setDisplayMode}
                        resultsCount={sortedAds.length}
                        isLocationAvailable={isLocationAvailable}
                    />

                    {paginatedAds.length > 0 ? (
                        <>
                            <AdGrid ads={paginatedAds} displayMode={displayMode} />
                            <div className="mt-8">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
                            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No results found</h2>
                            <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarketplacePage;