import React, { createContext, ReactNode, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { MarketplaceContextType, Ad, User, Comment, MarketplaceState, Category, UserTier, Report, ModerationItem, Review, AdminConfig } from '../types';
import { useAuth } from '../hooks/useAuth';
import { MOCK_ADS, MOCK_SELLERS } from '../data/mockAds';
import { useLocalStorage } from '../hooks/usePersistentState';
import { usePersistentSet } from '../hooks/usePersistentSetState';
import { useIndexedDB } from '../hooks/useIndexedDB';

export const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

// --- MOCK DATA GENERATION ---

const USER_TIERS: UserTier[] = [
    { level: 'normal', benefits: { maxAds: 5, imageSlots: 3, videoUpload: false, featuredAds: 0, adDuration: 30, analytics: false, customThemes: false, prioritySupport: false, revenueShare: 0 }, requirements: { minTransactions: 0, minRating: 0, minActivity: 0 } },
    { level: 'bronze', benefits: { maxAds: 15, imageSlots: 5, videoUpload: false, featuredAds: 1, adDuration: 45, analytics: true, customThemes: false, prioritySupport: false, revenueShare: 0 }, requirements: { minTransactions: 10, minRating: 4.0, minActivity: 10 } },
    { level: 'silver', benefits: { maxAds: 30, imageSlots: 8, videoUpload: true, featuredAds: 3, adDuration: 60, analytics: true, customThemes: false, prioritySupport: false, revenueShare: 0 }, requirements: { minTransactions: 25, minRating: 4.2, minActivity: 25 } },
    { level: 'gold', benefits: { maxAds: 50, imageSlots: 12, videoUpload: true, featuredAds: 5, adDuration: 90, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 0 }, requirements: { minTransactions: 50, minRating: 4.5, minActivity: 50 } },
    { level: 'platinum', benefits: { maxAds: 100, imageSlots: 15, videoUpload: true, featuredAds: 10, adDuration: 120, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 2.5 }, requirements: { minTransactions: 100, minRating: 4.7, minActivity: 100 } },
    { level: 'diamond', benefits: { maxAds: 200, imageSlots: 20, videoUpload: true, featuredAds: 20, adDuration: 180, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 5 }, requirements: { minTransactions: 250, minRating: 4.8, minActivity: 250 } },
    { level: 'su_diamond', benefits: { maxAds: 500, imageSlots: 25, videoUpload: true, featuredAds: 50, adDuration: 365, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 10 }, requirements: { minTransactions: 500, minRating: 4.9, minActivity: 500 } },
    { level: 'MAZ', benefits: { maxAds: 9999, imageSlots: 50, videoUpload: true, featuredAds: 100, adDuration: 9999, analytics: true, customThemes: true, prioritySupport: true, revenueShare: 20 }, requirements: { minTransactions: 1000, minRating: 4.95, minActivity: 1000 } },
];

const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  siteMaintenance: false,
  registrationOpen: true,
  commissionRates: {
    normal: 10, bronze: 9, silver: 8, gold: 7, platinum: 6, diamond: 5, su_diamond: 3, MAZ: 0,
  },
  contentModeration: 'hybrid',
  paymentMethods: ['credit_card', 'paypal'],
};

const CATEGORIES: Category[] = [
    { id: 'electronics', name: 'Electronics' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'home-garden', name: 'Home & Garden' },
    { id: 'vehicles', name: 'Vehicles' },
    { id: 'real-estate', name: 'Real Estate' },
    { id: 'services', name: 'Services' },
];

const generateMockState = (): Omit<MarketplaceState, 'adminConfig'> => {
    const users = MOCK_SELLERS as User[];
    const ads = MOCK_ADS as Ad[];
    return {
        ads,
        users,
        categories: CATEGORIES,
        userTiers: USER_TIERS,
        reports: [], // Reports are attached to ads for now
    };
};

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user: currentUser } = useAuth();
    const db = useIndexedDB('mazdadyDB');

    // Main state is now managed with useState, backed by our simulated IndexedDB
    const [state, setState] = useState<Omit<MarketplaceState, 'adminConfig'>>({
      ads: [], users: [], categories: [], userTiers: [], reports: []
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load initial state from IndexedDB or generate mock data on first load
    useEffect(() => {
      const loadState = async () => {
        const storedState = await db.getItem<Omit<MarketplaceState, 'adminConfig'>>('marketplaceState');
        if (storedState && storedState.ads.length > 0) {
          setState(storedState);
        } else {
          const mockState = generateMockState();
          setState(mockState);
          await db.setItem('marketplaceState', mockState);
        }
        setIsLoading(false);
      };
      loadState();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Wrapper for setState that also persists to IndexedDB asynchronously
    const setAndPersistState = useCallback((updater: React.SetStateAction<Omit<MarketplaceState, 'adminConfig'>>) => {
      setState(prevState => {
        const newState = typeof updater === 'function' ? updater(prevState) : updater;
        db.setItem('marketplaceState', newState);
        return newState;
      });
    }, [db]);

    // Preferences and smaller sets can still use localStorage for simplicity and speed
    const [adminConfig, setAdminConfig] = useLocalStorage<AdminConfig>('adminConfig', DEFAULT_ADMIN_CONFIG);
    const [likedAds, setLikedAds] = usePersistentSet<string>('likedAds');
    const [favoritedAds, setFavoritedAds] = usePersistentSet<string>('favoritedAds');
    
    const moderationQueue = useMemo((): ModerationItem[] => {
        return state.ads
            .filter(ad => ad.reports && ad.reports.length > 0 && ad.status === 'active')
            .map(ad => ({
                id: `mod-ad-${ad.id}`,
                type: 'ad',
                targetId: ad.id,
                reason: ad.reports.map(r => r.reason).join(', '),
                reportCount: ad.reports.length,
            }));
    }, [state.ads]);

    const getAdById = useCallback((id: string) => state.ads.find(ad => ad.id === id), [state.ads]);
    const getAdsBySellerId = useCallback((sellerId: string) => state.ads.filter(ad => ad.seller.id === sellerId), [state.ads]);

    const createAd = async (adData: any): Promise<string> => {
        if (!currentUser) throw new Error("User not authenticated");
        
        const newAd: Ad = {
            id: `ad-${Date.now()}`, seller: currentUser, createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            stats: { likes: 0, shares: 0, views: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
            likes: 0, shares: 0, views: 0, rating: 0, reviews: [], comments: [], reports: [], status: 'active',
            ...adData,
            specifications: adData.specifications || {}, delivery: adData.delivery || {},
            availability: adData.availability || { quantity: adData.quantity || 1, inStock: true },
        };
        setAndPersistState(prevState => ({ ...prevState, ads: [newAd, ...prevState.ads] }));
        return newAd.id;
    };

    const toggleLike = (adId: string) => {
        const isCurrentlyLiked = likedAds.has(adId);
        setAndPersistState(prevState => ({
            ...prevState,
            ads: prevState.ads.map(ad => {
                if (ad.id === adId) {
                    const newLikes = isCurrentlyLiked ? ad.stats.likes - 1 : ad.stats.likes + 1;
                    return { ...ad, stats: { ...ad.stats, likes: newLikes }, likes: newLikes };
                }
                return ad;
            }),
        }));
        setLikedAds(prevLiked => {
            const newLikedSet = new Set(prevLiked);
            isCurrentlyLiked ? newLikedSet.delete(adId) : newLikedSet.add(adId);
            return newLikedSet;
        });
    };
    
    const isLiked = (adId: string) => likedAds.has(adId);
    const toggleFavorite = (adId: string) => { setFavoritedAds(prev => { const newSet = new Set(prev); newSet.has(adId) ? newSet.delete(adId) : newSet.add(adId); return newSet; }); };
    const isFavorite = (adId: string) => favoritedAds.has(adId);

    const addComment = (adId: string, text: string) => {
        if (!currentUser) return;
        const newComment: Comment = { id: `comment-${Date.now()}`, author: currentUser, text, likes: 0, replies: [], createdAt: new Date(), isEdited: false };
        setAndPersistState(prevState => ({ ...prevState, ads: prevState.ads.map(ad => ad.id === adId ? { ...ad, comments: [newComment, ...ad.comments] } : ad) }));
    };
    
    const addReview = (adId: string, rating: number, text: string) => {
        if (!currentUser) return;
        const newReview: Review = { id: `review-${Date.now()}`, author: currentUser, text, rating, likes: 0, replies: [], createdAt: new Date(), isEdited: false };
        setAndPersistState(prevState => ({ ...prevState, ads: prevState.ads.map(ad => {
                if (ad.id === adId) {
                    const updatedReviews = [newReview, ...ad.reviews];
                    const newTotalRating = updatedReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
                    const newAverageRating = newTotalRating / updatedReviews.length;
                    return { ...ad, reviews: updatedReviews, rating: newAverageRating };
                }
                return ad;
            }) }));
    };

    const addReplyToComment = (adId: string, parentCommentId: string, text: string) => {
        if (!currentUser) return;
        const newReply: Comment = { id: `reply-${Date.now()}`, author: currentUser, text, likes: 0, replies: [], createdAt: new Date(), isEdited: false };
        const findAndAddReply = (comments: Comment[]): Comment[] => comments.map(c => c.id === parentCommentId ? { ...c, replies: [newReply, ...c.replies] } : { ...c, replies: findAndAddReply(c.replies) });
        setAndPersistState(prevState => ({ ...prevState, ads: prevState.ads.map(ad => ad.id === adId ? { ...ad, comments: findAndAddReply(ad.comments) } : ad) }));
    };
    
    const shareAd = (adId: string) => { /* ... existing implementation ... */ };
    
    const removeAd = (adId: string, reason: string) => { setAndPersistState(prevState => ({ ...prevState, ads: prevState.ads.map(ad => ad.id === adId ? { ...ad, status: 'banned', bannedReason: reason } : ad) })); };
    const approveAd = (adId: string) => { setAndPersistState(prevState => ({ ...prevState, ads: prevState.ads.map(ad => ad.id === adId ? { ...ad, reports: [] } : ad) })); };
    const deleteComment = (adId: string, commentId: string) => {
       const findAndRemove = (comments: Comment[]): Comment[] => comments.filter(c => c.id !== commentId).map(c => ({...c, replies: findAndRemove(c.replies)}));
       setAndPersistState(prevState => ({ ...prevState, ads: prevState.ads.map(ad => ad.id === adId ? { ...ad, comments: findAndRemove(ad.comments) } : ad) }));
    };
    const updateUserTiers = (updatedTiers: UserTier[]) => { setAndPersistState(prevState => ({ ...prevState, userTiers: updatedTiers })); };
    const updateAdminConfig = (newConfig: Partial<AdminConfig>) => { setAdminConfig(prev => ({ ...prev, ...newConfig })); };

    const value: MarketplaceContextType = {
        ...state, adminConfig, moderationQueue, getAdById, getAdsBySellerId, createAd,
        toggleLike, isLiked, toggleFavorite, isFavorite, addComment, addReview,
        addReplyToComment, shareAd, removeAd, approveAd, deleteComment, updateUserTiers,
        updateAdminConfig,
    };
    
    if (isLoading) {
        return <div className="dark:bg-gray-900 bg-gray-50 min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-300">Loading Marketplace...</div>;
    }

    return (
        <MarketplaceContext.Provider value={value}>
            {children}
        </MarketplaceContext.Provider>
    );
};

export const useMarketplace = (): MarketplaceContextType => {
    const context = useContext(MarketplaceContext);
    if (!context) {
        throw new Error('useMarketplace must be used within a MarketplaceProvider');
    }
    return context;
};