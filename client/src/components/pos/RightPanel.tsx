import { Cart } from "./Cart";
import { PaymentSection } from "./PaymentSection";
import React from "react";
import { usePOS } from "@/store/posStore";
import { Button } from "@/components/ui/button";

export function RightPanel() {
  const { orderSource, tableNumber, setTableNumber } = usePOS();

  const showTableSelection = orderSource === "dine-in";

  return (
    <div className="w-96 bg-gradient-to-b from-gray-50 to-gray-100 border-l border-gray-200 flex flex-col" data-testid="right-panel">
      {/* Cart Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center text-gray-800">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
              <i className="fas fa-shopping-cart text-white text-sm"></i>
            </div>
            Current Order
          </h2>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Order #1001</p>
            <p className="text-xs text-gray-500 arabic-text">الطلب رقم ١٠٠١#</p>
          </div>
        </div>
        
        {/* Table Number (for Dine-In) */}
        {showTableSelection && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Table / الطاولة:</span>
              <div className="flex space-x-2">
                {tableNumber && (
                  <Button
                    variant="default"
                    size="icon"
                    className="w-12 h-12 font-bold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg"
                    data-testid={`text-table-${tableNumber}`}
                  >
                    {tableNumber}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl"
                  onClick={() => {
                    const table = prompt("Enter table number:");
                    if (table) setTableNumber(parseInt(table));
                  }}
                  data-testid="button-select-table"
                >
                  <i className="fas fa-plus text-blue-600"></i>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <Cart />

      {/* Payment Section */}
      <PaymentSection />
    </div>
  );
}
