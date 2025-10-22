import React from 'react';

interface PriceRangeSliderProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({ value, onChange, min = 0, max = 5000000 }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value[1] - 1);
    onChange([newMin, value[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value[0] + 1);
    onChange([value[0], newMax]);
  };

  return (
    <div className="space-y-4">
      <div className="relative h-2 rounded-full bg-gray-200 dark:bg-gray-600">
        <div 
            className="absolute h-2 rounded-full bg-indigo-500"
            style={{ 
                left: `${(value[0] / max) * 100}%`,
                right: `${100 - (value[1] / max) * 100}%`
            }}
        ></div>
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={handleMinChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>${value[0].toLocaleString()}</span>
        <span>${value[1].toLocaleString()}{value[1] === max ? '+' : ''}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
