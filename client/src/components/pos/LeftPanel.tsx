import React, { useState, useEffect } from "react";
import { CategoriesGrid } from "./CategoriesGrid";
import { ItemsGrid } from "./ItemsGrid";
import { Button } from "@/components/ui/button";
import { usePOS } from "@/store/posStore";
import { t } from "@/lib/i18n";

type OrderSource = "dine-in" | "takeaway" | "talabat" | "snoonu";

interface DeliverySettings {
  talabatEnabled: boolean;
  snoouEnabled: boolean;
  deliverooEnabled: boolean;
  autoAcceptOrders: boolean;
}

export function LeftPanel() {
  const { language, orderSource, setOrderSource } = usePOS();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    talabatEnabled: true,
    snoouEnabled: true,
    deliverooEnabled: false,
    autoAcceptOrders: false
  });

  useEffect(() => {
    fetchDeliverySettings();
  }, []);

  const fetchDeliverySettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings?.deliverySettings) {
          setDeliverySettings(data.settings.deliverySettings);
        }
      }
    } catch (error) {
      console.error('Failed to fetch delivery settings:', error);
    }
  };

  const allOrderSources = [
    { id: "dine-in", icon: "fas fa-utensils", key: "dineIn", color: "text-blue-600" },
    { id: "takeaway", icon: "fas fa-shopping-bag", key: "takeaway", color: "text-blue-600" },
    { id: "talabat", icon: "fas fa-motorcycle", label: "Talabat", labelAr: "طلبات", color: "text-blue-600" },
    { id: "snoonu", icon: "fas fa-truck", label: "Snoonu", labelAr: "سنونو", color: "text-blue-600" },
  ];

  // Filter order sources based on delivery settings
  const orderSources = allOrderSources.filter(source => {
    if (source.id === "dine-in" || source.id === "takeaway") return true;
    if (source.id === "talabat") return deliverySettings.talabatEnabled;
    if (source.id === "snoonu") return deliverySettings.snoouEnabled;
    return false;
  });

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 p-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-gray-100 hover:scrollbar-thumb-orange-400" data-testid="left-panel">
      {/* Header */}
      <div className="flex items-center justify-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            {t('orderType', language)}
          </h2>
          {/* Order Source Selector */}
          <div className="flex bg-gray-100 rounded-2xl p-2 space-x-2">
            {orderSources.map((source) => (
              <Button
                key={source.id}
                variant="ghost"
                size="sm"
                className={`touch-target text-sm px-4 py-2 rounded-xl transition-all duration-200 ${
                  orderSource === source.id 
                    ? source.color + " font-semibold" 
                    : "hover:bg-white hover:shadow-sm text-gray-600"
                }`}
                onClick={() => setOrderSource(source.id as OrderSource)}
                data-testid={`button-order-source-${source.id}`}
              >
                <i className={`${source.icon} mr-2`}></i>
                <span className="font-medium">
                  {source.key ? t(source.key as any, language) : (language === "ar" ? source.labelAr : source.label)}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <CategoriesGrid 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Items Grid */}
      <ItemsGrid categoryId={selectedCategory} />
    </div>
  );
}
