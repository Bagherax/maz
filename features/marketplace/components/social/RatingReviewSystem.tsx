import React, { useState } from 'react';
import { Ad } from '../../../../types';
import { useLocalization } from '../../../../hooks/useLocalization';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import Icon from '../../../../components/Icon';

interface RatingReviewSystemProps {
  ad: Ad;
}

const StarRating: React.FC<{ rating: number; setRating?: (rating: number) => void }> = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const isInteractive = !!setRating;

  return (
    <div className="flex items-center space-x-1 rtl:space-x-reverse">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={isInteractive ? 'button' : 'submit'}
          disabled={!isInteractive}
          onClick={isInteractive ? () => setRating(star) : undefined}
          onMouseEnter={isInteractive ? () => setHoverRating(star) : undefined}
          onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
          className={`text-2xl ${isInteractive ? 'cursor-pointer' : 'cursor-default'} ${
            (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const RatingReviewSystem: React.FC<RatingReviewSystemProps> = ({ ad }) => {
  const { t } = useLocalization();
  const { addReview } = useMarketplace();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && text.trim()) {
      addReview(ad.id, rating, text);
      setSubmitted(true);
      // In a real app, you might disable the form or show a "thank you" message permanently
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('social.reviews_section')}</h2>
      
      {/* Review submission form */}
      {!submitted && (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg dark:border-gray-700 space-y-4">
          <h3 className="font-semibold">{t('social.rate_this_ad')}</h3>
          <div>
            <label className="block text-sm font-medium mb-1">{t('social.your_rating')}</label>
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <div>
            <label htmlFor="review-text" className="block text-sm font-medium mb-1">{t('social.your_review')}</label>
            <textarea
              id="review-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              className="w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              placeholder={t('social.add_comment_placeholder')}
              required
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50" disabled={rating === 0 || !text.trim()}>
            {t('social.submit_review')}
          </button>
        </form>
      )}

      {/* Existing reviews */}
      <div className="space-y-4">
        {ad.reviews.length > 0 ? (
          ad.reviews.map(review => (
            <div key={review.id} className="flex items-start space-x-3 rtl:space-x-reverse border-b pb-4 dark:border-gray-700">
              <img className="h-10 w-10 rounded-full" src={review.author.avatar || `https://api.dicebear.com/8.x/initials/svg?seed=${review.author.name}`} alt={review.author.name} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{review.author.name}</span>
                  {review.rating && <StarRating rating={review.rating} />}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">{t('social.no_reviews')}</p>
        )}
      </div>
    </div>
  );
};

export default RatingReviewSystem;