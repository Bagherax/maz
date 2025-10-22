import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';
import { useMarketplace } from '../../context/MarketplaceContext';
import Icon from '../../components/Icon';
import ReputationStat from './components/ReputationStat';
import UserModerationPanel from '../admin/UserModerationPanel';
import UserTierBadge from '../marketplace/components/users/UserTierBadge';
import AdCard from '../marketplace/components/ads/AdCard';

interface ProfilePageProps {
  userId: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userId }) => {
  const { user: currentUser, getUserById, refreshCurrentUser } = useAuth();
  const { getAdsBySellerId } = useMarketplace();
  const { t, language } = useLocalization();

  // Determine if we are viewing our own profile or someone else's
  const viewedUser = getUserById(userId);
  const ads = getAdsBySellerId(userId);

  if (!viewedUser) {
    return <div className="text-center p-8">User not found.</div>;
  }

  const isBanned = viewedUser.status === 'banned';

  const handleModerationUpdate = () => {
    // In a real app with a backend, this would refetch data.
    // For our local mock, we need to refresh the context state.
    refreshCurrentUser(); 
    // Ideally, we'd have a way to refresh any user, but for now this works if an admin moderates themself.
    // A full solution requires a more robust state management.
    console.log("Moderation action performed. State updated.");
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
        {/* Avatar */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <img
            className="h-32 w-32 rounded-full ring-4 ring-white dark:ring-gray-900"
            src={viewedUser.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${viewedUser.name}`}
            alt={viewedUser.name}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center space-x-2">
            <span>{viewedUser.name}</span>
            {viewedUser.isVerified && <Icon name="check-badge" className="w-7 h-7 text-blue-500" title={t('profile.verified')} />}
          </h1>
          <div className="mt-2">
             <UserTierBadge tier={viewedUser.tier} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {t('profile.member_since')} {new Date(viewedUser.createdAt).toLocaleDateString(language, { year: 'numeric', month: 'long' })}
          </p>
        </div>
        
        {isBanned && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-6 max-w-2xl mx-auto" role="alert">
                <p className="font-bold">{t('moderation.banned_user_banner')}</p>
                {viewedUser.banReason && <p>{viewedUser.banReason}</p>}
            </div>
        )}

        {currentUser?.isAdmin && currentUser.id !== viewedUser.id && (
            <UserModerationPanel userToModerate={viewedUser} onUpdate={handleModerationUpdate} />
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Bio & Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{t('profile.bio')}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{viewedUser.bio}</p>
            </div>
             <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{t('profile.reputation')}</h3>
              <div className="space-y-3">
                <ReputationStat value={`${viewedUser.rating.toFixed(1)} ★`} label={t('profile.overall_rating')} />
                <ReputationStat value={viewedUser.reviewCount.toString()} label={t('profile.reviews')} />
                <ReputationStat value={ads.length.toString()} label={t('profile.active_ads')} />
              </div>
            </div>
          </div>

          {/* Right Column: User's Ads */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">{t('profile.my_ads')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {ads.length > 0 ? ads.map(ad => (
                 <AdCard key={ad.id} ad={ad} displayMode="standard" />
              )) : (
                <p className="text-gray-500 col-span-2">This user has no active ads.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;