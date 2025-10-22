import React from 'react';
import { Ad } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import Icon from '../../../../components/Icon';
import { useAuth } from '../../../../hooks/useAuth';
import AdModerationPanel from '../../../admin/AdModerationPanel';
import UserModerationPanel from '../../../admin/UserModerationPanel';
import AdActions from './AdActions';
import { useView } from '../../../../App';
import CommentSystem from '../social/CommentSystem';
import RatingReviewSystem from '../social/RatingReviewSystem';
import T from '../../../../components/T';
import TranslationControls from '../browsing/TranslationControls';

interface AdDetailPanelProps {
  ad: Ad | null;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | number | React.ReactNode; }> = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <span className="font-semibold text-right text-gray-800 dark:text-gray-200">{value}</span>
    </div>
);

const AdDetailPanel: React.FC<AdDetailPanelProps> = ({ ad, onClose }) => {
  const isOpen = !!ad;
  const { user: currentUser, getUserById } = useAuth();
  const { t, language } = useLocalization();
  const { setView } = useView();

  const seller = ad ? getUserById(ad.seller.id) : null;
  
  const backdrop = (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    />
  );

  if (!ad || !seller) {
    return backdrop;
  }
  
  const isBanned = ad.status === 'banned';

  return (
    <>
      {backdrop}
      <div className={`
        fixed top-0 right-0 h-full w-full max-w-md lg:max-w-lg xl:max-w-xl
        transform transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        bg-white dark:bg-gray-900 shadow-2xl z-50
        flex flex-col
      `}>
        <header className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 truncate">{ad.title}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                 <Icon name="close" className="w-6 h-6" />
            </button>
        </header>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
            {isBanned && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                <p className="font-bold">{t('moderation.banned_ad_banner')}</p>
                {ad.bannedReason && <p>{ad.bannedReason}</p>}
                </div>
            )}
            
            <div className="space-y-6">
                <img src={ad.images[0]} alt={ad.title} className="w-full h-auto object-cover rounded-lg shadow-lg" />
                
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white"><T>{ad.title}</T></h1>
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                        {new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency }).format(ad.price)}
                    </p>
                    {!isBanned && <AdActions ad={ad} />}
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('ad.description')}</h2>
                        <TranslationControls />
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap"><T>{ad.description}</T></div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('ad.specifications')}</h3>
                    <div className="space-y-1 text-sm">
                        <DetailItem label={t('ad.category')} value={ad.category} />
                        <DetailItem label={t('ad.condition')} value={<span className="capitalize">{ad.condition}</span>} />
                        <DetailItem label="Brand" value={ad.specifications.brand} />
                        <DetailItem label="Model" value={ad.specifications.model} />
                        {ad.specifications.color && <DetailItem label="Color" value={ad.specifications.color} />}
                        {ad.specifications.size && <DetailItem label="Size" value={ad.specifications.size} />}
                    </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{t('ad.delivery_info')}</h3>
                    <div className="space-y-1 text-sm">
                        <DetailItem label={t('ad.delivery_type')} value={<span className="capitalize">{ad.delivery.type.replace('_', ' ')}</span>} />
                        <DetailItem label={t('ad.delivery_time')} value={ad.delivery.time} />
                        <DetailItem label={t('ad.delivery_cost')} value={ad.delivery.cost > 0 ? new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency }).format(ad.delivery.cost) : 'Free'} />
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg cursor-pointer hover:shadow-lg transition" onClick={() => { onClose(); setView({ type: 'profile', id: seller.id }); }}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t('ad.seller_info')}</h3>
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                        <img className="h-12 w-12 rounded-full" src={seller.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${seller.name}`} alt={seller.name} />
                        <div>
                            <p className="font-bold text-gray-800 dark:text-gray-200">{seller.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Member Since {new Date(seller.createdAt).getFullYear()}</p>
                        </div>
                    </div>
                </div>
                
                {currentUser?.isAdmin && <AdModerationPanel ad={ad} />}
                {currentUser?.isAdmin && currentUser.id !== ad.seller.id && <UserModerationPanel userToModerate={ad.seller} onUpdate={() => { /* This would trigger a re-fetch in a real app */ }}/>}

                {!isBanned && (
                    <>
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"><RatingReviewSystem ad={ad} /></div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"><CommentSystem ad={ad} /></div>
                    </>
                )}
            </div>
        </div>
      </div>
    </>
  );
};

export default AdDetailPanel;