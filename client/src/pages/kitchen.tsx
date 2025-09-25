import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/store/authStore';
import { usePOS } from '@/store/posStore';
import { t } from '@/lib/i18n';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  ChefHat, 
  CheckCircle, 
  AlertTriangle,
  Timer,
  Users,
  Zap,
  Bell,
  Eye,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export default function Kitchen() {
  const { state } = useAuth();
  const { language } = usePOS();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real orders from API
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["/api/kitchen/orders"],
    refetchInterval: isAutoRefresh ? 5000 : false, // Auto-refresh every 5 seconds when enabled
  });

  // Update order status mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      return apiRequest("PATCH", `/api/orders/${orderId}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kitchen/orders"] });
      toast({
        title: "Order Status Updated",
        description: "Order status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpdateOrderStatus = (orderId: string, status: string) => {
    updateOrderStatusMutation.mutate({ orderId, status });
  };

  // Mock data for demonstration (fallback)
  const mockOrders = [
    {
      id: '#1001',
      table: '5',
      customer: 'Ahmed Ali',
      customerAr: 'أحمد علي',
      items: [
        { name: 'Chicken Shawarma', nameAr: 'شاورما الدجاج', quantity: 2, status: 'preparing', time: '5 min' },
        { name: 'Falafel Wrap', nameAr: 'لف الفلافل', quantity: 1, status: 'ready', time: '3 min' },
        { name: 'Hummus Plate', nameAr: 'طبق الحمص', quantity: 1, status: 'preparing', time: '7 min' }
      ],
      total: 45.50,
      orderTime: '14:30',
      estimatedTime: '15 min',
      priority: 'high'
    },
    {
      id: '#1002',
      table: '12',
      customer: 'Sarah Johnson',
      customerAr: 'سارة جونسون',
      items: [
        { name: 'Beef Burger', nameAr: 'برجر اللحم', quantity: 1, status: 'ready', time: '2 min' },
        { name: 'French Fries', nameAr: 'البطاطس المقلية', quantity: 1, status: 'ready', time: '1 min' }
      ],
      total: 32.00,
      orderTime: '14:25',
      estimatedTime: '8 min',
      priority: 'normal'
    },
    {
      id: '#1003',
      table: '8',
      customer: 'Mohammed Hassan',
      customerAr: 'محمد حسن',
      items: [
        { name: 'Lamb Kebab', nameAr: 'كباب الضأن', quantity: 2, status: 'preparing', time: '10 min' },
        { name: 'Rice', nameAr: 'الأرز', quantity: 2, status: 'preparing', time: '8 min' },
        { name: 'Salad', nameAr: 'السلطة', quantity: 1, status: 'ready', time: '2 min' }
      ],
      total: 67.50,
      orderTime: '14:20',
      estimatedTime: '12 min',
      priority: 'normal'
    },
    {
      id: '#1004',
      table: '3',
      customer: 'Fatima Al-Zahra',
      customerAr: 'فاطمة الزهراء',
      items: [
        { name: 'Vegetable Soup', nameAr: 'شوربة الخضار', quantity: 1, status: 'ready', time: '1 min' },
        { name: 'Bread', nameAr: 'الخبز', quantity: 2, status: 'ready', time: '1 min' }
      ],
      total: 18.00,
      orderTime: '14:35',
      estimatedTime: '5 min',
      priority: 'low'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'served': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Process real API orders
  const preparingOrders = (orders as any[]).filter((order: any) => order.status === 'confirmed');
  const readyOrders = (orders as any[]).filter((order: any) => order.status === 'ready');
  
  // Calculate stats
  const totalOrders = (orders as any[]).length;
  const avgPrepTime = totalOrders > 0 ? Math.round((orders as any[]).reduce((acc: any, order: any) => {
    const createdAt = new Date(order.createdAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
    return acc + diffMinutes;
  }, 0) / totalOrders) : 0;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shadow-lg">
                <ChefHat className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {language === 'ar' ? 'عرض المطبخ' : 'Kitchen Display'}
                </h1>
                <p className="text-gray-600">
                  {language === 'ar' 
                    ? 'إدارة الطلبات في الوقت الفعلي'
                    : 'Real-time order management'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Current Time */}
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString()}
                </div>
              </div>

              {/* Auto Refresh Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                className={`rounded-xl focus:outline-none focus:ring-0 active:bg-transparent focus:bg-transparent ${
                  isAutoRefresh 
                    ? "bg-green-600 text-white focus:bg-green-600 active:bg-green-600" 
                    : "border-red-500 border-[1px] text-red-600 focus:bg-transparent active:bg-transparent"
                }`}
              >
                {isAutoRefresh ? (
                  <Pause className="h-4 w-4 mr-2 text-white" />
                ) : (
                  <Play className="h-4 w-4 mr-2 text-red-600" />
                )}
                {isAutoRefresh ? 'Auto' : 'Manual'}
              </Button>

              {/* Refresh Button */}
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-blue-500 border-[1px] text-blue-600 focus:outline-none focus:ring-0 focus:bg-transparent active:bg-transparent hover:bg-transparent"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/kitchen/orders"] })}
                disabled={isLoading}
              >
                <RotateCcw className="h-4 w-4 mr-2 text-blue-600" />
                {language === 'ar' ? 'تحديث' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{language === 'ar' ? 'جاري التحميل...' : 'Loading orders...'}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">
                {language === 'ar' ? 'خطأ في تحميل الطلبات' : 'Error loading orders'}
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-black">
                    {language === 'ar' ? 'الطلبات قيد التحضير' : 'Preparing Orders'}
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">{preparingOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-200 rounded-lg flex items-center justify-center">
                  <Timer className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-black">
                    {language === 'ar' ? 'الطلبات جاهزة' : 'Ready Orders'}
                  </p>
                  <p className="text-3xl font-bold text-green-600">{readyOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-black">
                    {language === 'ar' ? 'إجمالي الطلبات' : 'Total Orders'}
                  </p>
                  <p className="text-3xl font-bold text-orange-600">{totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-orange-200 rounded-lg flex items-center justify-center">
                  <ChefHat className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-black">
                    {language === 'ar' ? 'متوسط وقت التحضير' : 'Avg Prep Time'}
                  </p>
                  <p className="text-3xl font-bold text-purple-600">{avgPrepTime}m</p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Tabs */}
        <Tabs defaultValue="preparing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl p-2">
            <TabsTrigger value="preparing" className="rounded-lg">
              {language === 'ar' ? 'قيد التحضير' : 'Preparing'} ({preparingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="ready" className="rounded-lg">
              {language === 'ar' ? 'جاهزة' : 'Ready'} ({readyOrders.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-lg">
              {language === 'ar' ? 'الكل' : 'All'} ({(orders as any[]).length})
            </TabsTrigger>
          </TabsList>

          {/* Preparing Orders */}
          <TabsContent value="preparing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {preparingOrders.map((order: any) => (
                <Card key={order.id} className="bg-white border border-gray-200 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">#{order.orderNumber}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {order.tableNumber ? 
                            (language === 'ar' ? `الطاولة ${order.tableNumber}` : `Table ${order.tableNumber}`) : 
                            (language === 'ar' ? 'تيك أواي' : 'Takeaway')
                          } • {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                        {language === 'ar' ? 'قيد التحضير' : 'Preparing'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {order.customerName || (language === 'ar' ? 'عميل' : 'Customer')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items.map((item: any, index: number) => {
                        const itemName = item.itemName as { en: string; ar: string };
                        const sizeName = item.sizeName as { en: string; ar: string } | null;
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">
                                {item.quantity}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {language === 'ar' ? itemName.ar : itemName.en}
                                  {sizeName && ` (${language === 'ar' ? sizeName.ar : sizeName.en})`}
                                </p>
                                <p className="text-xs text-gray-500">QR {item.unitPrice}</p>
                              </div>
                            </div>
                            <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                              {language === 'ar' ? 'قيد التحضير' : 'Preparing'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">QR {order.total}</span>
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white rounded-lg"
                          onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                          disabled={updateOrderStatusMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {language === 'ar' ? 'جاهز' : 'Ready'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Ready Orders */}
          <TabsContent value="ready" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {readyOrders.map((order: any) => (
                <Card key={order.id} className="bg-white border border-green-200 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">#{order.orderNumber}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {order.tableNumber ? 
                            (language === 'ar' ? `الطاولة ${order.tableNumber}` : `Table ${order.tableNumber}`) : 
                            (language === 'ar' ? 'تيك أواي' : 'Takeaway')
                          } • {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                        {language === 'ar' ? 'جاهز' : 'Ready'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {order.customerName || (language === 'ar' ? 'عميل' : 'Customer')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items.map((item: any, index: number) => {
                        const itemName = item.itemName as { en: string; ar: string };
                        const sizeName = item.sizeName as { en: string; ar: string } | null;
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-sm">
                                {item.quantity}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {language === 'ar' ? itemName.ar : itemName.en}
                                  {sizeName && ` (${language === 'ar' ? sizeName.ar : sizeName.en})`}
                                </p>
                                <p className="text-xs text-gray-500">QR {item.unitPrice}</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                              {language === 'ar' ? 'جاهز' : 'Ready'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">QR {order.total}</span>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                          <Eye className="h-4 w-4 mr-2" />
                          {language === 'ar' ? 'تم التقديم' : 'Served'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* All Orders */}
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {(orders as any[]).map((order: any) => (
                <Card key={order.id} className="bg-white border border-gray-200 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-bold text-gray-900">#{order.orderNumber}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {order.tableNumber ? 
                            (language === 'ar' ? `الطاولة ${order.tableNumber}` : `Table ${order.tableNumber}`) : 
                            (language === 'ar' ? 'تيك أواي' : 'Takeaway')
                          } • {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge className={`text-xs ${
                        order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        order.status === 'ready' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {order.status === 'confirmed' ? (language === 'ar' ? 'قيد التحضير' : 'Preparing') :
                         order.status === 'ready' ? (language === 'ar' ? 'جاهز' : 'Ready') :
                         order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {order.customerName || (language === 'ar' ? 'عميل' : 'Customer')}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items.map((item: any, index: number) => {
                        const itemName = item.itemName as { en: string; ar: string };
                        const sizeName = item.sizeName as { en: string; ar: string } | null;
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">
                                {item.quantity}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {language === 'ar' ? itemName.ar : itemName.en}
                                  {sizeName && ` (${language === 'ar' ? sizeName.ar : sizeName.en})`}
                                </p>
                                <p className="text-xs text-gray-500">QR {item.unitPrice}</p>
                              </div>
                            </div>
                            <Badge className={`text-xs ${
                              order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              order.status === 'ready' ? 'bg-green-100 text-green-800 border-green-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                              {order.status === 'confirmed' ? (language === 'ar' ? 'قيد التحضير' : 'Preparing') :
                               order.status === 'ready' ? (language === 'ar' ? 'جاهز' : 'Ready') :
                               order.status}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">QR {order.total}</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="rounded-lg">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-lg">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
