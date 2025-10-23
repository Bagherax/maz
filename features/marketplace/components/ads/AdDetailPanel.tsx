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
import SellerInfoCard from '../users/SellerInfoCard';

interface AdDetailPanelProps {
  ad?: Ad;
  isOpen: boolean;
  onClose: () => void;
}

const DetailItem: React.FC<{ label: string; value: string | number | React.ReactNode; }> = ({ label, value }) => (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">{label}</span>
        <span className="font-semibold text-right rtl:text-left text-gray-800 dark:text-gray-200 break-all">{value}</span>
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
                        <button onClick={goToPrev} className="absolute top-1/2 left-2 rtl:left-auto rtl:right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none ripple">
                            <Icon name="arrow-left" className="w-5 h-5" />
                        </button>
                         <button onClick={goToNext} className="absolute top-1/2 right-2 rtl:right-auto rtl:left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 focus:outline-none ripple">
                            <Icon name="arrow-right" className="w-5 h-5" />
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


const AdDetailPanel: React.FC<AdDetailPanelProps> = ({ ad, isOpen, onClose }) => {
  const { user: currentUser, getUserById } = useAuth();
  const { t, language } = useLocalization();
  const { setView } = useView();

  const seller = ad ? getUserById(ad.seller.id) : null;
  const isBanned = ad?.status === 'banned';

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ad-detail-title"
        className={`
        fixed top-0 right-0 rtl:right-auto rtl:left-0 h-full w-full max-w-md sm:max-w-lg lg:w-1/3 xl:w-1/4
        transform transition-transform duration-500 ease-in-out
        ${isOpen ? 'translate-x-0' : 'rtl:-translate-x-0'}
        ${!isOpen ? 'translate-x-full rtl:-translate-x-full' : ''}
        bg-white dark:bg-gray-900 shadow-2xl z-50
        flex flex-col
      `}>
        {ad && seller && (
            <>
            <header className="p-4 flex items-center justify-between border-b dark:border-gray-700 shrink-0">
                 <h2 id="ad-detail-title" className="text-lg font-bold truncate pe-4"><T>{ad.title}</T></h2>
                <button onClick={onClose} aria-label={t('controls.close')} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 z-10 ripple">
                    <Icon name="close" className="w-6 h-6" />
                </button>
            </header>
            
            <div className="flex-grow overflow-y-auto">
                <div className="p-4 sm:p-6 space-y-6">
                    {isBanned && (
                        <div className="bg-red-100 border-s-4 border-red-500 text-red-700 p-4 rounded-md mb-6" role="alert">
                        <p className="font-bold">{t('moderation.banned_ad_banner')}</p>
                        {ad.bannedReason && <p>{ad.bannedReason}</p>}
                        </div>
                    )}
                    
                    <ImageGallery images={ad.images} adTitle={ad.title} />

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                            {new Intl.NumberFormat(language, { style: 'currency', currency: ad.currency }).format(ad.price)}
                        </p>
                        {!isBanned && <AdActions ad={ad} />}
                    </div>

                    <div onClick={() => { onClose(); setView({ type: 'profile', id: seller.id }); }} className="cursor-pointer">
                        <SellerInfoCard seller={seller} />
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">{t('ad.description')}</h3>
                      <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-all"><T>{ad.description}</T></div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">{t('ad.details')}</h3>
                      <div className="space-y-1 text-sm">
                          <DetailItem label={t('ad.category')} value={ad.category} />
                          <DetailItem label={t('ad.condition')} value={<span className="capitalize">{ad.condition}</span>} />
                          <DetailItem label="Brand" value={ad.specifications.brand} />
                          <DetailItem label="Model" value={ad.specifications.model} />
                          {ad.specifications.color && <DetailItem label="Color" value={ad.specifications.color} />}
                          {ad.specifications.size && <DetailItem label="Size" value={ad.specifications.size} />}
                      </div>
                    </div>

                    {currentUser?.isAdmin && <AdModerationPanel ad={ad} />}

                    {!isBanned && (
                        <>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"><RatingReviewSystem ad={ad} /></div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"><CommentSystem ad={ad} /></div>
                        </>
                    )}
                </div>
            </div>
            </>
        )}
      </div>
    </>
  );
};

export default AdDetailPanel;