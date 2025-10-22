import React, { useState, ChangeEvent, useRef } from 'react';
import Icon from '../../components/Icon';

interface AvatarUploaderProps {
  onAvatarChange: (base64: string) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ onAvatarChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onAvatarChange(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className="relative h-32 w-32 rounded-full cursor-pointer bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 overflow-hidden"
        onClick={handleClick}
      >
        {preview ? (
          <img src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
        ) : (
          <Icon name="user-circle" className="w-20 h-20" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Icon name="photo" className="w-8 h-8 text-white" />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
       <button type="button" onClick={handleClick} className="text-sm font-medium" style={{ color: 'var(--auth-color-primary)' }}>
        Upload Profile Picture
      </button>
    </div>
  );
};

export default AvatarUploader;