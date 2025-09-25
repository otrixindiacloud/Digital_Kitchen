import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Order, OrderItem } from "@shared/schema";

interface KitchenDisplayProps {
  onClose: () => void;
}

type OrderWithItems = Order & { items: OrderItem[] };

export function KitchenDisplay({ onClose }: KitchenDisplayProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/kitchen/orders"],
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kitchen/orders"] });
    },
    onError: (error) => {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBumpOrder = (orderId: string) => {
    updateOrderStatusMutation.mutate({ orderId, status: "ready" });
  };

  const handleRecallOrder = (orderId: string) => {
    updateOrderStatusMutation.mutate({ orderId, status: "preparing" });
  };

  const getOrderTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);
    return `${diffMins.toString().padStart(2, '0')}:${diffSecs.toString().padStart(2, '0')}`;
  };

  const getOrderTypeDisplay = (type: string, source: string, tableNumber?: number | null) => {
    if (type === "dine-in") return `Dine-In • Table ${tableNumber || "?"}`;
    if (source === "talabat") return "Talabat Delivery";
    if (source === "snoonu") return "Snoonu Delivery";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="fixed inset-0 bg-background z-40" data-testid="kitchen-display">
      <div className="h-full flex flex-col">
        <div className="bg-card border-b border-border p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary flex items-center">
            <i className="fas fa-kitchen-set mr-3"></i>
            Kitchen Display System
            <span className="mr-3 text-lg">/ نظام عرض المطبخ</span>
          </h1>
          <Button
            variant="destructive"
            onClick={onClose}
            data-testid="button-close-kds"
          >
            <i className="fas fa-times mr-2"></i>
            Close / إغلاق
          </Button>
        </div>
        
        <div className="flex-1 p-4">
          {isLoading ? (
            <div className="grid grid-cols-3 gap-4 h-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card border rounded-lg p-4 animate-pulse">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-muted rounded"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <i className="fas fa-clipboard-check text-6xl mb-4"></i>
                <h2 className="text-2xl font-bold mb-2">No Orders in Kitchen</h2>
                <p>All orders have been completed</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 h-full">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-card border-2 border-warning rounded-lg p-4 space-y-3"
                  data-testid={`kitchen-order-${order.orderNumber}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">#{order.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        {getOrderTypeDisplay(order.type, order.source, order.tableNumber)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt || new Date()).toLocaleTimeString()}
                      </p>
                      <div className="bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs font-bold">
                        {getOrderTime(order.createdAt ? order.createdAt.toString() : new Date().toISOString())}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {order.items.map((item) => {
                      const itemName = item.itemName as { en: string; ar: string };
                      const sizeName = item.sizeName as { en: string; ar: string } | null;
                      
                      return (
                        <div key={item.id} className="bg-background rounded p-2">
                          <p className="font-medium">
                            {item.quantity}x {itemName.en}
                            {sizeName && ` (${sizeName.en})`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {itemName.ar} {sizeName && `(${sizeName.ar})`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1 bg-success text-success-foreground"
                      onClick={() => handleBumpOrder(order.id)}
                      disabled={updateOrderStatusMutation.isPending}
                      data-testid={`button-bump-order-${order.orderNumber}`}
                    >
                      <i className="fas fa-check mr-1"></i>
                      Ready
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-warning text-warning-foreground"
                      onClick={() => handleRecallOrder(order.id)}
                      disabled={updateOrderStatusMutation.isPending}
                      data-testid={`button-recall-order-${order.orderNumber}`}
                    >
                      <i className="fas fa-undo"></i>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
