import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMenuStore } from "@/store/menuStore";

interface CategoriesProps {}

const Categories: React.FC<CategoriesProps> = () => {
  // Use menu store for categories - home page specific methods
  const { 
    homeCategories,
    isLoadingHomeCategories,
    homeSelectedCategory,
    isHomeDataLoaded,
    setHotelAndBranch,
    setHomeSelectedCategory,
    initializeHomeData,
    filterHomeByCateogry,
  } = useMenuStore();

  // Initialize hotel and branch IDs and load data once
  useEffect(() => {
    const hotelId = "68d13a52c10d4ebc29bfe787";
    const branchId = "68d13a9dc10d4ebc29bfe78f";
    
    setHotelAndBranch(hotelId, branchId);
    
    // Load all data once if not already loaded
    if (!isHomeDataLoaded) {
      initializeHomeData();
    }
  }, [setHotelAndBranch, initializeHomeData, isHomeDataLoaded]);

  const handleCategoryClick = async (categoryId: string) => {
    // Avoid unnecessary API calls if selecting the same category
    if (categoryId === homeSelectedCategory) {
      return;
    }
    
    // Update the store's selected category
    setHomeSelectedCategory(categoryId);
    
    // Use server-side filtering
    await filterHomeByCateogry(categoryId);
    
    // Scroll to the OurMenu section
    const ourMenuSection = document.getElementById('our-menu-section');
    if (ourMenuSection) {
      ourMenuSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleClearFilter = async () => {
    // Avoid unnecessary API calls if already showing all items
    if (homeSelectedCategory === null) {
      return;
    }
    
    // Clear the selected category
    setHomeSelectedCategory(null);
    
    // Use server-side filtering to show all items
    await filterHomeByCateogry(null);
    
    // Scroll to the OurMenu section
    const ourMenuSection = document.getElementById('our-menu-section');
    if (ourMenuSection) {
      ourMenuSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (isLoadingHomeCategories && homeCategories.length === 0) {
    return (
      <div className="px-6 py-6">
        <div className="flex gap-4 overflow-x-auto pb-2 pt-4 scrollbar-hide">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex-shrink-0 relative">
              <Skeleton className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-18 h-18 rounded-full z-10 border-2 border-white shadow-lg" />
              <div className="w-28 h-25 pt-8 pb-2 flex items-end justify-center">
                <Skeleton className="w-16 h-4 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      <div className="flex gap-4 overflow-x-auto pb-2 pt-4 scrollbar-hide">
        {/* Show All Categories Option */}
        <div 
          className="flex-shrink-0 relative cursor-pointer"
          onClick={handleClearFilter}
        >
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-18 h-18 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full z-10 border-2 border-white shadow-lg flex items-center justify-center">
            <span className="text-white text-7xl">🍽️</span>
          </div>
          <div className={`w-28 h-25 rounded-2xl pt-8 pb-2 flex items-end justify-center transition-colors ${
            !homeSelectedCategory
              ? 'bg-orange-600' 
              : 'bg-gray-400 hover:bg-gray-500'
          }`}>
            <span className="text-white font-semibold text-sm text-center px-2">
              All Items
            </span>
          </div>
        </div>

        {/* Category Items */}
        {homeCategories.map((category, index) => (
          <div 
            key={category._id} 
            className="flex-shrink-0 relative cursor-pointer"
            onClick={() => handleCategoryClick(category._id)}
          >
            <img
              src={category.image}
              alt={category.name}
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-18 h-18 object-cover rounded-full z-10 border-2 border-white shadow-lg"
            />
            <div className={`w-28 h-25 rounded-2xl pt-8 pb-2 flex items-end justify-center transition-colors ${
              homeSelectedCategory === category._id 
                ? 'bg-orange-600' 
                : 'bg-orange-500 hover:bg-orange-600'
            }`}>
              <span className="text-white font-semibold text-sm text-center px-2">
                {category.name}
              </span>
            </div>
            {category.itemCount > 0 && (
              <div className="absolute -top-2 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center z-20">
                {category.itemCount}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;