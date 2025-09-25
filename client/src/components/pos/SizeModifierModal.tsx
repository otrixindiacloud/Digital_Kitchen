import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePOS } from "@/store/posStore";
import type { Item, ItemSize, Modifier } from "@shared/schema";

interface SizeModifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item & { sizes: ItemSize[]; modifiers: Modifier[] };
  onSizeSelect: (sizeId: string, price: number) => void;
}

export function SizeModifierModal({ isOpen, onClose, item, onSizeSelect }: SizeModifierModalProps) {
  const { language } = usePOS();
  const name = item.name as { en: string; ar: string };
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

  const handleClose = () => {
    setSelectedSizeId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" data-testid="size-modifier-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {language === "ar" ? name.ar : name.en}
              </h3>
              <p className="text-sm text-muted-foreground">
                Select Size / اختر الحجم
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3">
          {item.sizes.map((size) => {
            const sizeName = size.name as { en: string; ar: string };
            const isSelected = selectedSizeId === size.id;
            
            return (
              <Button
                key={size.id}
                variant="outline"
                className={`w-full touch-target h-auto p-4 text-left flex items-center justify-between hover:border-primary ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-300' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedSizeId(size.id)}
                data-testid={`button-size-${size.id}`}
              >
                <div>
                  <p className={`font-semibold ${
                    isSelected ? 'text-gray-600' : 'text-gray-900'
                  }`}>
                    {language === "ar" ? sizeName.ar : sizeName.en}
                  </p>
                  <p className={`text-sm ${
                    isSelected ? 'text-gray-500' : 'text-muted-foreground'
                  }`}>
                    {language === "ar" ? sizeName.en : sizeName.ar}
                  </p>
                </div>
                <p className={`font-bold ${
                  isSelected ? 'text-gray-600' : 'text-primary'
                }`}>
                  QR {size.price}
                </p>
              </Button>
            );
          })}
        </div>
        
        <div className="mt-6 flex space-x-3">
          <Button
            variant="outline"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700"
            onClick={handleClose}
            data-testid="button-cancel-selection"
          >
            Cancel / إلغاء
          </Button>
          {selectedSizeId && (
            <Button
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => {
                const selectedSize = item.sizes.find(s => s.id === selectedSizeId);
                if (selectedSize) {
                  onSizeSelect(selectedSizeId, parseFloat(selectedSize.price));
                }
              }}
              data-testid="button-confirm-selection"
            >
              Select / اختر
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
