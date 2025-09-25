import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { usePOS } from "@/store/posStore";
import type { Category } from "@shared/schema";

interface CategoriesGridProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export function CategoriesGrid({ selectedCategory, onCategorySelect }: CategoriesGridProps) {
  const { language } = usePOS();
  
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-6 flex items-center text-gray-800">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
            <i className="fas fa-th-large text-white text-sm"></i>
          </div>
          Categories / الفئات
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-2xl h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200" data-testid="categories-grid">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center text-gray-800">
                 <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
            <i className="fas fa-th-large text-white text-lg"></i>
          </div>
          {language === "ar" ? "الفئات" : "Categories"}
        </h2>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {categories.length} {language === "ar" ? "فئة" : "categories"}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const name = category.name as { en: string; ar: string };
          
          return (
            <Button
              key={category.id}
              variant="outline"
                     className={`gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-300 touch-target h-32 flex flex-col items-center justify-center p-4 text-center hover:scale-105 group ${
                       isSelected 
                         ? "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 border-blue-300 scale-105 ring-2 ring-blue-200" 
                         : "bg-white border-gray-200 text-gray-700"
                     }`}
              onClick={() => handleCategorySelect(category.id)}
              data-testid={`button-category-${category.id}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-all duration-300 ${
                isSelected 
                  ? "bg-blue-200" 
                  : "bg-gray-100"
              }`}>
                <i className={`${category.icon} text-2xl ${
                  isSelected 
                    ? "text-blue-700" 
                    : "text-gray-500"
                }`}></i>
              </div>
              <div className="text-center">
                <p className="font-bold text-sm mb-1">{language === "ar" ? name.ar : name.en}</p>
                <p className="text-xs opacity-75 line-clamp-2">{language === "ar" ? name.en : name.ar}</p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
