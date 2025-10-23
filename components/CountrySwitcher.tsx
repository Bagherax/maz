import React, { useState, useEffect, ReactNode } from 'react';
import Dropdown from './Dropdown';
import { COUNTRIES } from '../data/countries';
import { useLocalization } from '../hooks/useLocalization';

const COUNTRY_STORAGE_KEY = 'selectedCountry';

const CountrySwitcher: React.FC = () => {
    const { t } = useLocalization();
    const countryOptions = COUNTRIES.map(country => ({
      value: country.code,
      label: country.name,
      icon: <span className="text-lg">{country.flag}</span>
    }));
  
    const [selectedCountry, setSelectedCountry] = useState(() => {
        const savedCountryCode = localStorage.getItem(COUNTRY_STORAGE_KEY);
        return countryOptions.find(opt => opt.value === savedCountryCode) || countryOptions[0];
    });

    useEffect(() => {
        localStorage.setItem(COUNTRY_STORAGE_KEY, selectedCountry.value);
    }, [selectedCountry]);
  
    // FIX: Wrap the state setter in a handler to match the expected onSelect signature.
    const handleSelect = (option: { value: string; label: string; icon?: ReactNode; disabled?: boolean; }) => {
        setSelectedCountry(option as any);
    };

    return (
      <Dropdown
        label={t('auth.select_country')}
        options={countryOptions}
        selected={selectedCountry}
        onSelect={handleSelect}
      />
    );
  };
  
  export default CountrySwitcher;