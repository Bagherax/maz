import React, { useState } from 'react';
import { Ad } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import Icon from '../../../../components/Icon';
import { useAuth } from '../../../../hooks/useAuth';
import AdModerationPanel from '../../../admin/AdModerationPanel';
import AdActions from './AdActions';
import { useView } from '../../../../App';
import CommentSystem from '../social/CommentSystem';
import RatingReviewSystem from '../social/RatingReviewSystem';
import T from '../../../../components/T';
import TranslationControls from '../browsing/TranslationControls';
import SellerInfoCard from '../users/SellerInfoCard';

interface ExpandedAdDetailProps {
  ad: Ad;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | number | React.ReactNode; }> = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <span className="font-semibold text-right text-gray-800 dark:text-gray-200">{value}</span>
    </div>
);

const ImageGallery: React.FC<{ images: string[], adTitle: string }> = ({ images, adTitle }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToNext = () => setCurrentIndex(prev => (prev + 1) % images.length);
    const goToPrev = () => setCurrentIndex(prev => (prev - 1 + images.length) % images.length);

    if (!images || images.length === 0) {
        return <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">No Image</div>;
    }

    return (
        <div className="space-y-2">
            <div className="relative">
                <img src={images[currentIndex]} alt={`${adTitle} - image ${currentIndex + 1}`} className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md" />
                {images.length > 1 && (
                    <>
                        <button onClick={goToPrev} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none">
                            <Icon name="arrow-left" className="w-5 h-5" />
                        </button>
                         <button onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none">
                            <Icon name="arrows-right-left" className="w-5 h-5 rotate-180" />
                        </button>
                    </>
                )}
            </div>
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto p-1">
                    {images.map((img, index) => (
                        <img 
                            key={index} 
                            src={img} 
                            alt={`thumbnail ${index + 1}`} 
                            onClick={() => setCurrentIndex(index)}
                            className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${currentIndex === index ? 'border-indigo-500' : 'border-transparent hover:border-gray-400'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const ExpandedAdDetail: React.FC<ExpandedAdDetailProps> = ({ ad, onClose }) => {
  const { user: currentUser, getUserById } = useAuth();
  const { t, language } = useLocalization();
  const { setView } = useView();

  const seller = getUserById(ad.seller.id);

  if (!seller) return null;

  const isBanned = ad.status === 'banned';

  return (
    <div className="animate-slide-down bg-white dark:bg-gray-800 my-4 p-4 sm:p-6 rounded-lg shadow-lg border dark:border-gray-700 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 z-10">
            <Icon name="close" className="w-6 h-6" />
        </button>

        {isBanned && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
            <p className="font-bold">{t('moderation.banned_ad_banner')}</p>
            {ad.bannedReason && <p>{ad.bannedReason}</p>}
            </div>
        )}
        
        <div className="flex flex-col gap-6">

            {/* --- Top Full-Width Media Section --- */}
            <div className="w-full">
                <ImageGallery images={ad.images} adTitle={ad.title} />
            </div>

            {/* --- Bottom Details Section --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Title, Price, Actions */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white"><T>{ad.title}</T></h1>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                            {new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency }).format(ad.price)}
                        </p>
                        {!isBanned && <AdActions ad={ad} />}
                    </div>

                    {/* Description & Translation */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex justify-end items-center mb-2">
                            <TranslationControls />
                        </div>
                        <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap"><T>{ad.description}</T></div>
                    </div>

                    {/* Social Features */}
                    {!isBanned && (
                        <>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"><RatingReviewSystem ad={ad} /></div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"><CommentSystem ad={ad} /></div>
                        </>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-1 space-y-4">
                    {/* Seller Info */}
                    <div onClick={() => { onClose(); setView({ type: 'profile', id: seller.id }); }}>
                        <SellerInfoCard seller={seller} />
                    </div>

                    {/* Ad Details */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="space-y-1 text-sm">
                            <DetailItem label={t('ad.category')} value={ad.category} />
                            <DetailItem label={t('ad.condition')} value={<span className="capitalize">{ad.condition}</span>} />
                            <DetailItem label="Brand" value={ad.specifications.brand} />
                            <DetailItem label="Model" value={ad.specifications.model} />
                            {ad.specifications.color && <DetailItem label="Color" value={ad.specifications.color} />}
                            {ad.specifications.size && <DetailItem label="Size" value={ad.specifications.size} />}
                        </div>
                    </div>

                    {/* Admin Panel */}
                    {currentUser?.isAdmin && <AdModerationPanel ad={ad} />}
                </div>

            </div>
        </div>
    </div>
  );
};

export default ExpandedAdDetail;