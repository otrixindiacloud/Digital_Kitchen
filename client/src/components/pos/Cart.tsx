import React from "react";
import { Button } from "@/components/ui/button";
import { usePOS } from "@/store/posStore";

export function Cart() {
  const { language, cartItems, updateCartItemQuantity, removeFromCart } = usePOS();

  const handleQuantityChange = (index: number, delta: number) => {
    const item = cartItems[index];
    const newQuantity = item.quantity + delta;
    
    if (newQuantity <= 0) {
      removeFromCart(index);
    } else {
      updateCartItemQuantity(index, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-shopping-cart text-3xl text-gray-400"></i>
          </div>
          <p className="text-lg font-medium mb-2">Cart is empty</p>
          <p className="arabic-text text-sm">السلة فارغة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4" data-testid="cart-items">
      {cartItems.map((item, index) => (
        <div 
          key={`${item.itemId}-${item.sizeId}-${index}`}
          className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
          data-testid={`cart-item-${index}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-800 mb-1">
                {language === "ar" ? item.name.ar : item.name.en}
              </h3>
              <p className="text-xs text-gray-500 mb-1">
                {language === "ar" ? item.name.en : item.name.ar}
              </p>
              {item.sizeName && (
                <p className="text-xs text-blue-600 font-medium mb-2">
                  {language === "ar" ? item.sizeName.ar : item.sizeName.en}
                </p>
              )}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-2 inline-block">
                <p className="text-blue-600 font-bold text-sm">QR {item.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                size="icon"
                variant="destructive"
                className="w-10 h-10 rounded-xl shadow-lg hover:shadow-xl"
                onClick={() => handleQuantityChange(index, -1)}
                data-testid={`button-decrease-quantity-${index}`}
              >
                <i className="fas fa-minus text-sm"></i>
              </Button>
              <div className="w-12 h-10 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
                <span 
                  className="text-center font-bold text-blue-600"
                  data-testid={`text-quantity-${index}`}
                >
                  {item.quantity}
                </span>
              </div>
              <Button
                size="icon"
                className="w-10 h-10 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl"
                onClick={() => handleQuantityChange(index, 1)}
                data-testid={`button-increase-quantity-${index}`}
              >
                <i className="fas fa-plus text-sm"></i>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
