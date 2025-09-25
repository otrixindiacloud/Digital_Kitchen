import React from "react";
import { Button } from "@/components/ui/button";
import { usePOS } from "@/store/posStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function PaymentSection() {
  const { 
    cartItems, 
    orderSource, 
    tableNumber, 
    subtotal, 
    serviceCharge, 
    total,
    clearCart 
  } = usePOS();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const processOrderMutation = useMutation({
    mutationFn: async (paymentMethod: string) => {
      // Create order
      const orderResponse = await apiRequest("POST", "/api/orders", {
        type: orderSource === "dine-in" ? "dine-in" : orderSource === "takeaway" ? "takeaway" : "delivery",
        source: orderSource === "talabat" || orderSource === "snoonu" ? orderSource : "pos",
        tableNumber: orderSource === "dine-in" ? tableNumber : null,
        subtotal: subtotal.toFixed(2),
        serviceCharge: serviceCharge.toFixed(2),
        total: total.toFixed(2),
      });

      const order = await orderResponse.json();

      // Add order items
      const itemsData = cartItems.map(item => ({
        itemId: item.itemId,
        itemName: item.name,
        sizeId: item.sizeId,
        sizeName: item.sizeName,
        quantity: item.quantity,
        unitPrice: item.price.toFixed(2),
        totalPrice: (item.price * item.quantity).toFixed(2),
      }));

      await apiRequest("POST", `/api/orders/${order.id}/items`, itemsData);

      // Process payment
      const paymentResponse = await apiRequest("POST", `/api/orders/${order.id}/payment`, {
        method: paymentMethod.toUpperCase(),
        amount: total.toFixed(2),
        status: "completed",
      });

      return { order, payment: await paymentResponse.json() };
    },
    onSuccess: () => {
      toast({
        title: "Order Processed Successfully",
        description: "Order has been sent to kitchen",
      });
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["/api/kitchen/orders"] });
    },
    onError: (error) => {
      toast({
        title: "Error Processing Order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const paymentMethods = [
    {
      id: "cash",
      icon: "fas fa-money-bills",
      label: "Cash Payment",
      labelAr: "دفع نقدي",
      className: "bg-success text-success-foreground",
    },
    {
      id: "card",
      icon: "fas fa-credit-card", 
      label: "Card Payment",
      labelAr: "دفع بالبطاقة",
      className: "bg-primary text-primary-foreground",
    },
    {
      id: "credit",
      icon: "fas fa-clock",
      label: "Credit (Aggregator)",
      labelAr: "ائتمان المجمع",
      className: "bg-secondary text-secondary-foreground",
    },
  ];

  const isDisabled = cartItems.length === 0 || processOrderMutation.isPending;
  const isProcessing = processOrderMutation.isPending;

  return (
    <div className="border-t border-gray-200 bg-white" data-testid="payment-section">
      {/* Order Summary */}
      <div className="p-6 border-b border-gray-200 space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal / المجموع الفرعي:</span>
            <span className="font-medium text-gray-800" data-testid="text-subtotal">QR {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Charge (10%) / رسوم الخدمة:</span>
            <span className="font-medium text-gray-800" data-testid="text-service-charge">QR {serviceCharge.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between text-xl font-bold">
              <span className="text-gray-800">Total / الإجمالي:</span>
              <span className="text-blue-600" data-testid="text-total">QR {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1 bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 rounded-xl"
            disabled={isDisabled}
            data-testid="button-add-discount"
          >
            <i className="fas fa-percent mr-2"></i>
            Discount
          </Button>
          <Button
            variant="destructive"
            className="flex-1 bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 rounded-xl"
            disabled={isDisabled}
            onClick={clearCart}
            data-testid="button-void-order"
          >
            <i className="fas fa-trash mr-2"></i>
            Void
          </Button>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-bold flex items-center text-gray-800">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
            <i className="fas fa-credit-card text-white text-sm"></i>
          </div>
          Payment / الدفع
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {paymentMethods.map((method) => (
            <Button
              key={method.id}
              className={`tender-btn h-auto py-4 px-6 text-left flex items-center justify-between rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 ${
                method.id === 'cash' ? 'bg-green-500 hover:bg-green-600 text-white' :
                method.id === 'card' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
              onClick={() => processOrderMutation.mutate(method.id)}
              disabled={isDisabled}
              data-testid={`button-payment-${method.id}`}
            >
              <div className="flex items-center">
                <i className={`${method.icon} mr-4 text-xl`}></i>
                <div>
                  <p className="font-semibold text-base">{method.label}</p>
                  <p className="text-sm opacity-90">{method.labelAr}</p>
                </div>
              </div>
              <i className="fas fa-chevron-right text-lg"></i>
            </Button>
          ))}
        </div>

        {/* Process Order Button */}
        <Button
          className="w-full py-5 font-bold text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
          disabled={isDisabled}
          onClick={() => processOrderMutation.mutate("cash")}
          data-testid="button-process-order"
        >
          {isProcessing ? (
            <>
              <i className="fas fa-spinner fa-spin mr-3"></i>
              Processing...
            </>
          ) : (
            <>
              <i className="fas fa-check mr-3"></i>
              Process Order / معالجة الطلب
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
