import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Ad, Category, DeliveryOption } from '../../../../types';
import { useMarketplace } from '../../../../context/MarketplaceContext';
import { useLocalization } from '../../../../hooks/useLocalization';
import Icon from '../../../../components/Icon';

interface AdCreationWizardProps {
  onAdCreated: (adId: string) => void;
  onCancel: () => void;
}

type AdFormData = Omit<Ad, 'id' | 'seller' | 'rating' | 'reviews' | 'comments' | 'reports' | 'status' | 'bannedReason' | 'stats'>;

const AdCreationWizard: React.FC<AdCreationWizardProps> = ({ onAdCreated, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AdFormData>>({
    title: '',
    description: '',
    price: 0,
    currency: 'USD',
    category: '',
    condition: 'used',
    availability: { quantity: 1, inStock: true },
    images: [],
    delivery: { available: false, cost: 0, time: '', type: 'pickup', instructions: '' },
    location: { city: 'Metropolis', country: 'USA' },
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { createAd, categories } = useMarketplace();
  const { t } = useLocalization();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      setFormData(prev => ({ ...prev, availability: { ...prev.availability, quantity: Number(value), inStock: Number(value) > 0 } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    }
  };

  const handleDeliveryInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, delivery: { ...prev.delivery!, [name]: name === 'cost' ? Number(value) : value } }));
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              setImagePreview(reader.result as string);
              // In a real app, you would upload this file and get a URL
              setFormData(prev => ({ ...prev, images: [reader.result as string] }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleDeliveryTypeChange = (option: 'home' | 'pickup') => {
      setFormData(prev => {
          const delivery = prev.delivery!;
          const offersHome = delivery.type === 'delivery' || delivery.type === 'both';
          const offersPickup = delivery.type === 'pickup' || delivery.type === 'both';

          let newOffersHome = offersHome;
          let newOffersPickup = offersPickup;

          if (option === 'home') newOffersHome = !newOffersHome;
          if (option === 'pickup') newOffersPickup = !newOffersPickup;

          let newType: Ad['delivery']['type'] = 'pickup';
          if (newOffersHome && newOffersPickup) newType = 'both';
          else if (newOffersHome) newType = 'delivery';
          else if (newOffersPickup) newType = 'pickup';
          
          return { ...prev, delivery: { ...delivery, type: newType, available: newOffersHome || newOffersPickup } };
      });
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newAdId = await createAd(formData as AdFormData);
      onAdCreated(newAdId);
    } catch (error) {
      console.error("Failed to create ad:", error);
      alert("Failed to create ad. Please try again.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Details
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">{t('ad.create.title_label')}</label>
              <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium">{t('ad.create.description_label')}</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={4} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium">{t('ad.create.price_label')}</label>
                    <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium">{t('ad.create.quantity_label')}</label>
                    <input type="number" name="quantity" id="quantity" value={formData.availability?.quantity} onChange={handleInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required />
                </div>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium">{t('ad.create.category_label')}</label>
                    <select name="category" id="category" value={formData.category} onChange={handleInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" required>
                        <option value="">Select Category</option>
                        {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium">{t('ad.create.condition_label')}</label>
                    <div className="flex space-x-4 mt-2">
                        {(['new', 'used', 'refurbished'] as const).map(cond => (
                            <label key={cond} className="flex items-center">
                                <input type="radio" name="condition" value={cond} checked={formData.condition === cond} onChange={handleInputChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"/>
                                <span className="ml-2 capitalize">{t(`ad.create.condition_${cond}`)}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        );
      case 2: // Media
        return (
             <div>
                <label className="block text-sm font-medium">{t('ad.create.image_upload_label')}</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Ad preview" className="mx-auto h-48 w-auto rounded-md" />
                        ) : (
                            <Icon name="photo" className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                <span>{t('ad.create.image_upload_prompt')}</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
      case 3: // Delivery
        const offersHome = formData.delivery?.type === 'delivery' || formData.delivery?.type === 'both';
        const offersPickup = formData.delivery?.type === 'pickup' || formData.delivery?.type === 'both';
        return (
            <div className="space-y-4">
                <h4 className="text-lg font-medium">{t('delivery.create_section_title')}</h4>
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input type="checkbox" checked={offersHome} onChange={() => handleDeliveryTypeChange('home')} className="h-4 w-4 rounded text-indigo-600" />
                        <span className="ml-2">{t('delivery.create_home_delivery_label')}</span>
                    </label>
                     {offersHome && (
                        <div className="pl-6 space-y-2">
                             <input type="number" name="cost" placeholder={t('delivery.create_cost_placeholder')} value={formData.delivery?.cost} onChange={handleDeliveryInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                             <input type="text" name="time" placeholder={t('delivery.create_days_placeholder')} value={formData.delivery?.time} onChange={handleDeliveryInputChange} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm" />
                        </div>
                     )}
                </div>
                 <div className="space-y-2">
                    <label className="flex items-center">
                        <input type="checkbox" checked={offersPickup} onChange={() => handleDeliveryTypeChange('pickup')} className="h-4 w-4 rounded text-indigo-600" />
                        <span className="ml-2">{t('delivery.create_pickup_label')}</span>
                    </label>
                     {offersPickup && (
                        <div className="pl-6">
                           <textarea name="instructions" placeholder={t('delivery.create_instructions_placeholder')} value={formData.delivery?.instructions} onChange={handleDeliveryInputChange} rows={3} className="mt-1 w-full rounded-md dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-sm"></textarea>
                        </div>
                     )}
                </div>
            </div>
        );
      case 4: // Review
        return (
             <div className="space-y-4">
                <h3 className="text-xl font-bold">{t('ad.create.review_title')}</h3>
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-1/2 mx-auto rounded-lg"/>}
                <p><strong>{t('ad.create.title_label')}:</strong> {formData.title}</p>
                <p><strong>{t('ad.create.price_label')}:</strong> {formData.price} {formData.currency}</p>
                <p><strong>{t('ad.create.category_label')}:</strong> {formData.category}</p>
                <p><strong>{t('ad.create.condition_label')}:</strong> {formData.condition}</p>
            </div>
        );
      default: return null;
    }
  };

  const steps = [t('ad.create.step1'), t('ad.create.step2'), t('ad.create.step3'), t('ad.create.step4')];

  return (
    <form onSubmit={handleSubmit}>
      {/* Stepper UI */}
      <div className="mb-8">
        <ol className="flex items-center w-full">
          {steps.map((stepName, index) => (
            <li key={stepName} className={`flex w-full items-center ${index + 1 < steps.length ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-4 after:inline-block" : ''} ${index + 1 <= step ? 'text-indigo-600 dark:text-indigo-400 after:border-indigo-600' : 'after:border-gray-200'}`}>
              <span className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${index + 1 <= step ? 'bg-indigo-100 dark:bg-indigo-800' : 'bg-gray-100 dark:bg-gray-700'}`}>
                {index + 1}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="min-h-[300px]">
         {renderStep()}
      </div>

      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <button type="button" onClick={prevStep} className="px-6 py-2 border rounded-md">{t('ad.create.prev_step')}</button>
        ) : (
          <button type="button" onClick={onCancel} className="px-6 py-2 border rounded-md">Cancel</button>
        )}
        
        {step < 4 ? (
          <button type="button" onClick={nextStep} className="px-6 py-2 bg-indigo-600 text-white rounded-md">{t('ad.create.next_step')}</button>
        ) : (
          <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md">{t('ad.create.post_ad')}</button>
        )}
      </div>
    </form>
  );
};

export default AdCreationWizard;