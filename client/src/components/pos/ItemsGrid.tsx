import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { usePOS } from "@/store/posStore";
import { SizeModifierModal } from "./SizeModifierModal";
import React, { useState } from "react";
import type { Item, ItemSize, Modifier } from "@shared/schema";

interface ItemsGridProps {
  categoryId: string;
}

type ItemWithSizesAndModifiers = Item & { sizes: ItemSize[]; modifiers: Modifier[] };

export function ItemsGrid({ categoryId }: ItemsGridProps) {
  const { language, addToCart } = usePOS();
  const [selectedItem, setSelectedItem] = useState<ItemWithSizesAndModifiers | null>(null);
  const [showSizeModal, setShowSizeModal] = useState(false);

  const { data: items = [], isLoading } = useQuery<ItemWithSizesAndModifiers[]>({
    queryKey: ["/api/categories", categoryId, "items"],
    enabled: !!categoryId,
  });

  const handleItemClick = (item: ItemWithSizesAndModifiers) => {
    if (item.hasSizes && item.sizes.length > 0) {
      setSelectedItem(item);
      setShowSizeModal(true);
    } else {
      // Direct add to cart for simple items
      const name = item.name as { en: string; ar: string };
      addToCart({
        itemId: item.id,
        name: name,
        price: parseFloat(item.basePrice),
        quantity: 1,
        sizeId: null,
        sizeName: null,
        modifiers: [],
      });
    }
  };

  const handleSizeSelection = (sizeId: string, price: number) => {
    if (!selectedItem) return;
    
    const name = selectedItem.name as { en: string; ar: string };
    const selectedSize = selectedItem.sizes.find(s => s.id === sizeId);
    const sizeName = selectedSize?.name as { en: string; ar: string } | null;
    
    addToCart({
      itemId: selectedItem.id,
      name: name,
      price: price,
      quantity: 1,
      sizeId: sizeId,
      sizeName: sizeName,
      modifiers: [],
    });
    
    setShowSizeModal(false);
    setSelectedItem(null);
  };

  if (!categoryId) {
    return (
      <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-gray-200 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-arrow-up text-3xl text-gray-400"></i>
          </div>
          <p className="text-lg font-medium mb-2">Select a category to view items</p>
          <p className="arabic-text text-sm">اختر فئة لعرض العناصر</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
            <i className="fas fa-utensils text-white text-sm"></i>
          </div>
          Loading items...
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-40" />
          ))}
        </div>
      </div>
    );
  }

  const categoryName = items.length > 0 ? (items[0].name as any) : null;

  return (
    <>
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-200 overflow-hidden flex flex-col" data-testid="items-grid">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center text-gray-800">
            <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <i className="fas fa-utensils text-orange-600 text-lg"></i>
            </div>
            {language === "ar" ? "العناصر" : "Menu Items"}
          </h2>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {items.length} {language === "ar" ? "عنصر" : "items"}
          </div>
        </div>
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-utensils text-3xl text-gray-400"></i>
            </div>
            <p className="text-lg font-medium mb-2">
              {language === "ar" ? "لا توجد عناصر" : "No items available"}
            </p>
            <p className="text-sm text-center">
              {language === "ar" ? "اختر فئة لعرض العناصر" : "Select a category to view items"}
            </p>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-gray-100 hover:scrollbar-thumb-orange-400">
            {items.map((item) => {
              const name = item.name as { en: string; ar: string };
              
              return (
                <Button
                  key={item.id}
                  variant="outline"
                         className="item-card h-auto p-4 flex flex-col items-center text-center hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white border-gray-200 rounded-2xl group hover:border-orange-300 hover:bg-orange-50/50"
                  onClick={() => handleItemClick(item)}
                  data-testid={`button-item-${item.id}`}
                >
                  <div className="relative w-full mb-3">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={name.en}
                        className="w-full h-24 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        <i className="fas fa-utensils text-2xl text-gray-400"></i>
                      </div>
                    )}
                    {item.hasSizes && (
                           <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                        {language === "ar" ? "أحجام" : "Sizes"}
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full">
                    <h3 className="font-bold text-sm mb-1 text-gray-800 group-hover:text-orange-600 transition-colors duration-200">
                      {language === "ar" ? name.ar : name.en}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {language === "ar" ? name.en : name.ar}
                    </p>
                    
                           <div className="w-full bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-3 group-hover:from-orange-100 group-hover:to-orange-200 transition-all duration-200">
                             <p className="text-orange-600 font-bold text-sm">
                        QR {item.hasSizes ? `${item.basePrice}+` : item.basePrice}
                      </p>
                      {item.hasSizes && (
                        <p className="text-xs text-orange-500 mt-1">
                          {language === "ar" ? "من" : "from"}
                        </p>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {selectedItem && (
        <SizeModifierModal
          isOpen={showSizeModal}
          onClose={() => {
            setShowSizeModal(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onSizeSelect={handleSizeSelection}
        />
      )}
    </>
  );
}
