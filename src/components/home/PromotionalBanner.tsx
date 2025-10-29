import React from 'react';

interface PromotionalBannerProps {
  bannerImage?: string;
}

const PromotionalBanner: React.FC<PromotionalBannerProps> = ({ 
  bannerImage = "/images/banner1.png" 
}) => {
  return (
    <div className="px-3 mb-8">
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={bannerImage}
          alt="Promotional Banner"
          className="w-full h-48 object-cover"
        />
      </div>
    </div>
  );
};

export default PromotionalBanner;